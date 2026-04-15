const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB = "casos.json";

if (!fs.existsSync(DB)) {
  fs.writeFileSync(DB, JSON.stringify([]));
}

// 🔍 BASE DE DATOS
function leerDB() {
  try {
    return JSON.parse(fs.readFileSync(DB));
  } catch {
    return [];
  }
}

function guardarDB(data) {
  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
}

// 🧠 NORMALIZAR TEXTO
function normalizar(texto) {
  return texto.toLowerCase().replace(/[.,;:]/g, "");
}

// 🧠 ANÁLISIS NIVEL RECTORÍA
function analizarCasoTexto(caso) {

  const t = normalizar(caso);

  // 🔍 VARIABLES SEMÁNTICAS
  const agresion = ["golpe","pega","puño","patada","agrede","pelea","violencia","lesiona"];
  const respuesta = ["responde","reacciona","tambien","el otro","devuelve"];
  const reiteracion = ["reiteradamente","varias veces","constantemente"];
  const irrespeto = ["groseria","insulta","ofende","irrespeto"];
  const riesgo = ["arma","droga","amenaza"];

  let hayAgresion = agresion.some(p => t.includes(p));
  let hayRespuesta = respuesta.some(p => t.includes(p));
  let hayReiteracion = reiteracion.some(p => t.includes(p));
  let hayIrrespeto = irrespeto.some(p => t.includes(p));
  let hayRiesgo = riesgo.some(p => t.includes(p));

  // 🔴 TIPO III
  if (hayAgresion || hayRiesgo) {

    return `Clasificación: Tipo III – Situación grave

Análisis institucional:
Se identifica una conducta que compromete la integridad física y emocional de los estudiantes, configurando un escenario de violencia escolar${hayRespuesta ? ", con escalamiento del conflicto entre las partes involucradas" : ""}. Este tipo de comportamiento afecta gravemente el ambiente institucional y requiere intervención inmediata.

Ruta de atención institucional:
- Activación inmediata del Comité Escolar de Convivencia
- Citación urgente a padres de familia o acudientes
- Registro formal en el observador del estudiante
- Remisión a orientación escolar
- Valoración de remisión a entidades externas (ICBF, Comisaría de Familia)

Medidas pedagógicas y correctivas:
- Proceso de reparación del daño
- Compromiso formal de convivencia
- Seguimiento psicosocial continuo
- Aplicación de medidas contempladas en el Manual de Convivencia

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Garantía del debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
  }

  // 🟠 TIPO II
  if (hayIrrespeto || hayReiteracion) {

    return `Clasificación: Tipo II – Situación que afecta la convivencia

Análisis institucional:
Se evidencia una conducta que interfiere en el adecuado desarrollo del ambiente escolar${hayReiteracion ? ", presentando carácter reiterativo" : ""}, lo cual requiere intervención pedagógica y acompañamiento institucional.

Ruta de atención institucional:
- Registro en el sistema institucional
- Citación a acudiente
- Seguimiento por coordinación
- Remisión a orientación escolar (según el caso)

Medidas pedagógicas:
- Compromiso de convivencia
- Actividades formativas
- Estrategias de mediación escolar

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Garantía del debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
  }

  // 🟢 TIPO I
  return `Clasificación: Tipo I – Situación leve

Análisis institucional:
Se presenta una conducta ocasional que puede ser abordada mediante estrategias pedagógicas dentro del aula, sin afectar significativamente la convivencia escolar.

Ruta de atención institucional:
- Llamado de atención pedagógico
- Registro básico
- Seguimiento docente

Medidas pedagógicas:
- Reflexión guiada
- Orientación formativa

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Garantía del debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
}

// 🔴 ANALIZAR
app.post("/analizar", (req, res) => {

  const { nombre, grado, caso } = req.body;

  if (!nombre || !grado || !caso) {
    return res.json({ resultado: "Debe completar todos los campos." });
  }

  const resultado = analizarCasoTexto(caso);

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

});

// 📊 HISTORIAL
app.get("/casos", (req, res) => {
  res.json(leerDB());
});

// 🔍 BUSCAR
app.get("/buscar/:nombre", (req, res) => {

  const nombre = req.params.nombre.toLowerCase();

  const data = leerDB();

  const filtrado = data.filter(c =>
    c.nombre.toLowerCase().includes(nombre)
  );

  res.json(filtrado);

});

// TEST
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);