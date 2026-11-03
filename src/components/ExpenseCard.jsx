import { Link } from 'react-router-dom'
import CategoryBadge from './CategoryBadge'
import AppIcon from './AppIcon'
import '../styles/ExpenseCard.css'

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

// Toda la tarjeta es un enlace real. Al navegar enviamos solamente el ID:
// el detalle consulta el gasto desde la URL, incluso después de recargar.
export default function ExpenseCard({ gasto }) {
  const descripcion = gasto.descripcion || gasto.nombre || 'Gasto'

  return (
    <article className="expense-card">
      <Link
        className="expense-card__link"
        to={`/expenses/${encodeURIComponent(gasto.id)}`}
        aria-label={`Ver detalle de ${descripcion}: ${moneda.format(gasto.monto)}`}
      >
        <CategoryBadge categoria={gasto.categoria} />
        <span className="expense-card__info">
          <span className="expense-card__name">{descripcion}</span>
          <span className="expense-card__category">{gasto.categoria}</span>
        </span>
        <strong className="expense-card__amount">{moneda.format(gasto.monto)}</strong>
        <AppIcon nombre="siguiente" size={20} className="expense-card__arrow" />
      </Link>
    </article>
  )
}
