import { useState } from 'react'
import { NavLink, Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom'
import NewExpenseModal from '../components/NewExpenseModal'
import AppIcon from '../components/AppIcon'
import '../styles/MainLayout.css'

export default function MainLayout() {
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isNewExpenseUrl = Boolean(useMatch('/expenses/nuevo'))

  // Modal único compartido por Inicio y Gastos.
  const openNewExpenseModal = () => setIsModalOpen(true)
  const closeNewExpenseModal = () => {
    setIsModalOpen(false)
    if (isNewExpenseUrl) navigate('/expenses', { replace: true })
  }

  return (
    <div className="main-layout">
      <div className="main-layout-content">
        <div key={location.pathname} className="route-transition">
          <Outlet context={{ openNewExpenseModal }} />
        </div>
      </div>

      <nav className="bottom-navigation" aria-label="Navegación principal">
        <NavLink to="/" end className={({ isActive }) => `bottom-navigation-link ${isActive ? 'active' : ''}`}>
          <span className="bottom-navigation-icon"><AppIcon nombre="inicio" /></span><span>Inicio</span>
        </NavLink>
        <NavLink to="/expenses" className={({ isActive }) => `bottom-navigation-link ${isActive ? 'active' : ''}`}>
          <span className="bottom-navigation-icon"><AppIcon nombre="gastos" /></span><span>Gastos</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `bottom-navigation-link ${isActive ? 'active' : ''}`}>
          <span className="bottom-navigation-icon"><AppIcon nombre="ajustes" /></span><span>Ajustes</span>
        </NavLink>
      </nav>

      {(isModalOpen || isNewExpenseUrl) && <NewExpenseModal onClose={closeNewExpenseModal} />}
    </div>
  )
}