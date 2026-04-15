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

function leerDB(){
  try{return JSON.parse(fs.readFileSync(DB));}
  catch{return [];}
}

function guardarDB(data){
  fs.writeFileSync(DB, JSON.stringify(data,null,2));
}

function analizarCasoTexto(caso){

const t = caso.toLowerCase();

if(t.match(/golpe|puño|patada|agrede|pelea|violencia/)){
return "Tipo III – Situación grave";
}

if(t.match(/groser|irrespeto|tarde|indisciplina/)){
return "Tipo II – Afecta la convivencia";
}

return "Tipo I – Situación leve";
}

app.post("/analizar",(req,res)=>{

const {nombre,grado,caso} = req.body;

const tipo = analizarCasoTexto(caso);

let data = leerDB();

data.push({
nombre,
grado,
caso,
tipo,
fecha:new Date().toLocaleString()
});

guardarDB(data);

res.json({resultado:tipo});

});

// HISTORIAL
app.get("/casos",(req,res)=>res.json(leerDB()));

// BUSCAR
app.get("/buscar/:nombre",(req,res)=>{
let n=req.params.nombre.toLowerCase();
let data=leerDB();
res.json(data.filter(c=>c.nombre.toLowerCase().includes(n)));
});

// REPORTE POR CURSO
app.get("/curso/:grado",(req,res)=>{
let g=req.params.grado;
let data=leerDB();
res.json(data.filter(c=>c.grado===g));
});

app.listen(process.env.PORT||10000);