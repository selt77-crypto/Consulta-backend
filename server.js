const express = require("express");
const cors = require("cors");

const app = express();

// CONFIGURACIÓN
app.use(cors());
app.use(express.json());

// 🔹 RUTA PRINCIPAL (para probar)
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

// 🔹 FUNCIÓN PARA CLASIFICAR EL CASO (INTELIGENCIA BÁSICA)
function analizarCasoTexto(caso) {
  const texto = caso.toLowerCase();

  if (
    texto.includes("golpear") ||
    texto.includes("agresión física") ||
    texto.includes("arma") ||
    texto.includes("droga")
  ) {
    return {
      tipo: "Tipo III",
      analisis:
        "Se identifica una situación grave que puede comprometer la integridad física o constituir una posible conducta delictiva.",
      medidas: [
        "Remisión a entidades externas",
        "Citación urgente a acudiente",
        "Activación del Comité de Convivencia",
      ],
    };
  }

  if (
    texto.includes("insulto") ||
    texto.includes("grosería") ||
    texto.includes("irrespeto") ||
    texto.includes("reiteradamente") ||
    texto.includes("tarde")
  ) {
    return {
      tipo: "Tipo II",
      analisis:
        "Se identifica una situación que afecta la convivencia escolar de manera reiterada o significativa.",
      medidas: [
        "Citación a acudiente",
        "Compromiso pedagógico",
        "Seguimiento por coordinación",
      ],
    };
  }

  return {
    tipo: "Tipo I",
    analisis:
      "Se identifica una situación leve que puede resolverse mediante diálogo y orientación pedagógica.",
    medidas: [
      "Llamado de atención",
      "Orientación pedagógica",
      "Seguimiento básico",
    ],
  };
}

// 🔹 RUTA PRINCIPAL DE ANÁLISIS
app.post("/analizar", (req, res) => {
  try {
    const { nombre, grado, caso } = req.body;

    if (!nombre || !grado || !caso) {
      return res.json({
        resultado: "Faltan datos para analizar el caso.",
      });
    }

    const resultadoAnalisis = analizarCasoTexto(caso);

    // 🔥 RESPUESTA FINAL
    const respuesta = `
Clasificación: ${resultadoAnalisis.tipo}

Análisis:
${resultadoAnalisis.analisis}

Fundamento legal:
De acuerdo con la Ley 1620 de 2013 y el Decreto 1965 de 2013.

Debido proceso:
Se debe garantizar el derecho a la defensa conforme al artículo 29 de la Constitución Política de Colombia.

Medidas:
${resultadoAnalisis.medidas.map(m => "- " + m).join("\n")}

Observación:
Se deja constancia para efectos institucionales.
`;

    res.json({
      resultado: respuesta,
    });

  } catch (error) {
    console.log("Error:", error);

    res.json({
      resultado: "Error controlado. Intente nuevamente.",
    });
  }
});

// 🔹 PUERTO (IMPORTANTE PARA RENDER)
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto " + PORT);
});