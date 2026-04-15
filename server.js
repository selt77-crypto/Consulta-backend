const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 FUNCIÓN DE ANÁLISIS MEJORADA (CLASIFICA BIEN)
function analizarCasoTexto(caso) {

  const t = caso.toLowerCase();

  // 🔴 TIPO III (GRAVE)
  if (
    t.includes("golpe") ||
    t.includes("agred") ||
    t.includes("pelea") ||
    t.includes("amenaza") ||
    t.includes("arma") ||
    t.includes("droga")
  ) {
    return `
Clasificación: Tipo III - Situación grave

Recomendación:
- Activación inmediata del Comité de Convivencia Escolar
- Citación urgente a acudiente
- Registro en observador del estudiante
- Posible remisión a entidades externas (ICBF, Comisaría de Familia)

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013.

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.
`;
  }

  // 🟠 TIPO II (MODERADO)
  if (
    t.includes("groser") ||
    t.includes("irrespeto") ||
    t.includes("tarde") ||
    t.includes("indisciplina")
  ) {
    return `
Clasificación: Tipo II - Situación que afecta la convivencia

Recomendación:
- Citación a acudiente
- Compromiso pedagógico
- Seguimiento por coordinación

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013.

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.
`;
  }

  // 🟢 TIPO I (LEVE)
  return `
Clasificación: Tipo I - Situación leve

Recomendación:
- Llamado de atención
- Orientación pedagógica

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013.

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.
`;
}

// 🔴 RUTA PRINCIPAL
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    if (!nombre || !grado || !caso) {
      return res.json({ resultado: "Faltan datos." });
    }

    const resultado = analizarCasoTexto(caso);

    res.json({ resultado });

  } catch (error) {
    res.json({ resultado: "Error controlado en el servidor." });
  }
});

// 🔴 PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);