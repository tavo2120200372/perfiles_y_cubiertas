import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ProyectosScroll.css";

gsap.registerPlugin(ScrollTrigger);

const proyectos = [
  {
    id: "valle-real",
    numero: "01",
    etiqueta: "ASÍ LO ARMAMOS",
    titulo: "Residencia Valle Real",
    ubicacion: "ZAPOPAN",
    sistema: "DUOVENT 6+6",
    area: "186 M²",
    fondo: "Ve",
    imagen: "/images/trabajos/ValleReal.png",
    fichas: [
      {
        clase: "ficha-a",
        titulo: "Vano de piso a techo",
        texto:
          "3.4 m de altura, escuadría mínima. La luz entra sin interrumpir la vista.",
        posicionImagen: "52% 46%",
      },
      {
        clase: "ficha-b",
        titulo: "Perfil Eurovent RPT",
        texto:
          "Aluminio anodizado con rotura de puente térmico; corta el frío y el calor.",
        posicionImagen: "14% 52%",
      },
      {
        clase: "ficha-c",
        titulo: "Duovent 6+6 mm",
        texto:
          "Doble cristal templado con cámara de argón. Aísla el ruido de la calle.",
        posicionImagen: "82% 54%",
      },
    ],
  },
  {
    id: "torre-icono",
    numero: "02",
    etiqueta: "ASÍ LO ARMAMOS",
    titulo: "Torre Icono",
    ubicacion: "SANTA FE",
    sistema: "MURO CORTINA",
    area: "14 NIVELES",
    fondo: "To",
    imagen: "/images/trabajos/TorreIcono.png",
    fichas: [
      {
        clase: "ficha-a",
        titulo: "Módulos de fachada",
        texto:
          "Cristal de alto desempeño montado sobre una retícula de aluminio.",
        posicionImagen: "52% 30%",
      },
      {
        clase: "ficha-b",
        titulo: "Perfil estructural",
        texto:
          "Perfiles de aluminio preparados para cargas de viento y grandes claros.",
        posicionImagen: "28% 52%",
      },
      {
        clase: "ficha-c",
        titulo: "Montaje preciso",
        texto:
          "Alineación continua para conservar juntas uniformes en toda la fachada.",
        posicionImagen: "76% 58%",
      },
    ],
  },
];

function ProyectosScroll() {
  const seccionRef = useRef(null);

  useLayoutEffect(() => {
    const contexto = gsap.context(() => {
      const escenas = gsap.utils.toArray(".proyecto-scroll-escena");

      escenas.forEach((escena) => {
        const piezas = escena.querySelectorAll(".proyecto-scroll-pieza");
        const fichas = escena.querySelectorAll(".proyecto-scroll-ficha");
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: escena,
            start: "top 90%",
            end: () => `+=${window.innerHeight * 2.25}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .from(
            piezas[0],
            {
              xPercent: -52,
              yPercent: -36,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0,
          )
          .from(
            piezas[1],
            {
              xPercent: 14,
              yPercent: -48,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0.05,
          )
          .from(
            piezas[2],
            {
              xPercent: 48,
              yPercent: -30,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0.1,
          )
          .from(
            piezas[3],
            {
              xPercent: -46,
              yPercent: 32,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0.15,
          )
          .from(
            piezas[4],
            {
              xPercent: 12,
              yPercent: 44,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0.2,
          )
          .from(
            piezas[5],
            {
              xPercent: 52,
              yPercent: 36,
              autoAlpha: 0,
              duration: 1,
              ease: "none",
            },
            0.24,
          )
          .from(
            fichas,
            {
              y: 20,
              scale: 0.96,
              autoAlpha: 0,
              stagger: 0.1,
              duration: 0.48,
              ease: "none",
            },
            1.3,
          )
          .to({}, { duration: 0.5 });
      });
    }, seccionRef);

    return () => contexto.revert();
  }, []);

  return (
    <section ref={seccionRef} className="proyectos-scroll">
      {proyectos.map((proyecto) => (
        <article
          key={proyecto.id}
          className="proyecto-scroll-escena"
          style={{
            "--imagen-proyecto": `url("${proyecto.imagen}")`,
          }}
        >
          <div className="proyecto-scroll-contenedor">
            <div className="proyecto-scroll-fondo" aria-hidden="true">
              {proyecto.fondo}
            </div>

            <header className="proyecto-scroll-encabezado">
              <span className="proyecto-scroll-etiqueta">
                {proyecto.etiqueta}
              </span>
              <span className="proyecto-scroll-numero">{proyecto.numero}</span>
              <h2>{proyecto.titulo}</h2>
              <p className="proyecto-scroll-meta">
                {proyecto.ubicacion}
                <span>·</span>
                {proyecto.sistema}
                <span>·</span>
                {proyecto.area}
              </p>
            </header>

            <div className="proyecto-scroll-visual">
              <div className="proyecto-scroll-imagen">
                {Array.from({ length: 6 }, (_, indice) => (
                  <div
                    key={indice}
                    className={`proyecto-scroll-pieza proyecto-scroll-pieza--${indice + 1}`}
                  />
                ))}
              </div>

              {proyecto.fichas.map((ficha) => (
                <div
                  key={ficha.titulo}
                  className={`proyecto-scroll-ficha ${ficha.clase}`}
                >
                  <span className="proyecto-scroll-miniatura">
                    <img
                      src={proyecto.imagen}
                      alt=""
                      aria-hidden="true"
                      style={{
                        objectPosition: ficha.posicionImagen,
                      }}
                    />
                  </span>
                  <span className="proyecto-scroll-ficha-contenido">
                    <strong>{ficha.titulo}</strong>
                    <span>{ficha.texto}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}

export default ProyectosScroll;
