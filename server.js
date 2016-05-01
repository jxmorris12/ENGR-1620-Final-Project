// File created by Jack Morris on 04/30/16
//
//
var express = require('express'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    fs = require('fs'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// what does this do
app.use(methodOverride());      // simulate DELETE and PUT

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

var pathFilename = 'paths.txt';

/* Basic Routes */

// GET method route
app.get('/', function (req, res) {
  // grab contents of file
  var data = readFile(pathFilename, function(data) {
    // return contents
    res.writeHead(200, {'Content-Type': '.txt'});
    res.write(' '); // for some reason I need this
    res.write(data);
    res.end();
  });
});

// POST method route
app.post('/', function (req, res) {
  // get req body
  var reqBody = '';
  for(var key in req.body) {
    reqBody += '\n';
    reqBody += key;
  }
  // append to paths.txt
  writeToEndOfFile(pathFilename,reqBody);
});

/* 
  helper functions
*/
function readFile(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) { 
      throw err;
    }
    callback(data);
  });
}

function writeToEndOfFile(filename, data) {
  /* TIL: fs.writeFile overwrites file */
  console.log('writing data:',data,'to file:',filename);
  fs.appendFile(filename, data, function (err) {
    if (err) { 
      return console.log(err);
    }
  });
}