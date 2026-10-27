import { Fragment, useEffect, useRef } from 'react'
import './Hero.css'
import GlassPanel from './GlassPanel'
import SeparadorPulso from './SeparadorPulso'
import {
  limitar,
  prefiereMovimientoReducido,
  suscribirScrollYResize,
} from '../utils/helpers'

const ETIQUETAS = ['VIDRIO', 'ALUMINIO', 'CUBIERTAS']

const PROPIEDADES_DESVANECIMIENTO = ['opacity', 'transform', 'filter']

/*
 * Permite arrastrar un panel de vidrio dentro de los límites del Hero.
 * Devuelve la función que elimina los eventos.
 */
function activarArrastre(panel, hero) {
  let pointerId = null

  let inicioX = 0
  let inicioY = 0
  let ultimaX = 0

  // Posición actual del panel y la que tenía al empezar el arrastre.
  let posicionX = 0
  let posicionY = 0
  let posicionInicialX = 0
  let posicionInicialY = 0

  // Distancias máximas que puede recorrer sin salir del Hero.
  let limites = null

  const esArrastreActivo = (evento) =>
    pointerId !== null && evento.pointerId === pointerId

  const iniciar = (evento) => {
    if (evento.pointerType === 'mouse' && evento.button !== 0) return

    evento.preventDefault()

    pointerId = evento.pointerId

    panel.setPointerCapture(pointerId)

    panel.classList.add(
      'panel-vidrio--interactivo',
      'panel-vidrio--arrastrando',
    )

    inicioX = evento.clientX
    inicioY = evento.clientY
    ultimaX = evento.clientX

    posicionInicialX = posicionX
    posicionInicialY = posicionY

    const limitesHero = hero.getBoundingClientRect()
    const limitesPanel = panel.getBoundingClientRect()

    limites = {
      minimoX: limitesHero.left - limitesPanel.left,
      maximoX: limitesHero.right - limitesPanel.right,
      minimoY: limitesHero.top - limitesPanel.top,
      maximoY: limitesHero.bottom - limitesPanel.bottom,
    }
  }

  const mover = (evento) => {
    if (!esArrastreActivo(evento)) return

    posicionX =
      posicionInicialX +
      limitar(evento.clientX - inicioX, limites.minimoX, limites.maximoX)

    posicionY =
      posicionInicialY +
      limitar(evento.clientY - inicioY, limites.minimoY, limites.maximoY)

    const inclinacion = limitar((evento.clientX - ultimaX) * 0.35, -5, 5)

    panel.style.setProperty('--arrastre-x', `${posicionX}px`)
    panel.style.setProperty('--arrastre-y', `${posicionY}px`)
    panel.style.setProperty('--arrastre-inclinacion', `${inclinacion}deg`)

    ultimaX = evento.clientX
  }

  const terminar = (evento) => {
    if (!esArrastreActivo(evento)) return

    panel.classList.remove('panel-vidrio--arrastrando')

    if (panel.hasPointerCapture(pointerId)) {
      panel.releasePointerCapture(pointerId)
    }

    pointerId = null

    requestAnimationFrame(() => {
      panel.style.setProperty('--arrastre-inclinacion', '0deg')
    })
  }

  const eventos = {
    pointerdown: iniciar,
    pointermove: mover,
    pointerup: terminar,
    pointercancel: terminar,
  }

  Object.entries(eventos).forEach(([nombre, manejador]) => {
    panel.addEventListener(nombre, manejador)
  })

  return () => {
    Object.entries(eventos).forEach(([nombre, manejador]) => {
      panel.removeEventListener(nombre, manejador)
    })
  }
}

function Hero() {
  const heroRef = useRef(null)
  const contenidoDesvanecerRef = useRef(null)

  // Desvanece el contenido principal de la portada conforme avanza el scroll.
  useEffect(() => {
    const hero = heroRef.current
    const contenido = contenidoDesvanecerRef.current

    if (!hero || !contenido) return

    return suscribirScrollYResize(() => {
      if (prefiereMovimientoReducido()) {
        PROPIEDADES_DESVANECIMIENTO.forEach((propiedad) => {
          contenido.style.removeProperty(propiedad)
        })
        return
      }

      const distanciaDesvanecimiento = hero.offsetHeight * 0.42
      const progreso = limitar(
        window.scrollY / distanciaDesvanecimiento,
        0,
        1,
      )

      contenido.style.opacity = 1 - progreso
      contenido.style.transform = `translate3d(0, ${progreso * -45}px, 0)`
      contenido.style.filter = `blur(${progreso * 9}px)`
    })
  }, [])

  // Permite arrastrar los paneles de vidrio dentro de los límites del Hero.
  useEffect(() => {
    const hero = heroRef.current

    if (!hero) return

    const limpiezas = Array.from(
      hero.querySelectorAll('.panel-vidrio'),
      (panel) => activarArrastre(panel, hero),
    )

    return () => {
      limpiezas.forEach((limpiar) => limpiar())
    }
  }, [])

  return (
    <section ref={heroRef} id="inicio" className="hero">
      <GlassPanel
        className="panel-vidrio-izquierdo"
        fuerza={28}
      />

      <GlassPanel
        className="panel-vidrio-derecho"
        fuerza={22}
      />

      <div className="hero-contenido">
        <div
          ref={contenidoDesvanecerRef}
          className="hero-contenido-desvanecer"
        >
          <p className="hero-etiqueta">
            {ETIQUETAS.map((etiqueta, indice) => (
              <Fragment key={etiqueta}>
                {indice > 0 && <SeparadorPulso />}
                <span>{etiqueta}</span>
              </Fragment>
            ))}
          </p>

          <h1 className="hero-titulo">
            <span>Especialistas en</span>
            <strong>Perfiles y Cubiertas.</strong>
          </h1>

          <p className="hero-descripcion">
            Ventanales, puertas de cristal templado,
            canceles y cubiertas traslúcidas.
            Soluciones a medida para tu proyecto.
          </p>

          <div className="hero-acciones">
            <a
              href="#trabajos"
              className="hero-boton hero-boton-principal"
            >
              Ver nuestros trabajos
            </a>

            <a
              href="#contacto"
              className="hero-boton hero-boton-cristal"
            >
              Cotizar mi proyecto
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
