import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.post("/analizar", async (req, res) => {

const { caso } = req.body;

try{

const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
contents:[{
parts:[{
text:`
Eres asesor jurídico escolar en Colombia.
Responde claro y breve:

TIPOLOGÍA
ANÁLISIS
DEBIDO PROCESO
SANCIÓN
CITACIÓN

Caso:
${caso}
`
}]
}]
})
}
);

const data = await response.json();

res.json({
respuesta: data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta"
});

}catch(e){
res.json({respuesta:"Error en servidor"});
}

});

app.listen(3000, ()=>console.log("Servidor listo"));