import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/NewExpenseModal.css'

const CATEGORIAS = ['Comida', 'Transporte', 'Servicios', 'Otros']

// Migrado de FormularioNuevoGasto.js (Proyecto1): en web usamos
// <dialog> + showModal(), inputs HTML y botones accesibles.
export default function NewExpenseModal({ onClose }) {
  const dialogRef = useRef(null)
  const [nombre, setNombre] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('Comida')
  const [mensaje, setMensaje] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()

    // Cuando aparece el teclado virtual (especialmente en Safari/iOS),
    // mantenemos la hoja visible y desplazable sobre el teclado.
    const viewport = window.visualViewport
    const ajustarAlTeclado = () => {
      if (!dialog || !viewport) return
      const espacioInferior = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      )
      dialog.style.setProperty('--keyboard-bottom', `${espacioInferior}px`)
      dialog.style.setProperty('--visible-viewport-height', `${viewport.height}px`)
    }

    ajustarAlTeclado()
    viewport?.addEventListener('resize', ajustarAlTeclado)
    viewport?.addEventListener('scroll', ajustarAlTeclado)

    // También funciona correctamente con StrictMode en React.
    return () => {
      viewport?.removeEventListener('resize', ajustarAlTeclado)
      viewport?.removeEventListener('scroll', ajustarAlTeclado)
      if (dialog?.open) dialog.close()
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()

    // Conservamos la validación de nombre y monto de Proyecto1.
    if (!nombre.trim() || !monto.trim()) {
      setMensaje({ tipo: 'error', texto: 'Ingresá el nombre y el monto del gasto.' })
      return
    }

    const montoNumero = Number(monto.trim().replace(',', '.'))
    if (!Number.isFinite(montoNumero) || montoNumero <= 0) {
      setMensaje({ tipo: 'error', texto: 'Ingresá un monto válido mayor a cero.' })
      return
    }

    const datos = {
      descripcion: nombre.trim(),
      monto: montoNumero,
      categoria,
    }

    // Esta US no guarda gastos ni modifica el resumen/listado.
    console.info('[ExpenseTracker] Formulario de prueba:', datos)
    setMensaje({
      tipo: 'exito',
      texto: 'Formulario completado. Esto es una demostración: todavía no se guardan gastos.',
    })
  }

  const onClickDialog = (event) => {
    // Clic en el fondo fuera de la hoja.
    if (event.target === event.currentTarget) onClose()
  }

  const onCancelDialog = (event) => {
    // Esc en escritorio / gesto de cierre compatible.
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
          <div className="new-expense-modal__handle" aria-hidden="true" />
          <div className="new-expense-modal__heading">
            <h2 id="new-expense-title">Nuevo gasto</h2>
            <button
              type="button"
              className="new-expense-modal__close"
              aria-label="Cerrar formulario"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <p>Completá los datos para registrar un gasto.</p>
        </header>

        <form className="new-expense-modal__form" onSubmit={handleSubmit} noValidate>
          <div className="new-expense-modal__field">
            <label htmlFor="new-expense-name">Nombre del gasto</label>
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

          <div className="new-expense-modal__field">
            <label htmlFor="new-expense-amount">Monto</label>
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

          <fieldset className="new-expense-modal__categories">
            <legend>Categoría</legend>
            <div className="new-expense-modal__chips">
              {CATEGORIAS.map((opcion) => (
                <button
                  type="button"
                  key={opcion}
                  className={`new-expense-modal__chip ${categoria === opcion ? 'new-expense-modal__chip--selected' : ''}`}
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

          {mensaje && (
            <p
              className={`new-expense-modal__message new-expense-modal__message--${mensaje.tipo}`}
              role={mensaje.tipo === 'error' ? 'alert' : 'status'}
            >
              {mensaje.texto}
            </p>
          )}

          <div className="new-expense-modal__actions">
            <button type="submit" className="new-expense-modal__save">
              Guardar
            </button>
            <button type="button" className="new-expense-modal__cancel" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </dialog>,
    document.body
  )
}
