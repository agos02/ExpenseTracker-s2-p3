import { lazy, Suspense, useMemo, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import Boton from '../components/Boton'
import ExpenseCard from '../components/ExpenseCard'
import mockExpenses from '../data/mockExpenses'
import { demoExpenses } from '../data/demoExpenses'
import '../styles/ExpensesScreen.css'

const moneda = new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
})

// El paquete de virtualización se carga solo cuando se selecciona ese modo.
const VirtualExpenseList = lazy(() => import('../components/VirtualExpenseList'))

// Listado migrado de PantallaGastos.js; conserva el modal de la US anterior.
export default function ExpensesScreen() {
  const navigate = useNavigate();
  const { openNewExpenseModal } = useOutletContext();
  const [metodo, setMetodo] = useState('map');
  const [muestra, setMuestra] = useState('real');

  const gastos = muestra === 'demo' ? demoExpenses : mockExpenses;
  const total = useMemo(() => gastos.reduce((suma, gasto) => suma + Number(gasto.monto || 0), 0), [gastos]);

  return (
    <main className="expenses-screen">
      <header className="expenses-screen__header">
        <h1>Listado de gastos</h1>
        <p>Consultá tus movimientos y tocá cualquiera para ver su detalle.</p>
      </header>

      <section className="expenses-screen__content" aria-label="Gastos registrados">
        <div className="expenses-bonus__controls" aria-label="Comparación de renderizado">
          <fieldset className="expenses-bonus__fieldset">
            <legend>Datos a mostrar</legend>
            <div className="expenses-bonus__options">
              <button type="button" aria-pressed={muestra === 'real'}
                className={muestra === 'real' ? 'selected' : ''}
                onClick={() => setMuestra('real')}>3 gastos de ejemplo
              </button>
              <button type="button" aria-pressed={muestra === 'demo'}
                className={muestra === 'demo' ? 'selected' : ''}
                onClick={() => setMuestra('demo')}>800 simulados
              </button>
            </div>
          </fieldset>
          <fieldset className="expenses-bonus__fieldset">
            <legend>Método de listado</legend>
            <div className="expenses-bonus__options">
              <button type="button" aria-pressed={metodo === 'map'}
                className={metodo === 'map' ? 'selected' : ''}
                onClick={() => setMetodo('map')}>map() / ScrollView
              </button>
              <button type="button" aria-pressed={metodo === 'virtual'}
                className={metodo === 'virtual' ? 'selected' : ''}
                onClick={() => setMetodo('virtual')}>TanStack Virtual / FlatList
              </button>
            </div>
          </fieldset>
          <p className="expenses-bonus__hint">
            {metodo === 'map'
              ? `map() genera ${gastos.length} tarjetas en el DOM.`
              : `TanStack Virtual muestra solo las tarjetas cercanas a la zona visible de ${gastos.length} gastos.`}
            {muestra === 'demo' && ' Estos movimientos son simulados y no se guardan.'}
          </p>
        </div>

        {gastos.length === 0 ? (
          <p className="expenses-screen__empty">Todavía no hay gastos registrados.</p>
        ) : metodo === 'virtual' ? (
          <Suspense fallback={<p role="status">Preparando listado virtualizado…</p>}>
            <VirtualExpenseList key={muestra} gastos={gastos} />
          </Suspense>
        ) : (
          <ul className="expenses-screen__list">
            {gastos.map((gasto) => (
              <li key={gasto.id}><ExpenseCard gasto={gasto} /></li>
            ))}
          </ul>
        )}

        <div className="expenses-bonus__total" aria-live="polite">
          <span>{muestra === 'demo' ? 'Total del listado simulado' : 'Total de gastos'}</span>
          <strong>{moneda.format(total)}</strong>
          <small>{gastos.length} movimientos</small>
        </div>
      </section>

      <section className="expenses-screen__actions" aria-label="Acciones de gastos">
        <Boton titulo="Registrar Nuevo Gasto" onPress={openNewExpenseModal} />
        <Boton titulo="Volver al inicio" variante="secundario" onPress={() => navigate('/')} />
      </section>
    </main>
  )
}
