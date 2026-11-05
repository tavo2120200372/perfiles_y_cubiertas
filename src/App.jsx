import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Estadisticas from './components/Estadisticas'
import Servicios from './components/Servicios'
import Trabajos from './components/Trabajos'
import Nosotros from './components/Nosotros'
import Contacto from './components/Contacto'
import Footer from './components/Footer'
import CursorPersonalizado from './components/CursorPersonalizado'
import './App.css'

function App() {
  return (
    <>
      <CursorPersonalizado />
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

      <Footer />
    </>
  )
}

export default App
