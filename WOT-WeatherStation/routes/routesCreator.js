var express = require('express'),
  router = express.Router(),
  uuid = require('node-uuid'),
  utils = require('./../utils/utils');

exports.create = function (model) {

  createDefaultData(model.links.properties.resources);
  createDefaultData(model.links.actions.resources);

  // Let's create the routes
  createRootRoute(model);
  createModelRoutes(model);
  createPropertiesRoutes(model);
  createActionsRoutes(model);

  return router;
};

//root resource route
function createRootRoute(model){
  //Manejar recurso raiz '/'
  router.route('/').get(function(req, res, next){
    //var type = 'http://model.webofthings.io/';
    req.model = model;
    req.type = 'root';

    var fields = ['id','name','description','tags','customFields'];
    //Extrae los campos requeridos del modelo, añade el objeto a result
    req.result = utils.extractFields(fields,model);

    if (model['@context']) type = model['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model';

//Crea encabezado de enlace que direcciona a recursos
    res.links({
      model: '/model/',
      properties: '/properties/',
      actions: '/actions/',
      events: '/events/',
      things: '/things/',
      ui: '/',
      type: type
    });

    next();//llama a la siguiente representacion middleware
});
};

function createModelRoutes(model) {
  // GET /model
  router.route('/model').get(function (req, res, next) {
    req.result = model;
    req.model = model;

    if (model['@context']) type = model['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model';
    res.links({
      type: type
    });

    next();
  });
};

function createPropertiesRoutes(model) {
  var properties = model.links.properties;

  // GET /properties
  router.route(properties.link).get(function (req, res, next) {
    req.model = model;
    req.type = 'properties';
    req.entityId = 'properties';

    req.result = utils.modelToResources(properties.resources, true);

    // Generate the Link headers
    if (properties['@context']) type = properties['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model/#properties-resource';

    res.links({
      temperature:'/temperature',
      humiduty:'/humidity',
      pressure:'/pressure',
      rainfall:'/rainfall',
      windSpeed:'/windSpeed',
      windDirection:'/windDirection',
      type: type
    });

    next();
  });

  // GET /properties/{id}
  router.route(properties.link + '/:id').get(function (req, res, next) {
    req.model = model;
    req.propertyModel = properties.resources[req.params.id];
    req.type = 'property';
    req.entityId = req.params.id;

    //req.result = reverseResults(properties.resources[req.params.id].data);
      req.result = properties.resources[req.entityId];
    // Generate the Link headers
    if (properties.resources[req.params.id]['@context']) type = properties.resources[req.params.id]['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model/#properties-resource';

    res.links({
      type: type
    });

    next();
  });
};

function createActionsRoutes(model) {
  var actions = model.links.actions;
  // GET /actions
  router.route(actions.link).get(function (req, res, next) {
    req.result = utils.modelToResources(actions.resources, true);
    req.model = model;
    req.type = 'actions';
    req.entityId = 'actions';

    if (actions['@context']) type = actions['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model/#actions-resource';

    res.links({
      type: type
    });

    next();
  });

  // POST /actions/{actionType}
  router.route(actions.link + '/:actionType').post(function (req, res, next) {
    var action = req.body;
    action.id = uuid.v1();
    action.status = "pending";
    action.timestamp = utils.isoTimestamp();
    utils.cappedPush(actions.resources[req.params.actionType].data, action);
    res.location(req.originalUrl + '/' + action.id);

    next();
  });


  // GET /actions/{actionType}
  router.route(actions.link + '/:actionType').get(function (req, res, next) {

    req.result = reverseResults(actions.resources[req.params.actionType].data);
    req.actionModel = actions.resources[req.params.actionType];
    req.model = model;

    req.type = 'action';
    req.entityId = req.params.actionType;

    if (actions.resources[req.params.actionType]['@context']) type = actions.resources[req.params.actionType]['@context'];
    else type = 'http://jupiter.datsi.fi.upm.es:8484/model/#actions-resource';

    res.links({
      type: type
    });


    next();
  });

  // GET /actions/{id}/{actionId}
  router.route(actions.link + '/:actionType/:actionId').get(function (req, res, next) {
    req.result = utils.findObjectInArray(actions.resources[req.params.actionType].data,
      {"id" : req.params.actionId});
    next();
  });
};

function createDefaultData(resources) {
  Object.keys(resources).forEach(function (resKey) {
    var resource = resources[resKey];
    resource.data = [];
  });
}

function reverseResults(array) {
  return array.slice(0).reverse();
}
