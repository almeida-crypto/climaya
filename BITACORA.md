# Bitácora de programación con IA — ClimaYa

**Herramienta:** Claude Code (app de escritorio de Claude, modelo Claude Opus 5.5)
**Alumno:** Victor Almeida — GitHub: [almeida-crypto](https://github.com/almeida-crypto)

---

## Prompt 1

> haz lo que se te indica en el pdf, de esta carpeta, lo de git ya lo hice, tu haz lo demas, ya tengo la captura de que tengo git pro, igual esta en la carpeta

**Qué respondió la IA:** Leyó el PDF de la tarea y la captura, eligió hacer una app del clima con la API gratuita de Open-Meteo (no necesita clave, así no hay riesgo de exponerla) y generó el proyecto por etapas, con un commit por etapa: estructura HTML/CSS → cliente de la API con manejo de errores → interfaz → servidor local → README y esta bitácora. Después abrió la app en un navegador, buscó "Guadalajara", probó una ciudad inexistente y simuló un error 429, una caída de red y una respuesta vacía.

**¿Funcionó a la primera?** Casi. El código funcionó, pero al abrir `index.html` directamente (`file://`) en el navegador de pruebas la página se mostraba como una "foto" estática y el JavaScript no se ejecutaba, así que no se podía probar la búsqueda.

**Qué se corrigió:** Se agregó `server.js`, un servidor mínimo con Node sin dependencias, para servir la app en `http://localhost:5173`. Con eso todas las pruebas pasaron. También se agregó una protección para que el servidor no entregue archivos fuera de la carpeta del proyecto (ruta tipo `/../../`).

---

## Prompt 2

> <!-- TODO: copia aquí tu prompt tal cual -->

**Qué respondió la IA:**
**¿Funcionó a la primera?**
**Qué tuve que corregir o ajustar:**

---

## Prompt 3

> <!-- TODO -->

**Qué respondió la IA:**
**¿Funcionó a la primera?**
**Qué tuve que corregir o ajustar:**

---

## Prompt 4

> <!-- TODO -->

**Qué respondió la IA:**
**¿Funcionó a la primera?**
**Qué tuve que corregir o ajustar:**

---

## Prompt 5

> <!-- TODO -->

**Qué respondió la IA:**
**¿Funcionó a la primera?**
**Qué tuve que corregir o ajustar:**

---

## Error de la IA que detecté

<!-- TODO: describe un error real (código que no corría, función inexistente, solución insegura o ineficiente) y cómo lo resolviste. -->

## Qué aprendí y qué haría distinto

<!-- TODO: escríbelo con tus palabras. -->
