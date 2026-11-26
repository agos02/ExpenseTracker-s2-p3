
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'

import { db } from '../services/firebase'

import {
  SETTINGS_STORAGE_KEY,
} from '../data/storageKeys'

// --------------------------------------------------
// CONTEXT Y AJUSTES INICIALES
// --------------------------------------------------

const ExpensesContext = createContext(null)

const AJUSTES_INICIALES = {
  notificaciones: false,
  modoOscuro: false,
}

// Colección compartida con React Native.
const gastosRef = collection(db, 'expenses')

// --------------------------------------------------
// RECUPERAR AJUSTES DESDE LOCALSTORAGE
// --------------------------------------------------

function leerAjustes() {
  try {
    const ajustesJSON = localStorage.getItem(
      SETTINGS_STORAGE_KEY
    )

    if (ajustesJSON === null) {
      return AJUSTES_INICIALES
    }

    const datos = JSON.parse(ajustesJSON)

    // Validamos que los datos sean correctos.
    if (
      !datos ||
      typeof datos !== 'object' ||
      typeof datos.notificaciones !== 'boolean' ||
      typeof datos.modoOscuro !== 'boolean'
    ) {
      throw new Error('Ajustes inválidos')
    }

    return {
      notificaciones: datos.notificaciones,
      modoOscuro: datos.modoOscuro,
    }
  } catch (error) {
    console.error(
      'Error al recuperar los ajustes:',
      error
    )

    return AJUSTES_INICIALES
  }
}

// --------------------------------------------------
// PROVIDER
// --------------------------------------------------

export function ExpensesProvider({ children }) {

  // Los gastos ahora vienen de Firestore.
  const [expenses, setExpenses] = useState([])

  // Los ajustes siguen guardándose en localStorage.
  const [settings, setSettings] = useState(leerAjustes)

  // Indicamos cuándo llegaron los datos de Firestore.
  const [isLoaded, setIsLoaded] = useState(false)

  // Guardamos un posible error de conexión.
  const [errorCarga, setErrorCarga] = useState(null)

  // Permite volver a intentar la conexión.
  const [intentoCarga, setIntentoCarga] = useState(0)

  // --------------------------------------------------
  // RECIBIR GASTOS EN TIEMPO REAL
  // --------------------------------------------------

  useEffect(() => {

    // Ordenamos los gastos por fecha, del más nuevo al más viejo.
    const consulta = query(
      gastosRef,
      orderBy('createdAt', 'desc')
    )

    // Escuchamos los cambios en Firestore.
    const cancelarSuscripcion = onSnapshot(
      consulta,

      (snapshot) => {

        // Convertimos los documentos al formato
        // que utilizan nuestras pantallas.
        const gastosActualizados = snapshot.docs.map(
          (documento) => {

            const datos = documento.data({
              serverTimestamps: 'estimate',
            })

            // Convertimos Timestamp de Firebase a fecha ISO.
            const fechaFirestore =
              datos.createdAt?.toDate?.()

            return {
              id: documento.id,

              // Firestore utiliza nombres en inglés.
              // Las pantallas siguen utilizando español.
              descripcion: datos.title ?? '',
              monto: datos.amount ?? 0,
              categoria: datos.category ?? 'Otros',
              notas: datos.notes ?? '',

              fecha:
                fechaFirestore instanceof Date &&
                !Number.isNaN(fechaFirestore.getTime())
                  ? fechaFirestore.toISOString()
                  : '',
            }
          }
        )

        // Actualizamos los gastos compartidos.
        setExpenses(gastosActualizados)

        // Finalizó la primera carga.
        setIsLoaded(true)
        setErrorCarga(null)
      },

      (error) => {
        console.error(
          'Error al cargar los gastos:',
          error
        )

        setErrorCarga(
          'No se pudieron cargar los gastos desde Firestore.'
        )

        setIsLoaded(true)
      }
    )

    // Cancelamos la escucha al desmontar.
    return () => cancelarSuscripcion()

  }, [intentoCarga])

  // --------------------------------------------------
  // GUARDAR AJUSTES EN LOCALSTORAGE
  // --------------------------------------------------

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      )
    } catch (error) {
      console.error(
        'Error al guardar los ajustes:',
        error
      )
    }
  }, [settings])

  // --------------------------------------------------
  // AGREGAR UN GASTO EN FIRESTORE
  // --------------------------------------------------

  const addExpense = (data) => {

    // Convertimos los nombres al formato de Firestore.
    const nuevoGasto = {
      title: data.descripcion,
      amount: Number(data.monto),
      category: data.categoria,
      notes: data.notas ?? '',
      createdAt: serverTimestamp(),
    }

    // Firestore genera automáticamente el ID.
    return addDoc(gastosRef, nuevoGasto)
      .catch((error) => {
        console.error(
          'Error al agregar el gasto:',
          error
        )

        window.alert(
          'No se pudo guardar el gasto en Firestore.'
        )
      })
  }

  // --------------------------------------------------
  // ELIMINAR UN GASTO DE FIRESTORE
  // --------------------------------------------------

  const removeExpense = (id) => {

    const documentoRef = doc(
      db,
      'expenses',
      String(id)
    )

    return deleteDoc(documentoRef)
      .catch((error) => {
        console.error(
          'Error al eliminar el gasto:',
          error
        )

        window.alert(
          'No se pudo eliminar el gasto de Firestore.'
        )
      })
  }

  // --------------------------------------------------
  // MODIFICAR AJUSTES
  // --------------------------------------------------

  const updateSettings = (cambios) => {
    setSettings((actuales) => ({
      ...actuales,
      ...cambios,
    }))
  }

  // --------------------------------------------------
  // REINTENTAR LA CONEXIÓN
  // --------------------------------------------------

  const reintentarCarga = () => {
    setErrorCarga(null)
    setIsLoaded(false)
    setIntentoCarga((actual) => actual + 1)
  }

  // --------------------------------------------------
  // COMPARTIR DATOS CON LAS PANTALLAS
  // --------------------------------------------------

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        addExpense,
        removeExpense,
        settings,
        updateSettings,
        errorCarga,
        reintentarCarga,
      }}
    >
      {errorCarga ? (
        <main style={{ padding: '24px', textAlign: 'center' }}>
          <p role="alert">{errorCarga}</p>

          <button
            type="button"
            onClick={reintentarCarga}
          >
            Reintentar
          </button>
        </main>
      ) : (
        children
      )}
    </ExpensesContext.Provider>
  )
}

// --------------------------------------------------
// HOOK PARA UTILIZAR EL CONTEXT
// --------------------------------------------------

export function useExpenses() {
  const contexto = useContext(ExpensesContext)

  if (!contexto) {
    throw new Error(
      'useExpenses debe usarse dentro de ExpensesProvider'
    )
  }

  return contexto
}
