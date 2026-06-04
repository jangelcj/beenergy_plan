#!/usr/bin/env node
/**
 * Be Energy Plus · Generador de data.json para el cronograma
 * --------------------------------------------------------------
 * Lee la hoja "Planificación" del Excel y genera public/data.json,
 * que la web carga automáticamente.
 *
 * Uso:
 *   node generar-datos.js [ruta-al-excel]
 * Por defecto busca:  Cronograma__HITOS_.xlsx  en la carpeta actual.
 *
 * Requiere SheetJS:   npm install
 */
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const SRC = process.argv[2] || "Cronograma__HITOS_.xlsx";
const SHEET = "Planificación";          // primera hoja; el resto se ignora
const OUT = "data.json";

// mm/dd/yy o mm/dd/yyyy  ->  yyyy-mm-dd  (ISO, sin ambigüedad para el navegador)
function toISO(v) {
  v = ("" + (v || "")).trim();
  if (!v) return "";
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (!m) return v; // si ya viniera en otro formato, se deja tal cual
  let [, mm, dd, yy] = m;
  let year = +yy;
  if (year < 100) year += 2000;         // 25 -> 2025
  const mo = String(+mm).padStart(2, "0");
  const da = String(+dd).padStart(2, "0");
  return `${year}-${mo}-${da}`;
}

function main() {
  if (!fs.existsSync(SRC)) {
    console.error("No se encuentra el Excel:", SRC);
    process.exit(1);
  }
  const wb = XLSX.readFile(SRC);
  if (!wb.Sheets[SHEET]) {
    console.error(`La hoja "${SHEET}" no existe. Hojas disponibles:`, wb.SheetNames.join(", "));
    process.exit(1);
  }
  const ws = wb.Sheets[SHEET];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, defval: "" });

  // localizar cabecera (fila con "Categoría")
  let h = rows.findIndex(r => (r || []).map(x => ("" + x).toLowerCase()).join("|").includes("categor"));
  if (h < 0) h = 0;

  const out = [];
  out.push(rows[h].map(x => ("" + x).trim())); // cabecera
  for (const r of rows.slice(h + 1)) {
    const id = ("" + (r[1] || "")).trim();
    const sec = ("" + (r[2] || "")).trim();
    if (!id || !sec) continue;               // ignora filas vacías
    const row = r.map(c => ("" + (c || "")).replace(/\r/g, " ").trim());
    row[4] = toISO(r[4]);                     // Inicio -> ISO
    row[5] = toISO(r[5]);                     // Fin -> ISO
    out.push(row);
  }

  const payload = { generated: new Date().toISOString(), rows: out };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 0), "utf8");
  console.log(`OK -> ${OUT}  (${out.length - 1} tareas, generado ${payload.generated})`);
}

main();
