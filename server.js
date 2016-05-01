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

/* Basic Routes */
// GET method route
app.get('/', function (req, res) {
  res.send('GET request to the homepage');
});

// POST method route
app.post('/', function (req, res) {
  res.send('POST request to the homepage');
});

// helper functions
function writeFile(filename, data) {
  fs = require('fs');
  fs.writeFile(filename, data, function (err) {
    if (err) return console.log(err);
    console.log('Hello World > helloworld.txt');
  });
}