import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./Navbar.css";
import SeparadorPulso from "./SeparadorPulso";
import {
  limitar,
  prefiereMovimientoReducido,
  suscribirScrollYResize,
} from "../utils/helpers";

const enlaces = [
  { href: "#inicio", texto: "Inicio" },
  { href: "#servicios", texto: "Servicios" },
  { href: "#trabajos", texto: "Trabajos" },
  { href: "#nosotros", texto: "Nosotros" },
  { href: "#contacto", texto: "Contáctanos" },
];

function Navbar() {
  const encabezadoRef = useRef(null);
  const navegacionRef = useRef(null);
  const indicadorRef = useRef(null);
  const navegacionProgramaticaRef = useRef(false);
  const temporizadorDesbloqueoRef = useRef(null);
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [tema, setTema] = useState(
    () => document.documentElement.dataset.theme || "light",
  );
  const esOscuro = tema === "dark";

  const cambiarTema = () => {
    setTema((temaActual) => (temaActual === "light" ? "dark" : "light"));
  };

  const manejarNavegacion = (evento, href, seccion) => {
    const destino = document.querySelector(href);
    if (!destino) return;
    evento.preventDefault();
    navegacionProgramaticaRef.current = true;
    setSeccionActiva(seccion);
    setMenuMovilAbierto(false);
    window.clearTimeout(temporizadorDesbloqueoRef.current);
    temporizadorDesbloqueoRef.current = window.setTimeout(() => {
      navegacionProgramaticaRef.current = false;
    }, 1400);
    window.history.pushState(null, "", href);
    destino.scrollIntoView({
      behavior: prefiereMovimientoReducido() ? "auto" : "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    localStorage.setItem("tema", tema);
  }, [tema]);

  useEffect(() => {
    const cerrarConEscape = (evento) => {
      if (evento.key === "Escape") {
        setMenuMovilAbierto(false);
      }
    };
    const cerrarEnEscritorio = () => {
      if (window.innerWidth > 800) {
        setMenuMovilAbierto(false);
      }
    };
    document.addEventListener("keydown", cerrarConEscape);
    window.addEventListener("resize", cerrarEnEscritorio);
    return () => {
      document.removeEventListener("keydown", cerrarConEscape);
      window.removeEventListener("resize", cerrarEnEscritorio);
    };
  }, []);

  useLayoutEffect(() => {
    const navegacion = navegacionRef.current;
    const indicador = indicadorRef.current;
    if (!navegacion || !indicador) return;
    const destino = navegacion.querySelector(
      `[data-seccion="${seccionActiva}"]`,
    );
    if (!destino) return;
    const navegacionRect = navegacion.getBoundingClientRect();
    const destinoRect = destino.getBoundingClientRect();
    const xDestino = destinoRect.left - navegacionRect.left;
    const anchoDestino = destinoRect.width;

    if (indicador.dataset.inicializado !== "true") {
      indicador.style.transition = "none";
      indicador.style.transform = `translate3d(${xDestino}px, 0, 0)`;
      indicador.style.width = `${anchoDestino}px`;
      indicador.dataset.inicializado = "true";
      void indicador.offsetWidth;
      indicador.style.removeProperty("transition");
      return;
    }

    if (prefiereMovimientoReducido()) {
      indicador.style.transition = "none";
    } else {
      indicador.style.removeProperty("transition");
    }

    indicador.style.transform = `translate3d(${xDestino}px, 0, 0)`;
    indicador.style.width = `${anchoDestino}px`;
  }, [seccionActiva]);

  useEffect(() => {
    let temporizadorFinScroll = null;

    const finalizarNavegacionProgramatica = () => {
      if (!navegacionProgramaticaRef.current) return;
      navegacionProgramaticaRef.current = false;
      window.clearTimeout(temporizadorDesbloqueoRef.current);
    };

    const detectarFinScroll = () => {
      if (!navegacionProgramaticaRef.current) return;
      window.clearTimeout(temporizadorFinScroll);
      temporizadorFinScroll = window.setTimeout(
        finalizarNavegacionProgramatica,
        140,
      );
    };

    window.addEventListener("scroll", detectarFinScroll, {
      passive: true,
    });
    window.addEventListener("scrollend", finalizarNavegacionProgramatica);

    return () => {
      window.removeEventListener("scroll", detectarFinScroll);
      window.removeEventListener("scrollend", finalizarNavegacionProgramatica);
      window.clearTimeout(temporizadorFinScroll);
      window.clearTimeout(temporizadorDesbloqueoRef.current);
    };
  }, []);

  useEffect(() => {
    const secciones = enlaces
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    if (!secciones.length) return;

    return suscribirScrollYResize(() => {
      if (navegacionProgramaticaRef.current) return;
      const puntoReferencia = window.scrollY + window.innerHeight * 0.35;
      let activa = secciones[0].id;

      secciones.forEach((seccion) => {
        if (seccion.offsetTop <= puntoReferencia) {
          activa = seccion.id;
        }
      });

      setSeccionActiva(activa);
    });
  }, []);

  useEffect(() => {
    const encabezado = encabezadoRef.current;
    if (!encabezado) return;

    return suscribirScrollYResize(() => {
      const anchoVentana = window.innerWidth;
      if (anchoVentana <= 800 || prefiereMovimientoReducido()) {
        encabezado.style.removeProperty("width");
        return;
      }

      const anchoInicial = anchoVentana - 48;
      const anchoFinal = Math.min(
        anchoInicial,
        Math.max(820, anchoVentana * 0.56),
      );
      const progresoBase = limitar(window.scrollY / 520, 0, 1);
      const progreso = progresoBase * progresoBase * (3 - 2 * progresoBase);
      const anchoActual = anchoInicial + (anchoFinal - anchoInicial) * progreso;

      encabezado.style.width = `${anchoActual}px`;
    });
  }, []);

  return (
    <header ref={encabezadoRef} className="encabezado">
      <a
        href="#inicio"
        className="marca"
        aria-label="Perfiles y Cubiertas, inicio"
        onClick={(evento) => manejarNavegacion(evento, "#inicio", "inicio")}
      >
        <span className="marca-siglas">PyC</span>
        <span className="marca-nombre">
          PERFILES
          <span>Y CUBIERTAS</span>
        </span>
      </a>

      <nav
        ref={navegacionRef}
        className="navegacion"
        aria-label="Navegación principal"
      >
        <span
          ref={indicadorRef}
          className="nav-indicador-activo"
          aria-hidden="true"
        />

        {enlaces.map(({ href, texto }) => {
          const seccion = href.slice(1);
          return (
            <a
              key={href}
              href={href}
              data-seccion={seccion}
              aria-current={seccionActiva === seccion ? "page" : undefined}
              onClick={(evento) => manejarNavegacion(evento, href, seccion)}
            >
              {texto}
            </a>
          );
        })}

        <button
          type="button"
          className="boton-tema"
          onClick={cambiarTema}
          aria-label={esOscuro ? "Activar modo claro" : "Activar modo oscuro"}
          title={esOscuro ? "Modo claro" : "Modo oscuro"}
        >
          {esOscuro ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z" />
            </svg>
          )}
        </button>

        <a
          href="#contacto"
          className="boton-cotizar"
          onClick={(evento) =>
            manejarNavegacion(evento, "#contacto", "contacto")
          }
        >
          <SeparadorPulso />
          Cotizar
        </a>

        <button
          type="button"
          className={`boton-menu ${menuMovilAbierto ? "boton-menu--abierto" : ""}`}
          aria-label={menuMovilAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuMovilAbierto}
          aria-controls="menu-movil"
          onClick={() => setMenuMovilAbierto((abierto) => !abierto)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      <div
        id="menu-movil"
        className={`menu-movil ${menuMovilAbierto ? "menu-movil--abierto" : ""}`}
        aria-hidden={!menuMovilAbierto}
      >
        {enlaces.map(({ href, texto }) => {
          const seccion = href.slice(1);
          return (
            <a
              key={`movil-${href}`}
              href={href}
              aria-current={seccionActiva === seccion ? "page" : undefined}
              onClick={(evento) => manejarNavegacion(evento, href, seccion)}
            >
              {texto}
            </a>
          );
        })}
        <a
          href="#contacto"
          className="menu-movil-cotizar"
          onClick={(evento) =>
            manejarNavegacion(evento, "#contacto", "contacto")
          }
        >
          <SeparadorPulso />
          Cotizar mi proyecto
        </a>
      </div>
    </header>
  );
}

export default Navbar;
