const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "casos.json";

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

// 🔍 ANALISIS + SANCIONES
function analizarCasoTexto(caso) {
  const t = caso.toLowerCase();

  if (t.includes("golpear") || t.includes("droga") || t.includes("amenaza")) {
    return {
      tipo: "Tipo III",
      sanciones: [
        "Remisión inmediata a coordinación",
        "Activación del Comité de Convivencia",
        "Citación urgente a acudiente",
        "Posible remisión a entidades externas (ICBF / Policía de infancia)",
      ],
    };
  }

  if (t.includes("grosería") || t.includes("irrespeto") || t.includes("tarde")) {
    return {
      tipo: "Tipo II",
      sanciones: [
        "Citación a acudiente",
        "Compromiso pedagógico escrito",
        "Seguimiento por coordinación",
        "Registro en observador del estudiante",
      ],
    };
  }

  return {
    tipo: "Tipo I",
    sanciones: [
      "Llamado de atención",
      "Reflexión pedagógica",
      "Orientación formativa",
    ],
  };
}

// 🔴 ANALIZAR CASO
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    const analisis = analizarCasoTexto(caso);

    const respuesta = `
Clasificación de la situación: ${analisis.tipo}

Análisis:
Se identifica una conducta que afecta la convivencia escolar y que debe ser atendida conforme a los lineamientos institucionales.

Fundamento legal:
De acuerdo con la Ley 1620 de 2013 y el Decreto 1965 de 2013, las instituciones educativas deben garantizar la atención integral de la convivencia escolar.

Recomendación institucional:
${analisis.sanciones.map(s => "- " + s).join("\n")}

Debido proceso:
Se debe garantizar el derecho a la defensa conforme al artículo 29 de la Constitución Política de Colombia.

Enfoque pedagógico:
Las medidas deben orientarse a la formación del estudiante, promoviendo la reflexión, la reparación del daño y el mejoramiento de la convivencia.
`;

    const nuevo = {
      nombre,
      grado,
      caso,
      tipo: analisis.tipo,
      fecha: new Date().toLocaleString(),
    };

    let data = JSON.parse(fs.readFileSync(DB_FILE));
    data.push(nuevo);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

    res.json({ resultado: respuesta });

  } catch (e) {
    res.json({ resultado: "Error en el análisis." });
  }
});

// HISTORIAL
app.get("/casos", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE));
  res.json(data);
});

app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);