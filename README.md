# Cronograma Be Energy Plus

Visualización Gantt interactiva del cronograma de implantación de la planta
(filtros por estado y categoría, dependencias, hitos, modal de detalle y botón "Hoy").

Es un sitio **estático**: un único `index.html` que carga `data.json` automáticamente.
Se publica en Vercel desde GitHub y se comparte por enlace.

---

## Estructura

```
index.html              La aplicación (Gantt). No hay que tocarla.
data.json               Los datos del cronograma (se regenera desde el Excel).
Cronograma__HITOS_.xlsx El Excel fuente. Edita aquí las fechas y estados.
generar-datos.js        Script que convierte el Excel en data.json.
package.json            Dependencias (SheetJS).
vercel.json             Configuración de Vercel (sitio estático).
```

---

## Puesta en marcha (una sola vez)

### 1. Subir a GitHub
1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Sube todos estos ficheros al repositorio (web de GitHub: "Add file" → "Upload files", o por `git`).

### 2. Conectar con Vercel
1. Entra en https://vercel.com e inicia sesión con tu cuenta de GitHub.
2. "Add New… → Project" e importa el repositorio.
3. No configures nada de *build* (es estático). Pulsa **Deploy**.
4. Al terminar, Vercel te da una URL del tipo `https://tu-proyecto.vercel.app`.
   Esa es la que compartes con el equipo.

---

## Actualizar el cronograma

Cada vez que cambien fechas, estados o tareas:

1. Edita **`Cronograma__HITOS_.xlsx`** (hoja **"Planificación"**; las demás hojas se ignoran).
2. Regenera el `data.json`:
   ```
   npm install      (solo la primera vez)
   npm run datos
   ```
   Esto lee el Excel y reescribe `data.json` con la fecha de actualización.
3. Sube los cambios (`data.json` y el Excel) al repositorio.
   Vercel detecta el commit y **republica solo** en unos segundos.

> Si no quieres usar la línea de comandos, puedes editar el Excel, regenerar el
> `data.json` en tu equipo y subir solo ese fichero por la web de GitHub.

### Formato del Excel
Columnas de la hoja "Planificación", en este orden:

| Categoría | ID | Sección | Dependencia | Inicio | Fin | Situación | (notas…) |
|-----------|----|---------|-------------|--------|-----|-----------|----------|

- **Fechas**: formato `m/d/aa` (mes/día/año), tal como están ahora.
- **Dependencia**: uno o varios ID separados por espacios (`-` = sin dependencia).
- **Situación**: `Hecho`, `En curso`, `Solicitado`, `Pendiente` (otros valores → "Sin estado").
- Las columnas a partir de la 8ª se muestran como notas en el detalle de cada tarea.

---

## Enlazar en SharePoint
En una página de SharePoint, añade un elemento web **"Enlace"** o **"Insertar"**
apuntando a la URL de Vercel. El navegador del usuario ejecuta la aplicación con
normalidad (SharePoint ya no bloquea nada, porque el sitio se sirve desde Vercel).

---

## Notas
- El plan **Hobby** de Vercel es gratuito y el sitio es **público**: cualquiera con la
  URL puede verlo. Adecuado para datos no sensibles compartidos con personas de confianza.
- El botón "⬆ Cargar .xlsx" de la aplicación permite previsualizar un Excel en local
  sin publicar nada (útil para revisar cambios antes de subirlos).
