var msgpack = require('msgpack5')(),
  encode = msgpack.encode, //Requerir  los dos módulos y una instancia de un codificador MessagePack
  json2html = require('node-json2html');
  jsonld = require('./../resources/resourcesLD.json');

//En express, un middleware es por lo general una función que devuelve una función
module.exports = function () {
  return function (req, res, next) {
    console.info('Representation converter middleware called!');
    if (req.result) { //comprueba si el middleware anterior dejó un resultado en req.result
      switch (req.accepts(['json', 'html', 'application/x-msgpack', 'application/ld+json'])) { //Leer la cabecera de solicitud HTTP y comprueba qué solicitó.
        case 'html':
          console.info('HTML representation selected!');
          var transform = {'tag': 'div', 'html': '${name} : ${value}'};
	  res.send(json2html.transform(req.result, transform)); //Si solicitó HTML utiliza json2html
          return;
        case 'application/x-msgpack':
          console.info('MessagePack representation selected!');
          res.type('application/x-msgpack');
          res.send(encode(req.result)); //Codificar el resultado JSON en MessagePack utilizando el codificador y devuelve el resultado al cliente.
          return;
	case 'application/ld+json':
	  console.info('JSON-LD representation selected!');
	  res.send(jsonld); //Se envía el Thing Description
	  return;
        default: //Para todos los demás formatos por defecto en json.
          console.info('Defaulting to JSON representation!');
          res.send(req.result);
          return;
      }
    }
    else {
      next(); //Si no hay ningún resultado req.result llama al siguiente middleware.
    }
  }
};
