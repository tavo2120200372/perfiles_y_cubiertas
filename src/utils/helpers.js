export const MEDIA_MOVIMIENTO_REDUCIDO = '(prefers-reduced-motion: reduce)'

export function prefiereMovimientoReducido() {
  return window.matchMedia(MEDIA_MOVIMIENTO_REDUCIDO).matches
}

export function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo)
}

/*
 * Ejecuta `actualizar` una vez de inmediato y después en cada
 * scroll o resize, limitado a una vez por cuadro de animación.
 * Devuelve la función de limpieza.
 */
export function suscribirScrollYResize(actualizar) {
  let frame = null

  const solicitarActualizacion = () => {
    if (frame !== null) return

    frame = requestAnimationFrame(() => {
      frame = null
      actualizar()
    })
  }

  actualizar()

  window.addEventListener('scroll', solicitarActualizacion, {
    passive: true,
  })
  window.addEventListener('resize', solicitarActualizacion)

  return () => {
    window.removeEventListener('scroll', solicitarActualizacion)
    window.removeEventListener('resize', solicitarActualizacion)

    if (frame !== null) {
      cancelAnimationFrame(frame)
    }
  }
}
