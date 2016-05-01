// Jack Morris 05/01/17

var baseURL = 'http://localhost:5000/';

function getPathData(callback) {
  $.get(baseURL, function(data, status) {
    if(status != 'success') {
      console.log('ERROR getting data from',baseURL);
    } else {
      console.log("Got data: " + data + "\nStatus: " + status);
      // got data
      callback(data);
    }
  });
}

function postPathData(data,callback) {
  $.post(baseURL,data,function(data, status) {
    if(status != 'success') {
      console.log('ERROR getting data from',baseURL);
    } else {
      // should just be 'OK'
      callback(data);
    }
  });
}