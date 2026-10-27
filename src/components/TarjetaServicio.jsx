import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import IconoServicio from './IconoServicio'
import { prefiereMovimientoReducido } from '../utils/helpers'

// Distancia (px) a partir de la cual un toque cuenta como deslizamiento.
const UMBRAL_DESLIZAMIENTO = 8

function textoAlternativo(servicio, posicion) {
  return (
    servicio.piesDeFoto?.[posicion] ??
    `${servicio.titulo}, fotografía ${posicion + 1}`
  )
}

function Flecha({ izquierda = false }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d={izquierda ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
    </svg>
  )
}

function Caracteristicas({ servicio }) {
  if (!servicio.caracteristicas?.length) return null

  return (
    <ul className="servicio-caracteristicas">
      {servicio.caracteristicas.map((texto) => (
        <li key={texto}>{texto}</li>
      ))}
    </ul>
  )
}

function Indicadores({ servicio, fotos, actual, onIr }) {
  return (
    <div
      className="galeria-indicadores"
      role="group"
      aria-label={`Fotografías de ${servicio.titulo}`}
    >
      {fotos.map((foto, posicion) => (
        <button
          type="button"
          key={`${foto}-${posicion}`}
          className="galeria-indicador"
          aria-label={`Ver fotografía ${posicion + 1}`}
          aria-pressed={posicion === actual}
          onClick={() => onIr(posicion)}
        >
          <span />
        </button>
      ))}
    </div>
  )
}

function ControlesLightbox({ total, actual, onCerrar, onIr }) {
  return (
    <>
      <button
        type="button"
        className="lightbox-cerrar"
        onClick={onCerrar}
        aria-label="Cerrar galería"
        autoFocus
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            className="lightbox-flecha lightbox-anterior"
            onClick={() => onIr(actual - 1)}
            aria-label="Fotografía anterior"
          >
            <Flecha izquierda />
          </button>

          <button
            type="button"
            className="lightbox-flecha lightbox-siguiente"
            onClick={() => onIr(actual + 1)}
            aria-label="Fotografía siguiente"
          >
            <Flecha />
          </button>
        </>
      )}
    </>
  )
}

// El desplazamiento nativo permite deslizar con el dedo sin bloquear el scroll vertical.
function Galeria({
  servicio,
  ampliada = false,
  leyenda = false,
  inicial = 0,
  onAbrir,
  onCerrar,
}) {
  const fotos = [servicio.imagen, ...(servicio.galeria ?? [])].filter(Boolean)
  const total = fotos.length

  const pistaRef = useRef(null)
  const gestoRef = useRef(null)

  const [actual, setActual] = useState(inicial)

  const pie =
    servicio.piesDeFoto?.[actual] ??
    `${servicio.titulo} · Fotografía ${actual + 1}`

  // Las fotos de la miniatura se cargan de forma diferida; en el visor no.
  const propiedadesImagen = ampliada
    ? {}
    : { loading: 'lazy', decoding: 'async' }

  // Coloca la pista en la fotografía inicial y la mantiene alineada al redimensionar.
  useEffect(() => {
    const pista = pistaRef.current

    if (!pista) return

    const ajustar = () => {
      const posicion = Number(pista.dataset.actual || 0)

      pista.scrollTo({
        left: posicion * pista.clientWidth,
        behavior: 'instant',
      })
    }

    pista.dataset.actual = String(inicial)
    ajustar()

    const observador =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(ajustar)
        : null

    observador?.observe(pista)

    return () => observador?.disconnect()
  }, [inicial])

  function ir(posicion) {
    const pista = pistaRef.current

    if (!pista || !total) return

    const destino = (posicion + total) % total

    pista.scrollTo({
      left: destino * pista.clientWidth,
      behavior: prefiereMovimientoReducido() ? 'instant' : 'smooth',
    })
  }

  function manejarTeclado(evento) {
    if (evento.key !== 'ArrowLeft' && evento.key !== 'ArrowRight') return

    evento.preventDefault()
    ir(actual + (evento.key === 'ArrowRight' ? 1 : -1))
  }

  function manejarScroll(evento) {
    const pista = evento.currentTarget

    if (!pista.clientWidth) return

    const posicion = Math.max(
      0,
      Math.min(
        total - 1,
        Math.round(pista.scrollLeft / pista.clientWidth),
      ),
    )

    pista.dataset.actual = String(posicion)
    setActual(posicion)
  }

  // Distingue un toque de un deslizamiento para no abrir el visor al arrastrar.
  function iniciarGesto(evento) {
    gestoRef.current = {
      x: evento.clientX,
      y: evento.clientY,
      movido: false,
    }
  }

  function detectarDeslizamiento(evento) {
    const gesto = gestoRef.current

    if (!gesto) return

    const distancia = Math.hypot(
      evento.clientX - gesto.x,
      evento.clientY - gesto.y,
    )

    if (distancia > UMBRAL_DESLIZAMIENTO) {
      gesto.movido = true
    }
  }

  function abrirDesdeMiniatura(evento, posicion) {
    if (evento.detail === 0 || !gestoRef.current?.movido) {
      onAbrir(posicion)
    }
  }

  return (
    <div
      className={`servicio-fotografia${ampliada ? ' servicio-fotografia--modal' : ''}`}
      onKeyDown={manejarTeclado}
    >
      <div
        className="galeria-pista"
        ref={pistaRef}
        onScroll={manejarScroll}
      >
        {fotos.map((foto, posicion) => {
          const imagen = (
            <img
              src={foto}
              alt={textoAlternativo(servicio, posicion)}
              draggable="false"
              {...propiedadesImagen}
            />
          )

          return (
            <div
              className="galeria-diapositiva"
              key={`${foto}-${posicion}`}
              aria-hidden={posicion !== actual}
            >
              {ampliada ? (
                imagen
              ) : (
                <button
                  type="button"
                  className="servicio-area-imagen"
                  tabIndex={posicion === actual ? 0 : -1}
                  onPointerDown={iniciarGesto}
                  onPointerMove={detectarDeslizamiento}
                  onClick={(evento) => abrirDesdeMiniatura(evento, posicion)}
                  aria-label={`Abrir galería de ${servicio.titulo}`}
                >
                  {imagen}
                </button>
              )}
            </div>
          )
        })}
      </div>

      {leyenda && <p className="galeria-leyenda">{pie}</p>}

      {total > 1 && (
        <Indicadores
          servicio={servicio}
          fotos={fotos}
          actual={actual}
          onIr={ir}
        />
      )}

      {ampliada ? (
        <ControlesLightbox
          total={total}
          actual={actual}
          onCerrar={onCerrar}
          onIr={ir}
        />
      ) : (
        <button
          type="button"
          className="servicio-expandir"
          onClick={() => onAbrir(actual)}
          aria-label={`Ampliar ${servicio.titulo}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" />
          </svg>
        </button>
      )}
    </div>
  )
}

function TarjetaServicio({ servicio, vista = 'inicio' }) {
  const catalogo = vista === 'catalogo'

  const modalRef = useRef(null)
  const disparadorRef = useRef(null)
  const tituloId = useId()

  const [fotoInicial, setFotoInicial] = useState(0)
  const [abierto, setAbierto] = useState(false)

  function abrirModal(posicion = 0) {
    disparadorRef.current = document.activeElement
    setFotoInicial(posicion)
    setAbierto(true)
  }

  function cerrarModal() {
    modalRef.current?.close()
  }

  // Abre el diálogo nativo cuando cambia el estado y lo cierra al desmontar.
  useEffect(() => {
    if (!abierto) return

    const modal = modalRef.current

    if (!modal.open) modal.showModal()

    return () => {
      if (modal.open) modal.close()
    }
  }, [abierto])

  return (
    <>
      <article className="servicio-tarjeta" id={servicio.id}>
        <Galeria
          servicio={servicio}
          leyenda={catalogo}
          onAbrir={abrirModal}
        />

        <div className="servicio-contenido">
          <div className="servicio-contenido-superior">
            <div className="servicio-icono">
              <IconoServicio tipo={servicio.id} />
            </div>

            {!catalogo && (
              <button
                type="button"
                className="servicio-ver-mas"
                onClick={() => abrirModal()}
                aria-haspopup="dialog"
              >
                Ver más
              </button>
            )}
          </div>

          <h3>{servicio.titulo}</h3>

          <p>
            {catalogo
              ? (servicio.descripcionLarga ?? servicio.descripcion)
              : servicio.descripcion}
          </p>

          {catalogo && (
            <>
              <Caracteristicas servicio={servicio} />

              <button
                type="button"
                className="servicio-ver-galeria"
                onClick={() => abrirModal()}
                aria-haspopup="dialog"
              >
                Ver galería completa <span aria-hidden="true">→</span>
              </button>
            </>
          )}
        </div>
      </article>

      {typeof document !== 'undefined' &&
        createPortal(
          <dialog
            ref={modalRef}
            className="servicio-lightbox"
            aria-labelledby={tituloId}
            onClick={(evento) => {
              if (evento.target === evento.currentTarget) cerrarModal()
            }}
            onClose={() => {
              setAbierto(false)
              disparadorRef.current?.focus()
            }}
          >
            {abierto && (
              <div className="lightbox-contenido">
                <Galeria
                  servicio={servicio}
                  ampliada
                  leyenda
                  inicial={fotoInicial}
                  onCerrar={cerrarModal}
                />

                <h2 id={tituloId} className="lightbox-titulo-accesible">
                  {servicio.titulo}
                </h2>
              </div>
            )}
          </dialog>,
          document.body,
        )}
    </>
  )
}

export default TarjetaServicio
