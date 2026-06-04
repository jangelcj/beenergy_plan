# Cronograma Be Energy Plus

Visualización Gantt interactiva del cronograma de implantación de la planta
(filtros por estado y categoría, dependencias, hitos, modal de detalle y botón "Hoy").

Es un sitio **estático**: un único `index.html` que carga `data.json` automáticamente.
El `data.json` lo **genera Vercel en cada despliegue** a partir del Excel, así que
para actualizar el cronograma solo tienes que subir el Excel a GitHub.

---

## Estructura

```
index.html              La aplicación (Gantt). No hay que tocarla.
Cronograma__HITOS_.xlsx El Excel fuente. Es lo único que editas y subes.
generar-datos.js        Convierte el Excel en data.json (lo ejecuta Vercel).
package.json            Dependencias (SheetJS) y comando de build.
vercel.json             Configuración de Vercel (build + estático).
data.json               Se genera automáticamente; no está en el repositorio.
```

---

## Puesta en marcha (una sola vez)

### 1. Subir a GitHub
1. Crea un repositorio nuevo en GitHub (puede ser privado).
2. Sube estos ficheros (web de GitHub: "Add file" → "Upload files", o por `git`).
   No hace falta subir `data.json`: lo crea Vercel.

### 2. Conectar con Vercel
1. Entra en https://vercel.com e inicia sesión con tu cuenta de GitHub.
2. "Add New… → Project" e importa el repositorio.
3. Vercel detecta el `vercel.json`. No cambies nada y pulsa **Deploy**.
   (En el despliegue, Vercel instala dependencias y ejecuta `generar-datos.js`,
   que produce el `data.json` a partir del Excel.)
4. Al terminar, te da una URL `https://tu-proyecto.vercel.app`.
   Esa es la que compartes con el equipo.

---

## Actualizar el cronograma (el día a día)

Solo un paso, todo desde el navegador:

1. Edita el Excel **`Cronograma__HITOS_.xlsx`** en tu equipo
   (hoja **"Planificación"**; las demás hojas se ignoran).
2. Súbelo a GitHub sobrescribiendo el anterior:
   en el repositorio, "Add file" → "Upload files", arrastra el Excel y confirma.

Vercel detecta el cambio, regenera el `data.json` y **republica solo** en unos
segundos. Recarga la página y verás los datos nuevos (el pie muestra la fecha y
hora de la última actualización).

> No necesitas instalar nada ni usar la terminal para el uso normal.

### Probar en local (opcional)
Si quieres previsualizar antes de subir:
```
npm install      (solo la primera vez)
npm run datos    genera data.json desde el Excel
```
y abre `index.html` con un pequeño servidor local
(por ejemplo `npx serve .`), no con doble clic, para que el navegador
pueda leer el `data.json`.

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
