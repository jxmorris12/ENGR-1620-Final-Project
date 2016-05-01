function getData() {
  $.ajax(
  {
    type: 'GET', 
    url: 'http://localhost:5000/',
    success: function(data) {
      // alert('success');
      console.log('got data',data);
    }, error: function (data) {
      // alert('failed');
    }
  });
}