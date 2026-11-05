import { useEffect, useRef } from 'react'
import './CursorPersonalizado.css'

const SUAVIDAD_CIRCULO = 0.06
const FUERZA_PUNTO = 0.9
const SUAVIDAD_PUNTO = 0.75

function CursorPersonalizado() {
    const cursorRef = useRef(null)
    const puntoRef = useRef(null)
    const frameRef = useRef(null)

    const mouseRef = useRef({
        x: 0,
        y: 0,
    })

    const circuloRef = useRef({
        x: 0,
        y: 0,
    })

    const puntoRefPosicion = useRef({
        x: 0,
        y: 0,
    })

    const iniciadoRef = useRef(false)

    useEffect(() => {
        const cursor = cursorRef.current
        const punto = puntoRef.current

        if (!cursor || !punto) return

        const dispositivoCompatible = window.matchMedia(
            '(hover: hover) and (pointer: fine)',
        )

        if (!dispositivoCompatible.matches) return

        const moverCursor = (evento) => {
            mouseRef.current.x = evento.clientX
            mouseRef.current.y = evento.clientY

            if (!iniciadoRef.current) {
                circuloRef.current.x = evento.clientX
                circuloRef.current.y = evento.clientY
                iniciadoRef.current = true
            }

            cursor.classList.add(
                'cursor-personalizado--visible',
            )
        }

        const ocultarCursor = () => {
            cursor.classList.remove(
                'cursor-personalizado--visible',
            )
        }

        const animar = () => {
            if (!iniciadoRef.current) {
                frameRef.current =
                    requestAnimationFrame(animar)

                return
            }

            const mouse = mouseRef.current
            const circulo = circuloRef.current
            const posicionPunto =
                puntoRefPosicion.current

            circulo.x +=
                (mouse.x - circulo.x) *
                SUAVIDAD_CIRCULO

            circulo.y +=
                (mouse.y - circulo.y) *
                SUAVIDAD_CIRCULO

            const diferenciaX =
                mouse.x - circulo.x

            const diferenciaY =
                mouse.y - circulo.y

            const objetivoPuntoX =
                diferenciaX * FUERZA_PUNTO

            const objetivoPuntoY =
                diferenciaY * FUERZA_PUNTO

            posicionPunto.x +=
                (objetivoPuntoX - posicionPunto.x) *
                SUAVIDAD_PUNTO

            posicionPunto.y +=
                (objetivoPuntoY - posicionPunto.y) *
                SUAVIDAD_PUNTO

            cursor.style.transform =
                `translate3d(${circulo.x}px, ${circulo.y}px, 0)
               translate(-50%, -50%)`

            punto.style.transform =
                `translate3d(
                ${posicionPunto.x}px,
                ${posicionPunto.y}px,
                0
              )`

            frameRef.current =
                requestAnimationFrame(animar)
        }

        window.addEventListener(
            'pointermove',
            moverCursor,
            {
                passive: true,
            },
        )

        document.documentElement.addEventListener(
            'mouseleave',
            ocultarCursor,
        )

        frameRef.current =
            requestAnimationFrame(animar)

        return () => {
            window.removeEventListener(
                'pointermove',
                moverCursor,
            )

            document.documentElement.removeEventListener(
                'mouseleave',
                ocultarCursor,
            )

            if (frameRef.current !== null) {
                cancelAnimationFrame(
                    frameRef.current,
                )
            }
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className="cursor-personalizado"
            aria-hidden="true"
        >
            <span
                ref={puntoRef}
                className="cursor-personalizado-punto"
            />
        </div>
    )
}

export default CursorPersonalizado