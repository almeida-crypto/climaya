# Bitácora de programación con IA — ClimaYa

**Herramienta:** Claude Code (app de escritorio de Claude, modelo Claude Opus 5.5)
**Alumno:** Victor Almeida — GitHub: [almeida-crypto](https://github.com/almeida-crypto)
**Repositorio:** https://github.com/almeida-crypto/climaya

---

## Prompt 1

> haz lo que se te indica en el pdf, de esta carpeta, lo de git ya lo hice, tu haz lo demas, ya tengo la captura de que tengo git pro, igual esta en la carpeta

**Qué respondió la IA:** Leyó el PDF de la tarea y la captura, eligió hacer una app del clima con la API gratuita de Open-Meteo (no necesita clave, así no hay riesgo de exponerla) y generó el proyecto por etapas, con un commit por etapa: estructura HTML/CSS → cliente de la API con manejo de errores → interfaz → servidor local → README y esta bitácora. Después abrió la app en un navegador, buscó "Guadalajara", probó una ciudad inexistente y simuló un error 429, una caída de red y una respuesta vacía.

**¿Funcionó a la primera?** Casi. El código funcionó, pero al abrir `index.html` directamente (`file://`) en el navegador de pruebas la página se mostraba como una "foto" estática y el JavaScript no se ejecutaba, así que no se podía probar la búsqueda.

**Qué se corrigió:** Se agregó `server.js`, un servidor mínimo con Node sin dependencias, para servir la app en `http://localhost:5173`. Con eso todas las pruebas pasaron.

---

## Prompt 2

> Sí, súbelo

**Qué respondió la IA:** Creó el repositorio público `almeida-crypto/climaya` con GitHub CLI (`gh repo create … --push`) y subió los 6 commits. Luego verificó en GitHub que todos los commits aparecieran con mi nombre y que no se hubiera subido ningún `.env` ni la carpeta de configuración `.claude/`.

**¿Funcionó a la primera?** Sí.

**Qué tuve que ajustar:** Nada. Antes de subirlo la IA me preguntó si lo quería público o privado, porque crear un repositorio público es algo que no se puede "deshacer" del todo (otros lo pueden ver o copiar).

---

## Prompt 3

> hazme el punto 1 y 2, ya el video lo hago yo

**Qué respondió la IA:** Antes de completar la bitácora revisó el código que ella misma había generado y encontró dos errores reales (ver la sección "Error de la IA que detecté"): un fallo de seguridad en `server.js` y un comando del README que no funciona en Windows. Corrigió los dos, los probó y los subió en commits separados. Luego completó esta bitácora y la sección del README sobre lo que hice sin IA.

**¿Funcionó a la primera?** Sí, pero solo porque se pidió revisar; el código original de la IA tenía errores que no se veían usando la app normalmente.

**Qué tuve que corregir o ajustar:** La IA no inventó los prompts que faltaban: solo anotó los que realmente envié. Los prompts 4 y 5 los hice después para entender el código.

---

## Prompt 4

> Explícame fetchJSON

**Qué respondió la IA:** Explicó la función `fetchJSON` de `js/api.js` por bloques: (1) revisa `navigator.onLine` para no intentar la petición sin red; (2) crea un `AbortController` y un `setTimeout` de 8 s que cancela la petición si tarda demasiado; (3) hace el `fetch` dentro de un `try/catch`, donde `AbortError` significa "tardó demasiado" y cualquier otro error significa que la petición ni siquiera llegó al servidor; (4) el `finally` limpia el temporizador pase lo que pase; (5) revisa el código de estado: 429 = límite de peticiones, 500 o más = servidor caído, cualquier otro no-OK = error genérico; (6) devuelve `response.json()`. Explicó también que `fetch` **no** lanza error con un 404 o 500, por eso hay que revisar `response.status` a mano.

**¿Funcionó a la primera?** La explicación sí, pero al releer la función la IA notó que el comentario "convierte cualquier falla en un ApiError" no es del todo cierto: si la API respondiera con algo que no es JSON (por ejemplo una página HTML de mantenimiento), `response.json()` lanza un `SyntaxError`, no un `ApiError`. Lo comprobó simulando esa respuesta: el error que salió fue `SyntaxError: Unexpected token '<'`. La app no se rompe (muestra "Ocurrió un error inesperado"), pero el mensaje no es claro.

**Qué tuve que corregir o ajustar:** Lo dejé anotado para corregirlo en el siguiente prompt.

---

## Prompt 5

> <!-- PENDIENTE: prompt real -->

**Qué respondió la IA:**
**¿Funcionó a la primera?**
**Qué tuve que corregir o ajustar:**

---

## Error de la IA que detecté

**1. Solución insegura en `server.js`.** Para evitar que alguien pidiera archivos fuera de la carpeta del proyecto (por ejemplo `/../../secreto.txt`), la IA escribió:

```js
if (!filePath.startsWith(ROOT)) { ... 403 ... }
```

El problema es que `startsWith` compara texto, no carpetas. Si el proyecto está en `C:\Users\mende\warner-2-2`, una carpeta vecina llamada `C:\Users\mende\warner-2-2-secreto` también "empieza con" ese texto y pasaba el filtro. Lo comprobé pidiendo `/../warner-2-2-secreto/x.txt`: el servidor respondió **404** (pasó la validación y solo no encontró el archivo) en lugar de **403** (prohibido).

**Cómo se resolvió:** comparar contra la ruta más el separador de carpetas:

```js
if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) { ... 403 ... }
```

Después de la corrección, esa misma petición devuelve 403 y la app sigue cargando normal (200).

**2. Comando que no corría en mi sistema.** El README decía `PORT=3000 node server.js` para cambiar el puerto. Esa sintaxis es de Linux/macOS; en PowerShell de Windows (lo que yo uso) da error. Se agregó la versión `$env:PORT=3000; node server.js` y se probó que funciona.

## Qué aprendí y qué haría distinto

- La IA puede generar una app completa muy rápido, pero el código "que funciona" no es lo mismo que código correcto: los dos errores no aparecían usando la app normalmente, solo al pedir una revisión y probar casos raros.
- Las validaciones de seguridad hay que probarlas con casos extremos (como la carpeta vecina con el mismo nombre), no solo con el caso obvio.
- La IA asume a veces un sistema operativo distinto al mío. La próxima vez le diría desde el inicio que uso Windows y PowerShell.
- La próxima vez pediría el proyecto por partes (primero la API, luego la interfaz) y le pediría que me explique cada parte antes de seguir, para entender mejor el código y poder explicarlo en la demostración.
- Siempre pediría una revisión del código al final ("revisa si hay errores o problemas de seguridad") antes de entregar.
