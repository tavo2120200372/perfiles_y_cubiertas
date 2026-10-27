import './Servicios.css'
import './ServiciosCatalogo.css'
import TarjetaServicio from './TarjetaServicio'
import Revelar from './Revelar'
import { servicios } from '../data/servicios'

const TEXTOS = {
  inicio: {
    etiqueta: 'SERVICIOS',
    titulo: 'Todo lo que sale',
    destacado: 'de nuestro taller.',
    introduccion:
      'Soluciones en vidrio, aluminio y cubiertas para tu proyecto. Desliza las fotos y abre cada tarjeta para conocer los detalles.',
  },
  catalogo: {
    etiqueta: 'CATÁLOGO',
    titulo: 'Lo que fabricamos',
    destacado: 'y cómo lo resolvemos.',
    introduccion:
      'Explora cada servicio y sus posibilidades. Adaptamos la propuesta a las necesidades de tu proyecto.',
  },
}

function Servicios({ vista = 'inicio', enlaceCatalogo }) {
  const catalogo = vista === 'catalogo'
  const modo = catalogo ? 'catalogo' : 'inicio'
  const texto = TEXTOS[modo]

  return (
    <section
      id="servicios"
      className={`servicios servicios--${modo}`}
      aria-labelledby="servicios-titulo"
    >
      <div className="servicios-contenedor">
        <header className="servicios-encabezado">
          <div>
            <p className="servicios-etiqueta">
              <span
                className="servicios-punto"
                aria-hidden="true"
              >
                <span className="servicios-punto-pulso" />
                <span className="servicios-punto-centro" />
              </span>

              {texto.etiqueta}
            </p>

            <h2 id="servicios-titulo">
              {texto.titulo}
              <br />
              <strong>{texto.destacado}</strong>
            </h2>

            <p className="servicios-introduccion">
              {texto.introduccion}
            </p>
          </div>

          {!catalogo && enlaceCatalogo && (
            <a
              className="servicios-enlace"
              href={enlaceCatalogo}
            >
              Ver todos los servicios
              <span aria-hidden="true">→</span>
            </a>
          )}
        </header>

        <div className="servicios-cuadricula">
          {servicios.map((servicio, indice) => (
            <Revelar
              key={servicio.id}
              delay={catalogo ? 0 : (indice % 3) * 750}
            >
              <TarjetaServicio
                servicio={servicio}
                vista={vista}
              />
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Servicios
