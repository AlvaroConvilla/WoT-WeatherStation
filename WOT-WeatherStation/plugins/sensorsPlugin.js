var resources = require('./../resources/model');
//var model = resources.WeatherStation.sensors;
var util = require('util'),
    utils = require('./../utils/utils.js');

var modelTemperature, modelHumidity, modelPressure, modelWindSpeed, modelWindDirection, modelRainFall;

var pluginName = 'WeatherStation sensors';

exports.start =function connectHardware(){
  var  SerialPort = require('serialport');//include the library

  //se abre el puerto serie, con baudios=9600 bits/segundo
  var myPort = new SerialPort("/dev/ttyUSB0",9600);

  //leer datos del puerto serie
  var Readline = SerialPort.parsers.Readline;
  var parser = new Readline();
  myPort.pipe(parser);

  //funciones para la gestión del puerto serie
  myPort.on('open', showPortOpen);
  parser.on('data', readSerialData);
  myPort.on('close', showPortClose);
  myPort.on('error',showError);

  var estado;
  function showPortOpen() {
   console.log('Puerto abierto. Baudios: ' + myPort.baudRate);
   estado = "Operativa";
  }

  modelTemperature = utils.findProperty('temperature');
  modelHumidity = utils.findProperty('humidity');
  modelPressure = utils.findProperty('pressure');
  modelWindSpeed = utils.findProperty('windSpeed');
  modelWindDirection = utils.findProperty('windDirection');
  modelRainFall = utils.findProperty('rainFall');
  //Prueba cuando no está la estación conectada
  modelTemperature.data = {"temperature":parseFloat(8.9), "timestamp":utils.isoTimestamp()};
  function readSerialData(data) {
    //Se filtran los datos recibidos desde el arduino mediante xbee y puerto serie del ordenador
    try{
      var parts = data.split('######');
    }catch(error){
      console.log(error);
      showPortClose();
      showError(error);
    }
    var datosFil = parts[1].split('_');
    //guardo los datos que se han filtrado
    var fecha = datosFil[0];
    var hora = datosFil[1];

    //Actualizar el modelo con los nuevos valores de los sensores.
    //Se notificará a todos los observadores
    //model.temperature.value = parseFloat(datosFil[3]);
    modelTemperature.data = {"temperature":parseFloat(datos[3]), "timestamp":utils.isoTimestamp()};
    //model.pressure.value = parseFloat(datosFil[5]);
    modelPressure.data = {"pressure":parseFloat(datos[5]), "timestamp":utils.isoTimestamp()};
    //model.humidity.value = parseFloat(datosFil[7]);
    modelHumidity.data = {"humidity":parseFloat(datos[7]), "timestamp":utils.isoTimestamp()};
    //model.windSpeed.value = parseFloat(datosFil[9]);
    modelWindSpeed.data = {"windSpeed":parseFloat(datos[9]), "timestamp":utils.isoTimestamp()};
    //model.rainfall.value = parseFloat(datosFil[11]);
     modelRainFall.data = {"rainfall":parseFloat(datos[11]), "timestamp":utils.isoTimestamp()};
    //model.windDirection.value = datosFil[13];
    modelWindDirection.data = {"windDirection":datos[13], "timestamp":utils.isoTimestamp()};
    //console.log(dirViento);
  }
  function showPortClose() {
    console.log('Puerto cerrado');
    estado = "Sin conexión";
  }

  function showError(error) {
    console.log('Error Puerto Serie: ' + error);
    estado = "Sin conexión";
  }
}
