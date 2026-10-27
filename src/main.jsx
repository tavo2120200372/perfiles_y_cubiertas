import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Usa el tema guardado; si no hay, el del sistema.
function obtenerTemaInicial() {
  const temaGuardado = localStorage.getItem('tema')

  if (temaGuardado === 'light' || temaGuardado === 'dark') {
    return temaGuardado
  }

  const prefiereOscuro = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches

  return prefiereOscuro ? 'dark' : 'light'
}

document.documentElement.dataset.theme = obtenerTemaInicial()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
