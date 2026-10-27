import { FiltroRefraccion, useRefraccion } from './Refraccion'

function GlassPanel({
  className = '',
  fuerza = 28,
  refraccion = true,
  aumento = 1.06,
}) {
  const { elementoRef, mapa, filtroId } = useRefraccion({
    activo: refraccion,
    fuerza,
    aumento,
    radioPorDefecto: 32,
    prefijo: 'vidrio',
  })

  const filtro = `url("#${filtroId}")`

  const estilo =
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

      <div
        ref={elementoRef}
        className={`panel-vidrio ${className}`}
        style={estilo}
        aria-hidden="true"
      />
    </>
  )
}

export default GlassPanel
