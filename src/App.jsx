//queremos que la aplicación muestre el contador y la pantalla de bienvenida de Vite. 
//Queremos que muestre las páginas de ExpenseTracker mediante React Router.

import AppRouter from './router/AppRouter' //importa el componente encargado de gestionar las rutas.
import InstallBanner from './components/InstallBanner'
import './styles/Bonus2Touch.css'

function App() {//En AppRouter: indica que App debe mostrar el sistema de navegación.
  return (
    <>
      <AppRouter />
      <InstallBanner />
    </>
  )
}
export default App //permite que main.jsx importe este componente.