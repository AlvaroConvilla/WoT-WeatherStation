var SerialPort = require('serialport');// include the library
// get port name from the command line:
//var portName = process.argv[2];

//abro el puerto, con baudios=9600 bits/segundo
var myPort = new SerialPort("/dev/ttyUSB0", 9600);

//leer datos puerto serie
var Readline=SerialPort.parsers.Readline;
var parser = new Readline();
myPort.pipe(parser);

//funciones para gestion del puerto
myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

var estado;
function showPortOpen() {
   console.log('Puerto abierto. Baudios: ' + myPort.baudRate);
   estado = "Operativa";
}
function readSerialData(data) {
   //Se filtran los datos recibidos desde el arduino mediante xbee y puerto serie del ordenador
   var parts = data.split('######');
   var datosFil = parts[1].split('_');
   //guardo los datos que se han filtrado
   var fecha = datosFil[0];
   var hora = datosFil[1];
   var temp = datosFil[3];
   var presion = datosFil[5];
   var humedad = datosFil[7];
   var velViento = datosFil[9];
   var precipitacion = datosFil[11];
   var dirViento = datosFil[13];
   console.log(dirViento);
}
function showPortClose() {
   console.log('Puerto cerrado');
   estado = "Sin conexión";
}
function showError(error) {
   console.log('Error Puerto Serie: ' + error);
   estado = "Sin conexión";
}
