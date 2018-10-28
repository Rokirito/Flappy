//Cargar el modulo
var http = require("http");

//Configurar una respuesta HTTP para todas las peticiones
function onRequest(request, response){
  console.log("Peticion Recibida");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write("Hola Mundo");
  response.end();
}

var server = http.createServer(onRequest);

//Escuchar al puerto 80
server.listen(80);

//Poner un mensaje en la Consola
console.log("Servidor funcionando en http://localhost:80/");
