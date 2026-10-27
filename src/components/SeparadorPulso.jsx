// Punto con pulso animado. Sus estilos viven en Hero.css.
function SeparadorPulso() {
  return (
    <span className="hero-separador" aria-hidden="true">
      <span className="hero-separador-pulso" />
      <span className="hero-separador-centro" />
    </span>
  )
}

export default SeparadorPulso
