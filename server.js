const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔍 ANÁLISIS SIMPLE Y ESTABLE
function analizarCasoTexto(caso) {
  const t = caso.toLowerCase();

  if (t.includes("golpear") || t.includes("amenaza")) {
    return "Tipo III - Situación grave. Requiere intervención inmediata y posible activación de entidades externas.";
  }

  if (t.includes("grosería") || t.includes("tarde") || t.includes("irrespeto")) {
    return "Tipo II - Situación que afecta la convivencia. Se recomienda citación a acudiente y seguimiento.";
  }

  return "Tipo I - Situación leve. Se recomienda orientación pedagógica.";
}

// 🔴 RUTA PRINCIPAL
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    if (!nombre || !grado || !caso) {
      return res.json({ resultado: "Faltan datos." });
    }

    const resultado = analizarCasoTexto(caso);

    res.json({
      resultado: `
Clasificación: ${resultado}

Fundamento legal:
Ley 1620 de 2013 y Decreto 1965 de 2013.

Debido proceso:
Artículo 29 de la Constitución Política de Colombia.
`
    });

  } catch (error) {
    res.json({ resultado: "Error controlado." });
  }
});

// 🔴 PRUEBA
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

app.listen(process.env.PORT || 10000);