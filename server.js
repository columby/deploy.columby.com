'use strict';

var express= require('express');
var http = require('http');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var config = require('./config/config');

var app = express();

app.set('port', config.port);

app.use(bodyParser.json());



// Middleware
function validateSecret(req,res,next){
  var payload = req.body;
  var hmac = crypto.createHmac('sha1', config.secret);
  hmac.update(JSON.stringify(payload));
  var calculatedSignature = 'sha1=' + hmac.digest('hex');

  if (req.headers['x-hub-signature'] === calculatedSignature) {
    console.log('all good');
    next();
  } else {
    console.log('not good');
    res.status(403).json({msg: 'No access'});
  }
}

// Routes
app.post('/deploy/', validateSecret, function(req,res) {
  var body = req.body;
  var ref = body.ref;
  var repositoryId = body.repository.id;
  var repositoryName = body.repository.name;

  if (ref !== 'refs/heads/' + config.branch) {
    return res.json({status: 'error', msg: 'Webhook is not for ' + config.branch + ' ( ' + ref + ' instead)' } );
  }

  var script = '';
  switch (repositoryId) {
    // www
    case 22947645:
      script = 'www';
      break;
    // api
    case 28831188:
      script = 'api';
      break;
    // files
    case 31229948:
      script = 'files';
      break;
    // worker
    case 13467365:
      script = 'worker';
      break;
    default:
      return res.json({status: 'error', msg: repositoryId + ' (' + repositoryName + ') is not valid. '});
  }

  var spawn = require('child_process').spawn;
  var deploy = spawn('sh', ['./deploy_scripts/' + script + '.sh']);

  var response = '';
  deploy.stdout.on('data', function(data) {
    console.log(''+data);
    response += data;
  });

  deploy.on('close', function (code) {
    console.log('Child process exited with code ' + code);
    response += 'Child process exited with code ' + code;
  });

  res.status(200).json({message: 'Github Hook received!', details: response });
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
