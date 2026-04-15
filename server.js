const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB = "casos.json";

// Crear DB si no existe
function ensureDB() {
  if (!fs.existsSync(DB)) {
    fs.writeFileSync(DB, JSON.stringify([]));
  }
}
ensureDB();

// Leer DB seguro
function readDB() {
  try {
    ensureDB();
    const raw = fs.readFileSync(DB, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    fs.writeFileSync(DB, JSON.stringify([]));
    return [];
  }
}

// Guardar DB seguro
function writeDB(data) {
  try {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Error guardando DB");
  }
}

// 🔍 ANÁLISIS NIVEL RECTORÍA
function analizarCasoTexto(caso) {
  const t = (caso || "").toLowerCase();

  // Tipo III
  if (
    t.includes("golpe") ||
    t.includes("agred") ||
    t.includes("pelea") ||
    t.includes("amenaza") ||
    t.includes("arma") ||
    t.includes("droga")
  ) {
    return `Clasificación: Tipo III – Situación grave

Análisis pedagógico:
Conducta que afecta gravemente la convivencia y requiere intervención inmediata.

Ruta de atención:
- Registro institucional
- Activación del Comité de Convivencia
- Citación inmediata a acudiente
- Remisión a orientación escolar
- Seguimiento continuo

Medidas pedagógicas:
- Reflexión guiada
- Compromiso de convivencia
- Reparación del daño
- Acompañamiento psicosocial

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.`;
  }

  // Tipo II
  if (
    t.includes("groser") ||
    t.includes("irrespeto") ||
    t.includes("tarde") ||
    t.includes("indisciplina")
  ) {
    return `Clasificación: Tipo II – Afecta la convivencia

Análisis pedagógico:
Conducta reiterativa que requiere intervención formativa.

Ruta de atención:
- Registro institucional
- Citación a acudiente
- Seguimiento por coordinación

Medidas pedagógicas:
- Compromiso de convivencia
- Orientación pedagógica

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.`;
  }

  // Tipo I
  return `Clasificación: Tipo I – Situación leve

Análisis pedagógico:
Conducta ocasional que puede corregirse pedagógicamente.

Ruta de atención:
- Registro básico
- Seguimiento docente

Medidas pedagógicas:
- Llamado de atención
- Orientación formativa

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.`;
}

// 🔴 ANALIZAR + GUARDAR
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    if (!nombre || !grado || !caso) {
      return res.json({ resultado: "Debe completar todos los campos." });
    }

    const resultado = analizarCasoTexto(caso);

    const data = readDB();
    data.push({
      nombre,
      grado,
      caso,
      resultado,
      fecha: new Date().toLocaleString()
    });
    writeDB(data);

    res.json({ resultado });

  } catch (e) {
    res.json({ resultado: "Error interno del servidor." });
  }
});

// 🔴 HISTORIAL GENERAL
app.get("/casos", (req, res) => {
  res.json(readDB());
});

// 🔴 BUSCAR POR ESTUDIANTE
app.get("/buscar/:nombre", (req, res) => {
  const nombre = (req.params.nombre || "").toLowerCase();
  const data = readDB();
  const filtrado = data.filter(c =>
    (c.nombre || "").toLowerCase().includes(nombre)
  );
  res.json(filtrado);
});

// TEST
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);