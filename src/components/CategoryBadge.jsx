import AppIcon from './AppIcon'
import '../styles/CategoryBadge.css'

const categorias = {
  Comida: { clase: 'comida', icono: 'comida' },
  Transporte: { clase: 'transporte', icono: 'transporte' },
  Servicios: { clase: 'servicios', icono: 'servicios' },
  Otros: { clase: 'otros', icono: 'otros' },
}

export default function CategoryBadge({ categoria }) {
  const configuracion = categorias[categoria] ?? categorias.Otros

  return (
    <span
      className={`category-badge category-badge--${configuracion.clase}`}
      role="img"
      aria-label={`Categoría: ${categoria || 'Otros'}`}
    >
      <AppIcon nombre={configuracion.icono} size={23} />
    </span>
  )
}
