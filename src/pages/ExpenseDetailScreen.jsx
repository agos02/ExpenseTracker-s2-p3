
import { useNavigate, useParams } from 'react-router-dom'
import CategoryBadge from '../components/CategoryBadge'
import AppIcon from '../components/AppIcon'
import { buscarGastoSimulado } from '../data/demoExpenses'
import { useExpenses } from '../context/ExpensesContext'
import '../styles/ExpenseDetailScreen.css'

// Formato de moneda en pesos argentinos.
const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

// Convierte la fecha del gasto en un texto legible.
function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'

  // Los gastos simulados tienen fecha corta (AAAA-MM-DD).
  // Los reales tienen una fecha ISO con hora.
  const valor = /^\d{4}-\d{2}-\d{2}$/.test(fecha)
    ? new Date(`${fecha}T12:00:00`)
    : new Date(fecha)

  return Number.isNaN(valor.getTime())
    ? fecha
    : valor.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
}

export default function ExpenseDetailScreen() {
  // Obtenemos el ID desde la URL.
  const { id } = useParams()
  const navigate = useNavigate()

  // Obtenemos los gastos y las funciones del Context.
  const {
    expenses,
    isLoaded,
    removeExpense,
  } = useExpenses()

  // Buscamos el gasto real en el Context.
  const gastoReal = expenses.find(
    (item) => String(item.id) === id
  )

  // Conservamos el detalle de los gastos simulados.
  // Solo buscamos un simulado si no existe un gasto real.
  const gastoSimulado = gastoReal
    ? null
    : buscarGastoSimulado(id)

  const gasto = gastoReal ?? gastoSimulado

  // --------------------------------------------------
  // VOLVER A LA PANTALLA ANTERIOR
  // --------------------------------------------------
  const volver = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/expenses')
    }
  }

  // --------------------------------------------------
  // ELIMINAR UN GASTO
  // --------------------------------------------------
  const confirmarEliminacion = () => {
    // No permitimos eliminar los gastos simulados.
    if (!gastoReal) return

    // Pedimos confirmación antes de eliminar.
    const confirmado = window.confirm(
      `¿Querés eliminar "${gastoReal.descripcion}"? Esta acción no se puede deshacer.`
    )

    // Si la persona cancela, no hacemos nada.
    if (!confirmado) return

    // Eliminamos el gasto desde el Context.
    removeExpense(gastoReal.id)

    // Volvemos al listado.
    navigate('/expenses', { replace: true })
  }

  return (
    <main className="expense-detail">
      <div className="expense-detail__container">

        <header className="expense-detail__header">
          <button
            type="button"
            className="expense-detail__back"
            onClick={volver}
          >
            <AppIcon nombre="volver" size={19} />
            Volver
          </button>

          <h1>Detalle del gasto</h1>

          <p>
            Información del movimiento seleccionado.
          </p>
        </header>

        {/* Esperamos a que los gastos estén disponibles. */}
        {!isLoaded ? (
          <section
            className="expense-detail__card"
            role="status"
          >
            <p>Cargando gasto...</p>
          </section>

        ) : gasto ? (

          // MOSTRAMOS EL GASTO ENCONTRADO
          <section
            className="expense-detail__card"
            aria-label="Información del gasto"
          >
            <div className="expense-detail__hero">
              <CategoryBadge categoria={gasto.categoria} />

              <div className="expense-detail__hero-text">
                <h2>
                  {gasto.descripcion || gasto.nombre || 'Gasto'}
                </h2>

                <p>{gasto.categoria || 'Otros'}</p>
              </div>
            </div>

            <dl className="expense-detail__fields">
              <div className="expense-detail__field">
                <dt>Descripción</dt>
                <dd>
                  {gasto.descripcion || gasto.nombre || 'Sin descripción'}
                </dd>
              </div>

              <div className="expense-detail__field">
                <dt>Monto</dt>
                <dd className="expense-detail__amount">
                  {moneda.format(gasto.monto)}
                </dd>
              </div>

              <div className="expense-detail__field">
                <dt>Categoría</dt>
                <dd>{gasto.categoria || 'Otros'}</dd>
              </div>

              <div className="expense-detail__field">
                <dt>Fecha</dt>
                <dd>{formatearFecha(gasto.fecha)}</dd>
              </div>

              <div className="expense-detail__field expense-detail__field--notes">
                <dt>Notas</dt>
                <dd>
                  {gasto.notas || 'Sin notas adicionales.'}
                </dd>
              </div>
            </dl>

            {/* Solo los gastos reales se pueden eliminar. */}
            {gastoReal ? (
              <div className="expense-detail__actions">
                <button
                  type="button"
                  className="expense-detail__delete"
                  onClick={confirmarEliminacion}
                >
                  Eliminar gasto
                </button>
              </div>
            ) : (
              <p className="expense-detail__demo-notice">
                Este gasto es un dato de demostración
                y no se puede eliminar.
              </p>
            )}
          </section>

        ) : (

          // MOSTRAMOS UN MENSAJE SI NO EXISTE
          <section
            className="expense-detail__card expense-detail__missing"
            role="status"
          >
            <h2>Gasto no encontrado</h2>

            <p>
              No existe un gasto con el identificador «{id}».
            </p>

            <button
              type="button"
              onClick={() => navigate('/expenses')}
            >
              Ver listado de gastos
            </button>
          </section>
        )}
      </div>
    </main>
  )
}
