//Requiere el marco Express, sus rutas, y el modelo
var express = require('express'),
//actuatorsRoutes = require('./../routes/actuators'),
routesCreator = require('./../routes/routesCreator'),//('./../routes/sensors'),
resources = require('./../resources/model'),
converter = require('./../middleware/converter'),
cors = require('cors');
bodyParser = require('body-parser');

//Crea una aplicación con el framework express; esto envuelve un servidor HTTP.
var app = express();

app.use(bodyParser.json());

//Habilitar CORS
app.use(cors());

//Se liga sus rutas a la aplicación expreso; ligarlos a /WeatherStation/sensors/...
//app.use('/pi/actuators', actuatorsRoutes);
//app.use('/WeatherStation/sensors', sensorRoutes);
app.use('/', routesCreator.create(resources));
//Crea una ruta predeterminada para /WeatherStation
//app.get('/WeatherStation', function (req, res) {
//	res.send('This is the WoT-WeatherStation!')
//});

app.use(converter());
module.exports = app;
