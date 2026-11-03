import { useNavigate, useParams } from 'react-router-dom'
import CategoryBadge from '../components/CategoryBadge'
import AppIcon from '../components/AppIcon'
import mockExpenses from '../data/mockExpenses'
import { buscarGastoSimulado } from '../data/demoExpenses'
import '../styles/ExpenseDetailScreen.css'

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha'
  const [anio, mes, dia] = fecha.split('-').map(Number)
  const valor = new Date(anio, mes - 1, dia)
  return Number.isNaN(valor.getTime()) ? fecha : valor.toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// La ruta es la fuente de verdad: jamás dependemos de state ni de un objeto
// entregado por navigate(). Esto funciona al pegar/recargar /expenses/:id.
export default function ExpenseDetailScreen() {
  const { id } = useParams()
  const navigate = useNavigate()
  const gasto = mockExpenses.find((item) => String(item.id) === id) ?? buscarGastoSimulado(id)

  const volver = () => {
    // Si se llegó navegando dentro de la app, respetamos el historial.
    // Si se abrió el enlace directamente, volvemos al listado.
    if (window.history.state?.idx > 0) {
      navigate(-1)
    } else {
      navigate('/expenses')
    }
  }

  return (
    <main className="expense-detail">
      <div className="expense-detail__container">
        <header className="expense-detail__header">
          <button type="button" className="expense-detail__back" onClick={volver}>
            <AppIcon nombre="volver" size={19}/> Volver
          </button>
          <h1>Detalle del gasto</h1>
          <p>Información del movimiento seleccionado.</p>
        </header>

        {gasto ? (
          <section className="expense-detail__card" aria-label="Información del gasto">
            <div className="expense-detail__hero">
              <CategoryBadge categoria={gasto.categoria} />
              <div className="expense-detail__hero-text">
                <h2>{gasto.descripcion || gasto.nombre || 'Gasto'}</h2>
                <p>{gasto.categoria || 'Otros'}</p>
              </div>
            </div>
            <dl className="expense-detail__fields">
              <div className="expense-detail__field"><dt>Descripción</dt><dd>{gasto.descripcion || gasto.nombre || 'Sin descripción'}</dd></div>
              <div className="expense-detail__field"><dt>Monto</dt><dd className="expense-detail__amount">{moneda.format(gasto.monto)}</dd></div>
              <div className="expense-detail__field"><dt>Categoría</dt><dd>{gasto.categoria || 'Otros'}</dd></div>
              <div className="expense-detail__field"><dt>Fecha</dt><dd>{formatearFecha(gasto.fecha)}</dd></div>
              <div className="expense-detail__field expense-detail__field--notes"><dt>Notas</dt><dd>{gasto.notas || 'Sin notas adicionales.'}</dd></div>
            </dl>
          </section>
        ) : (
          <section className="expense-detail__card expense-detail__missing" role="status">
            <h2>Gasto no encontrado</h2>
            <p>No existe un gasto con el identificador «{id}».</p>
            <button type="button" onClick={() => navigate('/expenses')}>Ver listado de gastos</button>
          </section>
        )}
      </div>
    </main>
  )
}