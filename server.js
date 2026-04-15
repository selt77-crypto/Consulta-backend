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

function normalizar(texto) {
  return texto.toLowerCase().replace(/[.,;:]/g, "");
}

function analizarCasoTexto(caso) {

  const t = normalizar(caso);

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

  if (hayAgresion || hayRiesgo) {
    return `Clasificación: Tipo III – Situación grave

Análisis institucional:
Se identifica una conducta que compromete la integridad física y emocional de los estudiantes${hayRespuesta ? ", con escalamiento del conflicto entre las partes" : ""}.

Ruta de atención institucional:
- Activación inmediata del Comité Escolar de Convivencia
- Citación urgente a acudientes
- Registro institucional
- Remisión a orientación escolar
- Posible reporte a entidades externas

Medidas pedagógicas:
- Reparación del daño
- Compromiso de convivencia
- Seguimiento psicosocial

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
  }

  if (hayIrrespeto || hayReiteracion) {
    return `Clasificación: Tipo II – Situación que afecta la convivencia

Análisis institucional:
Conducta que interfiere en el ambiente escolar${hayReiteracion ? ", de carácter reiterativo" : ""}.

Ruta de atención:
- Registro institucional
- Citación a acudiente
- Seguimiento por coordinación

Medidas pedagógicas:
- Compromiso de convivencia
- Orientación formativa

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
  }

  return `Clasificación: Tipo I – Situación leve

Análisis institucional:
Conducta ocasional abordable pedagógicamente.

Ruta de atención:
- Llamado de atención
- Seguimiento docente

Fundamento legal:
Ley 1620 de 2013
Decreto 1965 de 2013

Debido proceso:
Artículo 29 de la Constitución Política de Colombia`;
}

app.post("/analizar", (req, res) => {

  const { nombre, grado, caso } = req.body;

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

app.get("/casos", (req, res) => res.json(leerDB()));

app.get("/buscar/:nombre", (req, res) => {
  const nombre = req.params.nombre.toLowerCase();
  const data = leerDB();
  res.json(data.filter(c => c.nombre.toLowerCase().includes(nombre)));
});

app.get("/", (req, res) => res.send("Servidor activo ✅"));

app.listen(process.env.PORT || 10000);