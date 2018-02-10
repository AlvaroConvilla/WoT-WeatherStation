var SerialPort = require('serialport');// include the library
// get port name from the command line:
//var portName = process.argv[2];
//abro el puerto, con baudios=9600 bits/segundo
var myPort = new SerialPort("/dev/ttyUSB0", 9600);

//leer datos
var Readline=SerialPort.parsers.Readline;
var parser = new Readline();
myPort.pipe(parser);

//funciones para gestion del puerto
myPort.on('open', showPortOpen);
parser.on('data', readSerialData);
myPort.on('close', showPortClose);
myPort.on('error', showError);

function showPortOpen() {
   console.log('Puerto abierto. Baudios: ' + myPort.baudRate);
}
function readSerialData(data) {
   console.log(data);
}
function showPortClose() {
   console.log('Puerto cerrado');
}
function showError(error) {
   console.log('Error Puerto Serie: ' + error);
}

