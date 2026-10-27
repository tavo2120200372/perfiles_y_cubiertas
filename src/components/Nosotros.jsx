import './Nosotros.css'
import Revelar from './Revelar'
import LiquidGlass from './LiquidGlass'

function Nosotros({
  imagen = '/images/nosotros/taller.jpg',
  enlaceTaller = '#nosotros',
  enlaceContacto = '#contacto',
}) {
  return (
    <section
      id="nosotros"
      className="nosotros"
      aria-labelledby="nosotros-titulo"
    >
      <div className="nosotros-contenedor">
        <Revelar delay={0}>
          <div className="nosotros-visual">
            <img
              className="nosotros-imagen"
              src={imagen}
              alt="Trabajo de fabricación realizado en el taller"
              loading="lazy"
            />
            <span
              className="nosotros-imagen-capa"
              aria-hidden="true"
            />
            <LiquidGlass
              as="div"
              className="nosotros-ficha"
              fuerza={10}
              aumento={1.02}
            >
              <span className="nosotros-ficha-etiqueta">
                DESDE
              </span>
              <strong>2007</strong>
              <span className="nosotros-ficha-texto">
                Fabricando en Guadalajara
              </span>
            </LiquidGlass>
          </div>
        </Revelar>

        <Revelar delay={120}>
          <div className="nosotros-contenido">
            <p className="nosotros-etiqueta">
              <span
                className="nosotros-punto"
                aria-hidden="true"
              >
                <span className="nosotros-punto-pulso" />
                <span className="nosotros-punto-centro" />
              </span>
              NOSOTROS
            </p>

            <h2 id="nosotros-titulo">
              El mismo equipo mide,
              <br />
              <strong>fabrica e instala.</strong>
            </h2>

            <p className="nosotros-descripcion">
              No subcontratamos. Esa continuidad es lo que nos
              permite entregar piezas de más de tres metros con
              tolerancias de dos milímetros y una obra limpia el
              día de la instalación.
            </p>

            <div
              className="nosotros-divisor"
              aria-hidden="true"
            />

            <div className="nosotros-datos">
              <div className="nosotros-dato">
                <strong>18</strong>
                <span>AÑOS DE TALLER</span>
              </div>

              <div className="nosotros-dato">
                <strong>2 mm</strong>
                <span>DE TOLERANCIA</span>
              </div>

              <div className="nosotros-dato">
                <strong>5 años</strong>
                <span>DE GARANTÍA</span>
              </div>
            </div>

            <div className="nosotros-acciones">
              <a
                className="nosotros-boton nosotros-boton--principal"
                href={enlaceTaller}
              >
                Conocer el taller
                <span aria-hidden="true">→</span>
              </a>

              <a
                className="nosotros-boton nosotros-boton--secundario"
                href={enlaceContacto}
              >
                Hablar con nosotros
              </a>
            </div>
          </div>
        </Revelar>
      </div>
    </section>
  )
}

export default Nosotros
