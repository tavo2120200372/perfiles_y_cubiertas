const PROPIEDADES_SVG = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

// Contenido del SVG de cada servicio, indexado por el id del servicio.
const ICONOS = {
  ventanales: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M12 4v16" />
      <path d="M4 12h16" />
    </>
  ),

  puertas: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="1" />
      <path d="M10 3v18" />
      <circle cx="15" cy="12" r="0.7" fill="currentColor" />
    </>
  ),

  canceles: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M10 4v16" />
      <path d="M14 4v16" />
      <path d="M8 12h2" />
      <path d="M14 12h2" />
    </>
  ),

  cubiertas: (
    <>
      <path d="M3 13 12 6l9 7" />
      <path d="M5 12v8h14v-8" />
      <path d="M8 20v-5h8v5" />
    </>
  ),

  'muro-cortina': (
    <>
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <path d="M9.3 3v18" />
      <path d="M14.7 3v18" />
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </>
  ),

  espejos: (
    <>
      <rect x="7" y="3" width="10" height="18" rx="5" />
      <path d="M10 7h4" />
      <path d="M9 17h6" />
    </>
  ),
}

const ICONO_PREDETERMINADO = (
  <rect x="5" y="5" width="14" height="14" />
)

function IconoServicio({ tipo }) {
  return (
    <svg {...PROPIEDADES_SVG}>
      {ICONOS[tipo] ?? ICONO_PREDETERMINADO}
    </svg>
  )
}

export default IconoServicio
