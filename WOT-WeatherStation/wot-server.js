//Cargar el servidor HTTP y el modelo.
var httpServer = require('./servers/http'),
    wsServer = require('./servers/websockets'),
    resources = require('./resources/model');

//Plugins
var sensorsPlugin = require('./plugins/sensorsPlugin');
sensorsPlugin.start();

var port = resources.customFields.port;
//Iniciar el servidor HTTP mediante la invocación de escucha() en la aplicación express.
var server = httpServer.listen(port, function () {
  console.log('HTTP server started...');
  wsServer.listen(server);
  //Una vez que se inicia el servidor, se invoca la devolución de llamada.
  console.info('Your WoT-WeatherStation is up and running on port %s', port);
});
