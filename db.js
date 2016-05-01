// Jack Morris 05/01/17

var baseURL = 'http://localhost:5000/';

function getData() {
  // $.ajax(
  // {
  //   type: 'GET', 
  //   url: baseURL,
  //   success: function(data) {
  //     // alert('success');
  //     console.log('got data',data);
  //   }, error: function (data) {
  //     // alert('failed');
  //   }
  // });

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
  // $.post(
  // {
  //   type: 'POST', 
  //   url: baseURL,
  //   data: data,
  //   success: function(data) {
  //     alert('post success');
  //     console.log('got data',data);
  //   }, error: function (data) {
  //     alert('post failed');
  //   }
  // });

  $.post(baseURL,data,function(data, status) {
    if(status != 'success') {
      console.log('ERROR getting data from',baseURL);
    } else {
      console.log("Got data: " + data + "\nStatus: " + status);
      return data;
    }
  });
}