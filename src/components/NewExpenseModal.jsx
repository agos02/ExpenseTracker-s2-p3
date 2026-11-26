import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useExpenses } from '../context/ExpensesContext'
import '../styles/NewExpenseModal.css'

const CATEGORIAS = ['Comida', 'Transporte', 'Servicios', 'Otros']

// Formulario modal para registrar nuevos gastos.
export default function NewExpenseModal({ onClose }) {
  const dialogRef = useRef(null)

  // Obtenemos la función que agrega gastos al Context.
  const { addExpense } = useExpenses()

  // Estados del formulario.
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('Comida')
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current

    // Abrimos el modal.
    if (dialog && !dialog.open) {
      dialog.showModal()
    }

    // Ajustamos el formulario cuando aparece el teclado virtual.
    const viewport = window.visualViewport

    const ajustarAlTeclado = () => {
      if (!dialog || !viewport) return

      const espacioInferior = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      )

      dialog.style.setProperty(
        '--keyboard-bottom',
        `${espacioInferior}px`
      )

      dialog.style.setProperty(
        '--visible-viewport-height',
        `${viewport.height}px`
      )
    }

    ajustarAlTeclado()

    viewport?.addEventListener('resize', ajustarAlTeclado)
    viewport?.addEventListener('scroll', ajustarAlTeclado)

    // Limpiamos los eventos al cerrar el formulario.
    return () => {
      viewport?.removeEventListener('resize', ajustarAlTeclado)
      viewport?.removeEventListener('scroll', ajustarAlTeclado)

      if (dialog?.open) {
        dialog.close()
      }
    }
  }, [])

  // --------------------------------------------------
  // GUARDAR UN GASTO
  // --------------------------------------------------
  const handleSubmit = (event) => {
    event.preventDefault()

    // Validamos que el nombre y el monto no estén vacíos.
    if (!nombre.trim() || !monto.trim()) {
      setMensaje({
        tipo: 'error',
        texto: 'Ingresá el nombre y el monto del gasto.',
      })
      return
    }

    // Convertimos el monto a número.
    const montoNumero = Number(
      monto.trim().replace(',', '.')
    )

    // Verificamos que el monto sea válido y mayor que cero.
    if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      setMensaje({
        tipo: 'error',
        texto: 'Ingresá un monto válido mayor a cero.',
      })
      return
    }

 const nuevoGasto = {
      descripcion: nombre.trim(),
      monto: montoNumero,
      categoria: categoria,
      notas: '',
    }

    try {
      // El Context se encarga de generar el ID y la fecha.
      addExpense(nuevoGasto)

      // Cerramos el formulario.
      onClose()
    } catch (error) {
      console.error('Error al registrar el gasto:', error)

      setMensaje({
        tipo: 'error',
        texto: 'No se pudo registrar el gasto.',
      })
    }
  }

  // Cerramos el modal al tocar el fondo.
  const onClickDialog = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  // Cerramos el modal al presionar Escape.
  const onCancelDialog = (event) => {
    event.preventDefault()
    onClose()
  }

  return createPortal(
    <dialog
      ref={dialogRef}
      className="new-expense-modal"
      aria-labelledby="new-expense-title"
      onClick={onClickDialog}
      onCancel={onCancelDialog}
    >
      <div className="new-expense-modal__sheet">

        <header className="new-expense-modal__header">
          <div
            className="new-expense-modal__handle"
            aria-hidden="true"
          />

          <div className="new-expense-modal__heading">
            <h2 id="new-expense-title">
              Nuevo gasto
            </h2>

            <button
              type="button"
              className="new-expense-modal__close"
              aria-label="Cerrar formulario"
              onClick={onClose}
            >
              ×
            </button>
          </div>

          <p>
            Completá los datos para registrar un gasto.
          </p>
        </header>

        <form
          className="new-expense-modal__form"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* NOMBRE DEL GASTO */}
          <div className="new-expense-modal__field">
            <label htmlFor="new-expense-name">
              Nombre del gasto
            </label>

            <input
              id="new-expense-name"
              name="nombre"
              type="text"
              placeholder="Ej.: Compra en supermercado"
              value={nombre}
              onChange={(event) => {
                setNombre(event.target.value)
                setMensaje(null)
              }}
              autoComplete="off"
              required
            />
          </div>

          {/* MONTO */}
          <div className="new-expense-modal__field">
            <label htmlFor="new-expense-amount">
              Monto
            </label>

            <input
              id="new-expense-amount"
              name="monto"
              type="text"
              inputMode="decimal"
              placeholder="Ej.: 15000"
              value={monto}
              onChange={(event) => {
                setMonto(event.target.value)
                setMensaje(null)
              }}
              autoComplete="off"
              required
            />
          </div>

          {/* CATEGORÍAS */}
          <fieldset className="new-expense-modal__categories">
            <legend>Categoría</legend>

            <div className="new-expense-modal__chips">
              {CATEGORIAS.map((opcion) => (
                <button
                  type="button"
                  key={opcion}
                  className={
                    `new-expense-modal__chip ${
                      categoria === opcion
                        ? 'new-expense-modal__chip--selected'
                        : ''
                    }`
                  }
                  aria-pressed={categoria === opcion}
                  onClick={() => {
                    setCategoria(opcion)
                    setMensaje(null)
                  }}
                >
                  {opcion}
                </button>
              ))}
            </div>
          </fieldset>

          {/* MENSAJES DE VALIDACIÓN */}
          {mensaje && (
            <p
              className={
                `new-expense-modal__message new-expense-modal__message--${mensaje.tipo}`
              }
              role={mensaje.tipo === 'error' ? 'alert' : 'status'}
            >
              {mensaje.texto}
            </p>
          )}

          {/* BOTONES */}
          <div className="new-expense-modal__actions">
            <button
              type="submit"
              className="new-expense-modal__save"
            >
              Guardar
            </button>

            <button
              type="button"
              className="new-expense-modal__cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>,
    document.body
  )
}
