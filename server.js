const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB = "casos.json";

// 🔒 Crear DB si no existe
if (!fs.existsSync(DB)) {
  fs.writeFileSync(DB, JSON.stringify([]));
}

// 🔒 Leer DB
function leerDB() {
  try {
    return JSON.parse(fs.readFileSync(DB));
  } catch (e) {
    return [];
  }
}

// 🔒 Guardar DB
function guardarDB(data) {
  try {
    fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  } catch (e) {
    console.log("Error guardando DB:", e);
  }
}

// 🧠 ANÁLISIS EXPERTO
function analizarCasoTexto(caso) {

  const t = caso.toLowerCase();

  const agresion = /golpe|puño|patada|agrede|pelea|violencia|lesion|herida/;
  const autoridad = /policia|icbf|comisaria/;
  const irrespeto = /groser|insulta|irrespeto/;
  const reiteracion = /reiteradamente|varias veces|constantemente/;

  let esAgresion = agresion.test(t);
  let hayAutoridad = autoridad.test(t);
  let esIrrespeto = irrespeto.test(t);
  let esReiterado = reiteracion.test(t);

  // 🔴 TIPO III
  if (esAgresion) {
    return {
      tipo: "Tipo III – Situación grave",
      texto: `Se evidencia agresión física que compromete la integridad del estudiante${hayAutoridad ? ", con intervención de autoridad externa" : ""}. Requiere atención inmediata institucional.`
    };
  }

  // 🟠 TIPO II
  if (esIrrespeto || esReiterado) {
    return {
      tipo: "Tipo II – Afecta la convivencia",
      texto: `Conducta que afecta el ambiente escolar${esReiterado ? ", de forma reiterada" : ""}.`
    };
  }

  // 🟢 TIPO I
  return {
    tipo: "Tipo I – Situación leve",
    texto: "Conducta ocasional manejable pedagógicamente."
  };
}

// 🔴 ANALIZAR
app.post("/analizar", (req, res) => {
  try {

    const { nombre, grado, caso } = req.body;

    if (!nombre || !grado || !caso) {
      return res.json({ error: "Complete todos los campos." });
    }

    const analisis = analizarCasoTexto(caso);

    const resultado = `
ACTA DE CONVIVENCIA

Fecha: ${new Date().toLocaleDateString()}

Estudiante: ${nombre}
Grado: ${grado}

Descripción:
${caso}

Clasificación:
${analisis.tipo}

Análisis institucional:
${analisis.texto}

Ruta de atención:
- Registro institucional
- Citación a acudiente
- Seguimiento por coordinación

Medidas:
- Amonestación correspondiente
- Compromiso de convivencia

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia
`;

    let data = leerDB();

    data.push({
      nombre,
      grado,
      caso,
      resultado,
      fecha: new Date().toLocaleString()
    });

    guardarDB(data);

    res.json({ resultado });

  } catch (e) {
    res.json({ error: "Error en el servidor." });
  }
});

// HISTORIAL
app.get("/casos", (req, res) => {
  try {
    res.json(leerDB());
  } catch {
    res.json([]);
  }
});

// BUSCAR
app.get("/buscar/:nombre", (req, res) => {
  try {
    let nombre = req.params.nombre.toLowerCase();
    let data = leerDB();
    res.json(data.filter(c => c.nombre.toLowerCase().includes(nombre)));
  } catch {
    res.json([]);
  }
});

app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);