import { useNavigate, useOutletContext } from 'react-router-dom'
import Boton from '../components/Boton'
import { useExpenses } from '../context/ExpensesContext'
import '../styles/HomeScreen.css'

export default function HomeScreen() {
  const navigate = useNavigate()
  const { openNewExpenseModal } = useOutletContext()

  // Obtenemos los gastos compartidos desde el Context.
  const { expenses, isLoaded } = useExpenses()

  // Calculamos el total utilizando los gastos reales.
  const totalRegistrado = expenses.reduce(
    (total, gasto) => total + Number(gasto.monto || 0),
    0
  )

  // Calculamos la cantidad de movimientos.
  const cantidadMovimientos = expenses.length

  // Formateamos el total en pesos argentinos.
  const totalFormateado = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(totalRegistrado)

  return (
    <main className="home-screen">
      <div className="home-container">
        <header className="home-header">
          <img
            src="/icons/expense-tracker-icon.png"
            className="home-icon"
            alt="Ícono de ExpenseTracker"
          />
          <h1 className="home-title">ExpenseTracker</h1>
        </header>

        <section className="home-card">
          <h2 className="home-welcome">¡Bienvenido/a!</h2>
          <p className="home-description">
            Una forma sencilla de registrar y organizar tus gastos diarios.
          </p>
        </section>

        <section className="home-card home-summary">
          <h2 className="home-section-title">Resumen de gastos</h2>

          {!isLoaded ? (
            <p className="home-description">
              Cargando gastos...
            </p>
          ) : (
            <>
              <div className="home-summary-row">
                <article className="home-stat">
                  <p className="home-stat-label">Total registrado</p>
                  <p className="home-stat-value">
                    {totalFormateado}
                  </p>
                </article>

                <article className="home-stat">
                  <p className="home-stat-label">Movimientos</p>
                  <p className="home-stat-value">
                    {cantidadMovimientos}
                  </p>
                </article>
              </div>

              {expenses.length === 0 && (
                <p
                  className="home-description"
                  style={{ marginTop: '16px' }}
                >
                  Todavía no registraste gastos.
                </p>
              )}
            </>
          )}
        </section>

        <section className="home-card home-shortcuts">
          <h2 className="home-section-title">Accesos rápidos</h2>

          <div className="home-actions">
            <Boton
              titulo="Registrar Nuevo Gasto"
              variante="primario"
              onPress={openNewExpenseModal}
            />

            <Boton
              titulo="Ver Listado Completo"
              variante="secundario"
              onPress={() => navigate('/expenses')}
            />
          </div>
        </section>
      </div>
    </main>
  )
}
