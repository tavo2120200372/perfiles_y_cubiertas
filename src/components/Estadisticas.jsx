import { useEffect, useRef, useState } from 'react'
import './Estadisticas.css'
import { prefiereMovimientoReducido } from '../utils/helpers'

const ESTADISTICAS = [
  {
    valor: 47,
    sufijo: 'años',
    descripcion: 'fabricando a medida',
  },
  {
    valor: 640,
    sufijo: '+',
    descripcion: 'proyectos entregados',
  },
  {
    valor: 24,
    sufijo: 'h',
    descripcion: 'respuesta a cotización',
  },
]

const DURACION_CONTADOR = 800

function suavizarSalidaExponencial(progreso) {
  if (progreso >= 1) return 1

  return 1 - 2 ** (-10 * progreso)
}

function Estadisticas() {
  const seccionRef = useRef(null)
  const numerosRef = useRef([])
  const animacionRef = useRef(null)
  const animandoRef = useRef(false)

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seccion = seccionRef.current

    if (!seccion) return

    const movimientoReducido = prefiereMovimientoReducido()

    // Escribe cada cifra según el progreso (0 = todas en 0, 1 = valores finales).
    const escribirNumeros = (progreso) => {
      const progresoSuavizado = suavizarSalidaExponencial(progreso)

      ESTADISTICAS.forEach(({ valor }, indice) => {
        const elemento = numerosRef.current[indice]

        if (elemento) {
          elemento.textContent = String(
            Math.round(valor * progresoSuavizado),
          )
        }
      })
    }

    const cancelarAnimacion = () => {
      if (animacionRef.current !== null) {
        cancelAnimationFrame(animacionRef.current)
        animacionRef.current = null
      }
    }

    const reiniciarContadores = () => {
      cancelarAnimacion()

      animandoRef.current = false
      setVisible(false)

      escribirNumeros(0)
    }

    const iniciarContadores = () => {
      if (animandoRef.current) return

      animandoRef.current = true
      setVisible(true)

      if (movimientoReducido) {
        escribirNumeros(1)
        animandoRef.current = false
        return
      }

      const inicio = performance.now()

      const actualizar = (ahora) => {
        const progreso = Math.min(
          (ahora - inicio) / DURACION_CONTADOR,
          1,
        )

        escribirNumeros(progreso)

        if (progreso < 1) {
          animacionRef.current = requestAnimationFrame(actualizar)
          return
        }

        animacionRef.current = null
        animandoRef.current = false
      }

      animacionRef.current = requestAnimationFrame(actualizar)
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          iniciarContadores()
          return
        }

        reiniciarContadores()
      },
      {
        threshold: 0.35,
      },
    )

    observador.observe(seccion)

    return () => {
      observador.disconnect()
      cancelarAnimacion()
    }
  }, [])

  return (
    <section
      ref={seccionRef}
      className={`estadisticas${visible ? ' estadisticas--visible' : ''}`}
      aria-label="Cifras de Perfiles y Cubiertas"
    >
      <div className="estadisticas-contenedor">
        <div
          className="estadisticas-linea"
          aria-hidden="true"
        />

        <div className="estadisticas-grid">
          {ESTADISTICAS.map(({ valor, sufijo, descripcion }, indice) => (
            <article
              key={descripcion}
              className="estadistica"
              aria-label={`${valor} ${sufijo}, ${descripcion}`}
            >
              <p
                className="estadistica-valor"
                aria-hidden="true"
              >
                <span
                  ref={(elemento) => {
                    numerosRef.current[indice] = elemento
                  }}
                  className="estadistica-numero"
                >
                  0
                </span>

                <span className="estadistica-sufijo">{sufijo}</span>
              </p>

              <p className="estadistica-descripcion">{descripcion}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Estadisticas
