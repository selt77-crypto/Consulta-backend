import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Ruta principal (para probar si está vivo)
app.get("/", (req, res) => {
  res.send("Servidor activo ✅");
});

// 🔹 Ruta ANALIZAR (LA IMPORTANTE)
app.post("/analizar", async (req, res) => {
  try {
    const { nombre, caso } = req.body;

    // 🔥 RESPUESTA SEGURA (SIEMPRE FUNCIONA)
    const respuestaBase = `
ACTA DE CONVIVENCIA

Institución Educativa Técnico Empresarial Manuel Quintero Penilla

Estudiante: ${nombre}

Descripción del caso:
${caso}

Análisis:
De acuerdo con la Ley 1620 de 2013, se identifica una situación Tipo II, relacionada con el incumplimiento de normas institucionales y afectación a la convivencia escolar.

Debido Proceso:
Se debe garantizar el derecho a la defensa conforme al artículo 29 de la Constitución Política de Colombia.

Medidas pedagógicas:
- Llamado de atención
- Citación a acudiente
- Compromiso pedagógico
- Seguimiento por coordinación

Observación:
Se deja constancia para efectos institucionales.
`;

    // 🔥 RESPUESTA INMEDIATA (SIN ESPERAR IA)
    res.json({
      resultado: respuestaBase
    });

  } catch (error) {
    console.log(error);

    res.json({
      resultado: "Error controlado. Intente nuevamente."
    });
  }
});

// 🔹 Puerto de Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});