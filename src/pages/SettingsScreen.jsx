import { useExpenses } from '../context/ExpensesContext'
import '../styles/SettingsScreen.css'

// Pantalla de configuración de ExpenseTracker.
export default function SettingsScreen() {

  // Obtenemos los ajustes y la función para modificarlos.
  const { settings, updateSettings } = useExpenses()

  return (
    <main className="settings-screen">

      <header className="settings-screen__header">
        <h1>Configuración</h1>

        <p>
          Personalizá tus preferencias de ExpenseTracker.
        </p>
      </header>

      <section
        className="settings-screen__content"
        aria-label="Preferencias de la aplicación"
      >

        {/* NOTIFICACIONES */}
        <label className="settings-screen__option">

          <span className="settings-screen__info">
            <strong>Notificaciones</strong>

            <span>
              Activar o desactivar las notificaciones.
            </span>
          </span>

          <input
            type="checkbox"
            role="switch"
            className="settings-screen__switch"
            checked={settings.notificaciones}
            aria-checked={settings.notificaciones}
            onChange={(event) =>
              updateSettings({
                notificaciones: event.target.checked,
              })
            }
          />
        </label>

        {/* MODO OSCURO */}
        <label className="settings-screen__option">

          <span className="settings-screen__info">
            <strong>Modo oscuro</strong>

            <span>
              Guardar la preferencia de modo oscuro.
            </span>
          </span>

          <input
            type="checkbox"
            role="switch"
            className="settings-screen__switch"
            checked={settings.modoOscuro}
            aria-checked={settings.modoOscuro}
            onChange={(event) =>
              updateSettings({
                modoOscuro: event.target.checked,
              })
            }
          />
        </label>

      </section>
    </main>
  )
}
