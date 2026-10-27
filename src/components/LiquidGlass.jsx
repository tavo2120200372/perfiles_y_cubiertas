import { forwardRef, useImperativeHandle } from 'react'
import { FiltroRefraccion, useRefraccion } from './Refraccion'

const LiquidGlass = forwardRef(function LiquidGlass(
  {
    as: Elemento = 'div',
    className = '',
    fuerza = 10,
    aumento = 1.02,
    refraccion = true,
    style,
    children,
    ...props
  },
  refExterna,
) {
  const { elementoRef, mapa, filtroId } = useRefraccion({
    activo: refraccion,
    fuerza,
    aumento,
    prefijo: 'liquid-glass',
  })

  useImperativeHandle(refExterna, () => elementoRef.current)

  const filtro = `url("#${filtroId}") blur(1px) saturate(140%)`

  const estiloVidrio =
    refraccion && mapa
      ? {
          backdropFilter: filtro,
          WebkitBackdropFilter: filtro,
        }
      : undefined

  return (
    <>
      <FiltroRefraccion
        id={filtroId}
        mapa={mapa}
        fuerza={fuerza}
      />

      <Elemento
        ref={elementoRef}
        className={className}
        style={{
          ...style,
          ...estiloVidrio,
        }}
        {...props}
      >
        {children}
      </Elemento>
    </>
  )
})

export default LiquidGlass
