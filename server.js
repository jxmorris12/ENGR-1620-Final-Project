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
  res.send('GET request to the homepage');
  // grab contents of file
  var data = readFile(pathFilename, function(data) {
    // return contents
    response.writeHead(200, {'Content-Type': '.txt'});
    response.write('Data goes here');
    response.end();
  });
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
  // get request body
  var requestBody = '';
    request.on('data', function(data) {
    requestBody += data;
  });
  // append to paths.txt
  writeToEndOfFile(pathFilename,requestbody);
});

/* 
  helper functions
*/
function readFile(filename, callback) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) { 
      throw err;
    }
    console.log('OK READING FILE: ' + filename);
    console.log('read from ',filename+':',data);
    callback(data);
  });
}

function writeToEndOfFile(filename, data) {
  /* TIL: fs.writeFile overwrites file */
  fs.appendFile(filename, data, function (err) {
    if (err) { 
      return console.log(err);
    }
    console.log('Successfilly written: ',filename,' > data:', data);
  });
}