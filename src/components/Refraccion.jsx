import { useEffect, useId, useRef, useState } from 'react'
import { limitar } from '../utils/helpers'

const BORDE_REFRACCION = 18
const REFRACCION_HORIZONTAL = 0.12
const REFRACCION_VERTICAL = 0

const ESTILO_SVG_OCULTO = {
  position: 'absolute',
  pointerEvents: 'none',
}

/*
 * Genera un mapa de desplazamiento (canal R = eje X, canal G = eje Y)
 * con la forma de un rectángulo redondeado. Devuelve una URL de imagen.
 */
function crearMapa(ancho, alto, radio, fuerza, aumento) {
  const canvas = document.createElement('canvas')

  canvas.width = ancho
  canvas.height = alto

  const contexto = canvas.getContext('2d')

  if (!contexto) return null

  const imagen = contexto.createImageData(ancho, alto)
  const escalaFiltro = Math.max(Math.abs(fuerza), 1)
  const factorLupa = 1 - 1 / Math.max(aumento, 1)

  for (let y = 0; y < alto; y += 1) {
    for (let x = 0; x < ancho; x += 1) {
      const centroX = x + 0.5 - ancho / 2
      const centroY = y + 0.5 - alto / 2

      const qx = Math.abs(centroX) - (ancho / 2 - radio)
      const qy = Math.abs(centroY) - (alto / 2 - radio)

      const exteriorX = Math.max(qx, 0)
      const exteriorY = Math.max(qy, 0)

      const distanciaExterior = Math.hypot(exteriorX, exteriorY)

      const distanciaBorde =
        distanciaExterior + Math.min(Math.max(qx, qy), 0) - radio

      let direccionX = 0
      let direccionY = 0

      if (distanciaExterior > 0) {
        direccionX = (exteriorX / distanciaExterior) * Math.sign(centroX)
        direccionY = (exteriorY / distanciaExterior) * Math.sign(centroY)
      } else if (qx > qy) {
        direccionX = Math.sign(centroX)
      } else {
        direccionY = Math.sign(centroY)
      }

      const profundidad = -distanciaBorde

      const intensidadBorde =
        profundidad >= 0 && profundidad <= BORDE_REFRACCION
          ? Math.sin((profundidad / BORDE_REFRACCION) * Math.PI)
          : 0

      const desplazamientoX =
        -centroX * factorLupa -
        direccionX *
          intensidadBorde *
          escalaFiltro *
          REFRACCION_HORIZONTAL

      const desplazamientoY =
        -centroY * factorLupa -
        direccionY *
          intensidadBorde *
          escalaFiltro *
          REFRACCION_VERTICAL

      const rojo = limitar(0.5 + desplazamientoX / escalaFiltro, 0, 1)
      const verde = limitar(0.5 + desplazamientoY / escalaFiltro, 0, 1)

      const indice = (y * ancho + x) * 4

      imagen.data[indice] = Math.round(rojo * 255)
      imagen.data[indice + 1] = Math.round(verde * 255)
      imagen.data[indice + 2] = 128
      imagen.data[indice + 3] = 255
    }
  }

  contexto.putImageData(imagen, 0, 0)

  return canvas.toDataURL()
}

/*
 * Mantiene actualizado el mapa de refracción de un elemento según su
 * tamaño. Devuelve la ref que debe asignarse al elemento, el mapa
 * generado y el id del filtro SVG.
 */
export function useRefraccion({
  activo = true,
  fuerza,
  aumento,
  radioPorDefecto,
  prefijo,
}) {
  const elementoRef = useRef(null)
  const idReact = useId()
  const [mapa, setMapa] = useState(null)

  const filtroId = `${prefijo}-${idReact.replace(/[^a-zA-Z0-9_-]/g, '')}`

  useEffect(() => {
    const elemento = elementoRef.current

    if (!elemento || !activo) return

    let medidaAnterior = ''

    const actualizarMapa = () => {
      const ancho = elemento.offsetWidth
      const alto = elemento.offsetHeight

      if (!ancho || !alto) return

      const radioCSS = Number.parseFloat(
        getComputedStyle(elemento).borderTopLeftRadius,
      )

      const radio = Math.min(
        radioCSS || radioPorDefecto || alto / 2,
        ancho / 2,
        alto / 2,
      )

      const medida = `${ancho}-${alto}-${radio}-${fuerza}-${aumento}`

      if (medida === medidaAnterior) return

      medidaAnterior = medida

      const url = crearMapa(ancho, alto, radio, fuerza, aumento)

      if (url) {
        setMapa({
          ancho,
          alto,
          url,
        })
      }
    }

    const observador = new ResizeObserver(actualizarMapa)

    observador.observe(elemento)
    actualizarMapa()

    return () => {
      observador.disconnect()
    }
  }, [activo, fuerza, aumento, radioPorDefecto])

  return { elementoRef, mapa, filtroId }
}

// Define en el DOM el filtro SVG que usa `backdrop-filter: url(#id)`.
export function FiltroRefraccion({ id, mapa, fuerza }) {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={ESTILO_SVG_OCULTO}
    >
      <defs>
        {mapa && (
          <filter
            id={id}
            filterUnits="userSpaceOnUse"
            primitiveUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={mapa.ancho}
            height={mapa.alto}
            colorInterpolationFilters="sRGB"
          >
            <feImage
              href={mapa.url}
              x="0"
              y="0"
              width={mapa.ancho}
              height={mapa.alto}
              preserveAspectRatio="none"
              result="mapa"
            />

            <feDisplacementMap
              in="SourceGraphic"
              in2="mapa"
              scale={fuerza}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        )}
      </defs>
    </svg>
  )
}
