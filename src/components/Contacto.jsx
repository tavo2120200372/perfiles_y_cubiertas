import { useState } from 'react'
import './Contacto.css'
import Revelar from './Revelar'
import LiquidGlass from './LiquidGlass'

const TELEFONO_VISIBLE = '33 3675 8240'
const TELEFONO_WHATSAPP = '523336758240'
const CORREO = 'contacto@perfilesycubiertas.mx'
const DIRECCION = 'Frijol #348, La Nogalera, 44470 Guadalajara, Jal.'

const SERVICIOS = [
  'Ventanales y domos',
  'Puertas de cristal',
  'Canceles de baño',
  'Cubiertas y techumbres',
  'Muro cortina',
  'Espejos y barandales',
  'Otro',
]

function IconoTelefono() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.4 3.8 8.2 3l2.1 5.1-2 1.2a14.8 14.8 0 0 0 6.5 6.5l1.2-2 5.1 2.1-.8 2.8a2.4 2.4 0 0 1-2.4 1.8C10.5 20.5 3.5 13.5 3.5 6.2A2.4 2.4 0 0 1 5.4 3.8Z" />
    </svg>
  )
}

function IconoCorreo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.2" />
      <path d="m5 7 7 5.2L19 7" />
    </svg>
  )
}

function IconoWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 11.3a8.7 8.7 0 0 1-12.8 7.7L4 20l1-3.1a8.7 8.7 0 1 1 15.2-5.6Z" />
      <path d="M9.4 8.3c.2-.4.4-.5.7-.5h.3c.2 0 .4 0 .5.4l.8 1.9c.1.2.1.4 0 .6l-.6.8c-.1.2-.1.3 0 .5.5.9 1.3 1.7 2.3 2.2.2.1.4.1.5-.1l.8-.9c.2-.2.4-.3.6-.2l1.8.8c.3.1.4.3.4.5 0 .3-.2 1.2-.8 1.7-.5.5-1.2.8-2 .7-1.1-.2-2.5-.9-3.9-2.2-1.3-1.2-2.3-2.7-2.6-3.9-.2-1 0-1.8.5-2.3Z" />
    </svg>
  )
}

function Contacto() {
  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    servicio: SERVICIOS[0],
    detalles: '',
  })

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }))
  }

  const enviarWhatsApp = (evento) => {
    evento.preventDefault()

    const nombre = formulario.nombre.trim()
    const telefono = formulario.telefono.trim()
    const detalles = formulario.detalles.trim()

    const mensaje = [
      'Hola, quiero solicitar una cotización.',
      '',
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Servicio: ${formulario.servicio}`,
      `Detalles: ${detalles}`,
    ].join('\n')

    const url =
      `https://wa.me/${TELEFONO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="contacto"
      className="contacto"
      aria-labelledby="contacto-titulo"
    >
      <div className="contacto-contenedor">
        <Revelar delay={0}>
          <div className="contacto-principal">
            <p className="contacto-etiqueta">
              <span
                className="contacto-punto"
                aria-hidden="true"
              >
                <span className="contacto-punto-pulso" />
                <span className="contacto-punto-centro" />
              </span>
              CONTÁCTANOS
            </p>

            <h2 id="contacto-titulo">
              Cuéntanos qué
              <br />
              <strong>quieres construir.</strong>
            </h2>

            <p className="contacto-introduccion">
              Levantamos medidas sin costo en Guadalajara y zona
              metropolitana. Respondemos con propuesta y presupuesto
              en menos de 24 horas hábiles.
            </p>

            <form
              className="contacto-formulario"
              onSubmit={enviarWhatsApp}
            >
              <div className="contacto-campos-dobles">
                <label className="contacto-campo">
                  <span>NOMBRE</span>
                  <input
                    type="text"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    placeholder="Tu nombre"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="contacto-campo">
                  <span>TELÉFONO</span>
                  <input
                    type="tel"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={actualizarCampo}
                    placeholder="33 0000 0000"
                    autoComplete="tel"
                    required
                  />
                </label>
              </div>

              <label className="contacto-campo">
                <span>SERVICIO DE INTERÉS</span>
                <select
                  name="servicio"
                  value={formulario.servicio}
                  onChange={actualizarCampo}
                  required
                >
                  {SERVICIOS.map((servicio) => (
                    <option key={servicio} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>
              </label>

              <label className="contacto-campo">
                <span>DETALLES DEL PROYECTO</span>
                <textarea
                  name="detalles"
                  value={formulario.detalles}
                  onChange={actualizarCampo}
                  placeholder="Medidas aproximadas, ubicación, tipo de acabado..."
                  rows="5"
                  required
                />
              </label>

              <div className="contacto-envio">
                <button type="submit">
                  Enviar solicitud
                </button>

                <p>
                  Se abrirá WhatsApp con tu mensaje listo para enviar.
                </p>
              </div>
            </form>
          </div>
        </Revelar>

        <Revelar delay={120}>
          <aside className="contacto-lateral">
            <LiquidGlass
              as="div"
              className="contacto-cristal-decorativo"
              fuerza={10}
              aumento={1.015}
              aria-hidden="true"
            />

            <div className="contacto-tarjeta contacto-tarjeta--directos">
              <p className="contacto-tarjeta-titulo">
                DATOS DIRECTOS
              </p>

              <div className="contacto-directos">
                <a href={`tel:+${TELEFONO_WHATSAPP}`}>
                  <span className="contacto-icono">
                    <IconoTelefono />
                  </span>
                  <span className="contacto-dato">
                    <small>TELÉFONO</small>
                    <strong>{TELEFONO_VISIBLE}</strong>
                  </span>
                </a>

                <a href={`mailto:${CORREO}`}>
                  <span className="contacto-icono">
                    <IconoCorreo />
                  </span>
                  <span className="contacto-dato">
                    <small>CORREO</small>
                    <strong>{CORREO}</strong>
                  </span>
                </a>

                <a
                  href={`https://wa.me/${TELEFONO_WHATSAPP}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contacto-icono">
                    <IconoWhatsApp />
                  </span>
                  <span className="contacto-dato">
                    <small>WHATSAPP</small>
                    <strong>{TELEFONO_VISIBLE}</strong>
                  </span>
                </a>
              </div>
            </div>

            <div className="contacto-tarjeta contacto-tarjeta--taller">
              <p className="contacto-tarjeta-titulo">
                TALLER Y SHOWROOM
              </p>

              <p className="contacto-direccion">
                Frijol #348, La Nogalera
                <br />
                44470 Guadalajara, Jal.
              </p>

              <div className="contacto-horarios">
                <div>
                  <span>Lunes a Viernes</span>
                  <strong>8:00 – 18:00</strong>
                </div>

                <div>
                  <span>Sábado</span>
                  <strong>9:00 – 14:00</strong>
                </div>

                <div>
                  <span>Domingo</span>
                  <strong>Cerrado</strong>
                </div>
              </div>
            </div>

            <div className="contacto-mapa">
              <iframe
                title="Ubicación de Perfiles y Cubiertas"
                src={`https://www.google.com/maps?q=${encodeURIComponent(DIRECCION)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="contacto-cobertura">
              Cobertura en Guadalajara, Zapopan, Tlaquepaque, Tonalá y Bajío.
            </p>
          </aside>
        </Revelar>
      </div>
    </section>
  )
}

export default Contacto
