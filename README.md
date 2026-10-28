# ClimaYa

Aplicación web pequeña que consulta el **clima actual y el pronóstico de 5 días** de cualquier ciudad usando la API pública de [Open-Meteo](https://open-meteo.com/).

![Evidencia GitHub Pro](evidencia/github-pro.png)

- Perfil de GitHub: https://github.com/almeida-crypto

## Funcionalidades

- Búsqueda de ciudad por nombre (API de geocodificación de Open-Meteo).
- Clima actual: temperatura, sensación térmica, humedad, viento y descripción.
- Pronóstico de los próximos 5 días (máxima / mínima e ícono).
- Manejo de errores con mensajes claros para el usuario:
  - **Sin conexión** (`navigator.onLine` y fallas de `fetch`), con aviso si se pierde/recupera la red.
  - **Respuesta vacía** (ciudad no encontrada o API sin datos).
  - **Límite de peticiones** (HTTP 429).
  - **Servidor caído** (HTTP 5xx) y **tiempo de espera** agotado (8 s con `AbortController`).
- Diseño responsivo (funciona en celular).

## API utilizada

| Endpoint | Uso |
|---|---|
| `https://geocoding-api.open-meteo.com/v1/search` | Convertir el nombre de la ciudad en coordenadas |
| `https://api.open-meteo.com/v1/forecast` | Clima actual y pronóstico diario |

Open-Meteo es gratuita para uso no comercial y **no requiere clave de API**, por lo que no hay ninguna clave en el repositorio. Aun así, `.env` está en `.gitignore` por si en el futuro se agrega una API que sí la necesite.

## Cómo ejecutarla

Requisitos: [Node.js](https://nodejs.org/) 18 o superior (no hay dependencias que instalar).

```bash
git clone https://github.com/almeida-crypto/climaya.git
cd climaya
node server.js
```

Abre http://localhost:5173 en el navegador. Para usar otro puerto:

- Windows (PowerShell): `$env:PORT=3000; node server.js`
- macOS / Linux / Git Bash: `PORT=3000 node server.js`

> También puedes abrir `index.html` directamente en el navegador; el servidor solo es una forma cómoda de servir los archivos.

## Estructura

```
index.html        Estructura de la página
css/styles.css    Estilos
js/api.js         Peticiones a la API y manejo de errores (clase ApiError)
js/app.js         Lógica de la interfaz y renderizado de resultados
server.js         Servidor estático mínimo con Node (sin dependencias)
BITACORA.md       Bitácora de programación con IA
evidencia/        Captura de GitHub Pro y enunciado de la tarea
```

## Declaración de uso de IA

| Herramienta | Para qué la usé |
|---|---|
| **Claude Code** (Claude Opus 5.5, Anthropic) | Leer el enunciado de la tarea, proponer la estructura del proyecto, **generar el código** (HTML, CSS, `api.js`, `app.js`, `server.js`), **probar** la app en el navegador (búsqueda real y simulación de errores 429, sin red y respuesta vacía) y **documentar** (este README y la bitácora). |

### Lo que hice sin ayuda de IA

- Crear y configurar mi cuenta de GitHub, solicitar y activar el GitHub Student Developer Pack (GitHub Pro) y tomar la captura de evidencia.
- Instalar y configurar Git en mi computadora (nombre, correo y sesión de GitHub).
- Revisar y entender cada archivo del código para poder explicarlo, y probar la app por mi cuenta.
- <!-- TODO: agrega aquí cualquier otra cosa que hayas hecho tú (cambios de diseño, pruebas, el video de demostración, etc.) -->
