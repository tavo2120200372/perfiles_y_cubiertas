import { useLayoutEffect, useRef } from 'react'
import { MEDIA_MOVIMIENTO_REDUCIDO } from '../utils/helpers'

function Revelar({ children, delay = 0 }) {
  const elementoRef = useRef(null)

  useLayoutEffect(() => {
    const elemento = elementoRef.current
    const movimientoReducido = window.matchMedia(
      MEDIA_MOVIMIENTO_REDUCIDO,
    )

    if (
      !elemento ||
      movimientoReducido.matches ||
      !('IntersectionObserver' in window) ||
      typeof elemento.animate !== 'function'
    ) {
      return
    }

    const duracion = 1100
    const posicion = elemento.getBoundingClientRect()
    const visibleAlCargar =
      posicion.top < window.innerHeight &&
      posicion.bottom > 0

    let puedeAnimarse = !visibleAlCargar

    const animacion = elemento.animate(
      [
        {
          opacity: 0,
          transform: 'translate3d(0, 14px, 0)',
        },
        {
          opacity: 1,
          transform: 'translate3d(0, 0, 0)',
        },
      ],
      {
        duration: duracion,
        delay,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      },
    )

    animacion.pause()

    if (visibleAlCargar) {
      animacion.currentTime = delay + duracion
    } else {
      animacion.currentTime = 0
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada) return

        if (entrada.isIntersecting) {
          if (!puedeAnimarse) return

          puedeAnimarse = false
          animacion.pause()
          animacion.currentTime = 0
          animacion.play()
          return
        }

        puedeAnimarse = true
        animacion.pause()
        animacion.currentTime = 0
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -80px 0px',
      },
    )

    observador.observe(elemento)

    function mostrarSinAnimacion() {
      puedeAnimarse = false
      animacion.pause()
      animacion.currentTime = delay + duracion
    }

    function cambiarPreferencia() {
      if (movimientoReducido.matches) {
        mostrarSinAnimacion()
      }
    }

    elemento.addEventListener(
      'focusin',
      mostrarSinAnimacion,
    )

    movimientoReducido.addEventListener(
      'change',
      cambiarPreferencia,
    )

    return () => {
      observador.disconnect()
      animacion.cancel()

      elemento.removeEventListener(
        'focusin',
        mostrarSinAnimacion,
      )

      movimientoReducido.removeEventListener(
        'change',
        cambiarPreferencia,
      )
    }
  }, [delay])

  return (
    <div ref={elementoRef} className="revelar">
      {children}
    </div>
  )
}

export default Revelar
