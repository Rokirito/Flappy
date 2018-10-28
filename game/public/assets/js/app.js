//Cargar el modulo HTTP
const express = require("express");
const app = express();

//Escoger lugar donde escogera los archivos
app.use(express.static("public"));

app.listen(80, () =>{
  console.log("Servidor Iniciado");
})
