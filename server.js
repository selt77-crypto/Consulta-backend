const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "casos.json";

// 🔒 FUNCIÓN SEGURA PARA LEER
function leerDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(DB_FILE);
    return JSON.parse(data);
  } catch (error) {
    console.log("Error leyendo DB, reiniciando...");
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
    return [];
  }
}

// 🔒 FUNCIÓN SEGURA PARA GUARDAR
function guardarDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("Error guardando DB");
  }
}

// 🔍 ANÁLISIS
function analizarCasoTexto(caso) {
  const t = caso.toLowerCase();

  if (t.includes("golpear") || t.includes("droga") || t.includes("amenaza")) {
    return {
      tipo: "Tipo III",
      sanciones: [
        "Remisión inmediata a coordinación",
        "Activación del Comité de Convivencia",
        "Citación urgente a acudiente",
        "Posible remisión a entidades externas",
      ],
    };
  }

  if (t.includes("grosería") || t.includes("irrespeto") || t.includes("tarde")) {
    return {
      tipo: "Tipo II",
      sanciones: [
        "Citación a acudiente",
        "Compromiso pedagógico",
        "Seguimiento por coordinación",
      ],
    };
  }

  return {
    tipo: "Tipo I",
    sanciones: [
      "Llamado de atención",
      "Orientación pedagógica",
    ],
  };
}

// 🔴 ANALIZAR
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    const analisis = analizarCasoTexto(caso);

    const respuesta = `
Clasificación: ${analisis.tipo}

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013.

Recomendación:
${analisis.sanciones.map(s => "- " + s).join("\n")}

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.
`;

    let data = leerDB();

    data.push({
      nombre,
      grado,
      caso,
      tipo: analisis.tipo,
      fecha: new Date().toLocaleString()
    });

    guardarDB(data);

    res.json({ resultado: respuesta });

  } catch (error) {
    console.log(error);
    res.json({ resultado: "Error controlado." });
  }
});

// HISTORIAL
app.get("/casos", (req, res) => {
  res.json(leerDB());
});

// TEST
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);