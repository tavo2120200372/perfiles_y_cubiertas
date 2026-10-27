import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Estadisticas from './components/Estadisticas'
import Servicios from './components/Servicios'
import Trabajos from './components/Trabajos'
import Nosotros from './components/Nosotros'
import Contacto from './components/Contacto'
import './App.css'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <div className="portada-inicio">
          <Hero />
          <Estadisticas />
        </div>

        <Servicios />
        <Trabajos />
        <Nosotros />
        <Contacto />
      </main>
    </>
  )
}

export default App
