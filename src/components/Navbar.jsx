import { useEffect, useRef, useState } from 'react'
import './Navbar.css'
import SeparadorPulso from './SeparadorPulso'
import {
  limitar,
  prefiereMovimientoReducido,
  suscribirScrollYResize,
} from '../utils/helpers'

const enlaces = [
  { href: '#inicio', texto: 'Inicio' },
  { href: '#servicios', texto: 'Servicios' },
  { href: '#trabajos', texto: 'Trabajos' },
  { href: '#nosotros', texto: 'Nosotros' },
  { href: '#contacto', texto: 'Contáctanos' },
]

// Coloca el indicador en su posición final y guarda ese estado.
function fijarIndicador(indicador, x, ancho) {
  indicador.style.transform = `translate3d(${x}px, 0, 0)`
  indicador.style.width = `${ancho}px`

  indicador.dataset.x = String(x)
  indicador.dataset.width = String(ancho)
}

function Navbar() {
  const encabezadoRef = useRef(null)
  const navegacionRef = useRef(null)
  const indicadorRef = useRef(null)

  const [seccionActiva, setSeccionActiva] = useState('inicio')

  const [tema, setTema] = useState(
    () => document.documentElement.dataset.theme || 'light',
  )

  const esOscuro = tema === 'dark'

  const cambiarTema = () => {
    setTema((temaActual) =>
      temaActual === 'light' ? 'dark' : 'light',
    )
  }

  // Mantiene sincronizado el tema global y conserva la preferencia.
  useEffect(() => {
    document.documentElement.dataset.theme = tema
    localStorage.setItem('tema', tema)
  }, [tema])

  // Mueve y deforma suavemente el indicador de la sección activa.
  useEffect(() => {
    const navegacion = navegacionRef.current
    const indicador = indicadorRef.current

    if (!navegacion || !indicador) return

    const destino = navegacion.querySelector(
      `[data-seccion="${seccionActiva}"]`,
    )

    if (!destino) return

    const navegacionRect = navegacion.getBoundingClientRect()
    const destinoRect = destino.getBoundingClientRect()

    const xDestino = destinoRect.left - navegacionRect.left
    const anchoDestino = destinoRect.width

    const xAnterior = Number(indicador.dataset.x ?? xDestino)
    const anchoAnterior = Number(
      indicador.dataset.width ?? anchoDestino,
    )

    // Primera posición o movimiento reducido: sin animación.
    if (
      indicador.dataset.inicializado !== 'true' ||
      prefiereMovimientoReducido()
    ) {
      fijarIndicador(indicador, xDestino, anchoDestino)
      indicador.dataset.inicializado = 'true'
      return
    }

    const distancia = Math.abs(xDestino - xAnterior)
    const estiramiento = Math.min(1.45, 1 + distancia / 350)

    indicador.style.transformOrigin =
      xDestino > xAnterior ? 'left center' : 'right center'

    const animacion = indicador.animate(
      [
        {
          transform: `translate3d(${xAnterior}px, 0, 0) scaleX(1)`,
          width: `${anchoAnterior}px`,
        },
        {
          transform: `translate3d(${
            (xAnterior + xDestino) / 2
          }px, 0, 0) scaleX(${estiramiento})`,
          width: `${(anchoAnterior + anchoDestino) / 2}px`,
          offset: 0.45,
        },
        {
          transform: `translate3d(${xDestino}px, 0, 0) scaleX(1)`,
          width: `${anchoDestino}px`,
        },
      ],
      {
        duration: 520,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    )

    animacion.onfinish = () => {
      fijarIndicador(indicador, xDestino, anchoDestino)
    }

    return () => {
      animacion.cancel()
    }
  }, [seccionActiva])

  // Detecta la sección visible y actualiza el indicador al hacer scroll.
  useEffect(() => {
    const secciones = enlaces
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean)

    if (!secciones.length) return

    return suscribirScrollYResize(() => {
      const puntoReferencia =
        window.scrollY + window.innerHeight * 0.35

      let activa = secciones[0].id

      secciones.forEach((seccion) => {
        if (seccion.offsetTop <= puntoReferencia) {
          activa = seccion.id
        }
      })

      setSeccionActiva(activa)
    })
  }, [])

  // Contrae progresivamente el encabezado hacia el centro al hacer scroll.
  useEffect(() => {
    const encabezado = encabezadoRef.current

    if (!encabezado) return

    return suscribirScrollYResize(() => {
      const anchoVentana = window.innerWidth

      if (anchoVentana <= 800 || prefiereMovimientoReducido()) {
        encabezado.style.removeProperty('width')
        return
      }

      const anchoInicial = anchoVentana - 48
      const anchoFinal = Math.min(
        anchoInicial,
        Math.max(820, anchoVentana * 0.56),
      )

      const progresoBase = limitar(window.scrollY / 520, 0, 1)

      // Interpolación suavizada (smoothstep).
      const progreso =
        progresoBase * progresoBase * (3 - 2 * progresoBase)

      const anchoActual =
        anchoInicial + (anchoFinal - anchoInicial) * progreso

      encabezado.style.width = `${anchoActual}px`
    })
  }, [])

  return (
    <header ref={encabezadoRef} className="encabezado">
      <a
        href="#inicio"
        className="marca"
        aria-label="Perfiles y Cubiertas, inicio"
      >
        <span className="marca-siglas">PyC</span>

        <span className="marca-nombre">
          PERFILES
          <span>Y CUBIERTAS</span>
        </span>
      </a>

      <nav
        ref={navegacionRef}
        className="navegacion"
        aria-label="Navegación principal"
      >
        <span
          ref={indicadorRef}
          className="nav-indicador-activo"
          aria-hidden="true"
        />

        {enlaces.map(({ href, texto }) => {
          const seccion = href.slice(1)

          return (
            <a
              key={href}
              href={href}
              data-seccion={seccion}
              aria-current={
                seccionActiva === seccion ? 'page' : undefined
              }
              onClick={() => setSeccionActiva(seccion)}
            >
              {texto}
            </a>
          )
        })}

        <button
          type="button"
          className="boton-tema"
          onClick={cambiarTema}
          aria-label={
            esOscuro ? 'Activar modo claro' : 'Activar modo oscuro'
          }
          title={esOscuro ? 'Modo claro' : 'Modo oscuro'}
        >
          {esOscuro ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
            </svg>
          )}
        </button>

        <a href="#contacto" className="boton-cotizar">
          <SeparadorPulso />
          Cotizar
        </a>
      </nav>
    </header>
  )
}

export default Navbar
