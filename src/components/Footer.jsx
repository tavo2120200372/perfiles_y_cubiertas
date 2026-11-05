import './Footer.css'

const navegacion = [
  { texto: 'Inicio', href: '#inicio' },
  { texto: 'Servicios', href: '#servicios' },
  { texto: 'Trabajos', href: '#trabajos' },
  { texto: 'Nosotros', href: '#nosotros' },
  { texto: 'Contáctanos', href: '#contacto' },
]

const servicios = [
  'Ventanales y Domos',
  'Puertas de Cristal',
  'Canceles de Baño',
  'Cubiertas y Techumbres',
  'Muro Cortina',
  'Espejos y Barandales',
]

function Footer() {
  const anio = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-contenedor">
        <div className="footer-superior">
          <div className="footer-marca-bloque">
            <a
              href="#inicio"
              className="footer-marca"
              aria-label="Perfiles y Cubiertas, inicio"
            >
              <span className="footer-marca-siglas">
                PyC
              </span>

              <span className="footer-marca-nombre">
                PERFILES Y CUBIERTAS
              </span>
            </a>

            <p className="footer-descripcion">
              Fabricación e instalación de ventanales, puertas de cristal
              templado, canceles de acrílico, domos y cubiertas. Diseño
              arquitectónico, medición milimétrica y acabados premium
              en Guadalajara.
            </p>

            <div className="footer-redes">
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
              >
                INSTAGRAM
              </a>

              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
              >
                FACEBOOK
              </a>

              <a
                href="https://wa.me/523336758240"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                WHATSAPP
              </a>
            </div>
          </div>

          <nav
            className="footer-columna"
            aria-label="Navegación del pie de página"
          >
            <p className="footer-columna-titulo">
              NAVEGACIÓN
            </p>

            <div className="footer-lista">
              {navegacion.map(({ texto, href }) => (
                <a
                  key={href}
                  href={href}
                >
                  {texto}
                </a>
              ))}
            </div>
          </nav>

          <div className="footer-columna">
            <p className="footer-columna-titulo">
              SERVICIOS
            </p>

            <div className="footer-lista">
              {servicios.map((servicio) => (
                <a
                  key={servicio}
                  href="#servicios"
                >
                  {servicio}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-inferior">
          <p>
            © {anio} Perfiles y Cubiertas · Frijol #348,
            La Nogalera, 44470 Guadalajara, Jal.
          </p>

          <p className="footer-frase">
            <span
              className="footer-punto"
              aria-hidden="true"
            >
              <span className="footer-punto-pulso" />
              <span className="footer-punto-centro" />
            </span>

            Hecho con vidrio, aluminio y precisión milimétrica.
          </p>
        </div>

        <div
          className="footer-texto-decorativo"
          aria-hidden="true"
        >
          Perfiles y Cubiertas
        </div>
      </div>
    </footer>
  )
}

export default Footer
