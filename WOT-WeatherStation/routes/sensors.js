//requerir una instancia de un enrutador Express para definir la ruta de acceso a nuestros recursos.
var express = require('express'),
    router = express.Router(),
    resources = require('./../resources/model');

//Crear una nueva ruta para una petición GET de todos los sensores y adjuntar una función de devolución de llamada.
router.route('/').get(function(req, res, next){
	req.result = resources.WeatherStation;
	next();
});

router.route('/sensors').get(function (req, res, next) {
	//Responder con el modelo de sensor cuando esta ruta se selecciona.
	//res.send(resources.WeatherStation.sensors);
	req.result = resources.WeatherStation.sensors;
	next();
});

//Estas rutas sirven los sensores de temperatura y humedad.
router.route('/sensors/temperature').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.temperature);
	req.result = resources.WeatherStation.sensors.temperature;
	next();
});

router.route('/humidity').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.humidity);
	req.result = resources.WeatherStation.sensors.humidity;
	next();
});

router.route('/pressure').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.pressure);
	req.result = resources.WeatherStation.sensors.pressure;
	next();
});

router.route('/rainfall').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.rainfall);
	req.result = resources.WeatherStation.sensors.rainfall;
	next();
});

router.route('/windSpeed').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.windSpeed);
	req.result = resources.WeatherStation.sensors.windSpeed;
	next();
});

router.route('/windDirection').get(function (req, res, next) {
	//res.send(resources.WeatherStation.sensors.windDirection);
	req.result = resources.WeatherStation.sensors.windDirection;
	next();
});


//exportar para que sea accesible “requiere” de este archivo.
module.exports = router;
