// Jack Morris 05/01/17

var baseURL = 'http://localhost:5000/';

function getData() {
  $.get(baseURL, function(data, status) {
    if(status != 'success') {
      console.log('ERROR getting data from',baseURL);
    } else {
      console.log("Got data: " + data + "\nStatus: " + status);
      return data;
    }
  });
}

function postData(data) {
  $.post(baseURL,data,function(data, status) {
    if(status != 'success') {
      console.log('ERROR getting data from',baseURL);
    } else {
      console.log("Got data: " + data + "\nStatus: " + status);
      return data;
    }
  });
}