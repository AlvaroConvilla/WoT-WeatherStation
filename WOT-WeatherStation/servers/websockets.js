var WebSocketServer = require('ws'),
    resources = require('./../resources/model'),
    url = require('url'),
    observe = require('object.observe');

exports.listen = function(server){
  //crear un servidor WebSockets pasando el servidor Express
  var wss = new WebSocketServer.Server({server: server});
  console.info('WebSocket server started...');

  //Se activa tras una actualización del protocolo cuando el cliente conecta
  wss.on('connection', function(ws, req){
    var location = req.url;
    //console.info(location);
    try{
      //Registra un observador correspondiente al recurso de la URL de actualización del protocolo
       ws.send(JSON.stringify(selectResource(location)));
       Object.observe(selectResource(location), function(changes){
	  ws.send(JSON.stringify(selectResource(location))//, function(){}
        );
       })
    }
    //para captar errores, como formato incorrecto/no soportado de URL
    catch(e){
      console.log(e);
      console.log('Unable to observe %s resource!',location);
    };
  });
};

//Toma una URL de solicitud y devuelve el recurso correspondiente
function selectResource(location){
  var parts = location.split('/');
  parts.shift();
  var result = resources;
  for(var i=0; i<parts.length; i++){
    result = result[parts[i]];
  }
  //console.info(result);
  return result;
}
