import './Trabajos.css'
import Revelar from './Revelar'

const trabajos = [
  {
    id: 'residencia-valle-real',
    categoria: 'RESIDENCIAL',
    ubicacion: 'ZAPOPAN, JALISCO · 2025',
    titulo: 'Residencia Valle Real',
    imagen:
      '/images/trabajos/ValleReal.png',
    alt: 'Residencia contemporánea con grandes ventanales',
  },
  {
    id: 'torre-icono',
    categoria: 'CORPORATIVO',
    ubicacion: 'PUERTA DE HIERRO, ZAPOPAN · 2024',
    titulo: 'Torre Ícono',
    imagen:
      '/images/trabajos/TorreIcono.png',
    alt: 'Torre corporativa con fachada de cristal',
  },
  {
    id: 'casa-bosque',
    categoria: 'RESIDENCIAL',
    ubicacion: 'TAPALPA, JALISCO · 2025',
    titulo: 'Casa Bosque',
    imagen:
      '/images/trabajos/CasaBosque.png',
    alt: 'Casa contemporánea rodeada de árboles',
  },
]

function Trabajos({
  enlaceGaleria = '#trabajos',
}) {
  return (
    <section
      id="trabajos"
      className="trabajos"
      aria-labelledby="trabajos-titulo"
    >
      <div className="trabajos-contenedor">
        <header className="trabajos-encabezado">
          <div className="trabajos-encabezado-texto">
            <p className="trabajos-etiqueta">
              <span
                className="trabajos-punto"
                aria-hidden="true"
              >
                <span className="trabajos-punto-pulso" />
                <span className="trabajos-punto-centro" />
              </span>

              TRABAJOS
            </p>

            <h2 id="trabajos-titulo">
              Obras que ya están
              <br />
              <strong>de pie.</strong>
            </h2>

            <p className="trabajos-introduccion">
              Una muestra de lo entregado en los últimos
              dos años, entre residencial, corporativo y
              cubiertas.
            </p>
          </div>

          <a
            className="trabajos-enlace"
            href={enlaceGaleria}
          >
            Ver galería completa
            <span aria-hidden="true">→</span>
          </a>
        </header>

        <div className="trabajos-cuadricula">
          {trabajos.map((trabajo, indice) => (
            <Revelar
              key={trabajo.id}
              delay={indice * 750}
            >
              <article className="trabajo-tarjeta">
                <a
                  className="trabajo-enlace-tarjeta"
                  href={enlaceGaleria}
                  aria-label={`Ver ${trabajo.titulo}`}
                >
                  <img
                    className="trabajo-imagen"
                    src={trabajo.imagen}
                    alt={trabajo.alt}
                    loading="lazy"
                  />

                  <span
                    className="trabajo-degradado"
                    aria-hidden="true"
                  />

                  <span className="trabajo-categoria">
                    {trabajo.categoria}
                  </span>

                  <div className="trabajo-informacion">
                    <p className="trabajo-ubicacion">
                      {trabajo.ubicacion}
                    </p>

                    <h3>{trabajo.titulo}</h3>

                    <span
                      className="trabajo-detalle"
                      aria-hidden="true"
                    >
                      Ver detalle
                      <span className="trabajo-detalle-flecha">
                        →
                      </span>
                    </span>
                  </div>
                </a>
              </article>
            </Revelar>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Trabajos
