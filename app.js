// File created by Jack Morris on 04/18/16

console.log('app.js loaded');

/// set funcs

$('#map').click(function(evt) {
  var offset = $('#map').offset();
  var x = evt.clientX - offset.left; 
  var y = evt.clientY - offset.top;
  //
  var viewboxMax = 1200;
  var xMax = $('#map').width();
  var yMax = $('#map').height();
  //
  var sx = x / xMax * viewboxMax;
  var sy = y / yMax * viewboxMax;
  //
  console.log('x:',sx,'\ty:',sy);
  drawNode(sx,sy);
});

var buildingNames = 
  [
  "Bavaro",
  "Chem",
  "Dell 1",
  "Dell 2",
  "Mech",
  "Olsson",
  "Physical & Life Sciences",
  "Physics",
  "Rice",
  "Ruffner",
  "Small",
  "Thornton",
  "Wilsdorf"
  ];
var buildings = {};
//
loadBuildingObjects();
//
var editing = false;
//
function edit() {
  if(!editing) {
    //
    $('path')
      .css('stroke-dasharray','5,5')
      .css('stroke-width','4')
      .css('stroke','#2196f3');
    //
    $('#edit')
      .text('View Mode');
    //
    editing = true;
  } else {
    //
    $('path')
      .css('stroke-dasharray','')
      .css('stroke-width','1')
      .css('stroke','gray');
    //
    $('#edit')
      .text('Content Editor');
    //
    editing = false;
  }
}

function loadBuildings() {
  var addressBase = "SEAS_map/vectors/";
  for(var i in buildingNames) {
    var buildingName = buildingNames[i];
    loadSVGFromAddress(addressBase, buildingName);
  }
}

function drawNode(x, y) {
  var rectSize = 50;
  // scale x/y so cursor is in the center of shape
  x -= rectSize / 2;
  y -= rectSize / 2;
  // append x/y rect to DOM
  var r = ' <rect ';
  r += 'x=\"' + x
    + '\" y=\"' + y
    + '\" width=\"' + rectSize
    + '\" height=\"' + rectSize
    + '\"/>';
  // hack hack hackity hack
  $('#map')[0].innerHTML += r; 
}


function loadSVGFromAddress(base, name) {
  //Create SVG Element
  var svg = $("#map"); //.attr("width", w).attr("height", h);
  var address = base + name;

  //Import the plane
  d3.xml(address, "image/svg+xml", function(xml) { 
    var importedNode = $( document.importNode(xml.documentElement, true) );
    var path = importedNode.find("path");
    //
    // add mouseover label (later)
    //
    svg.append(path[0].cloneNode(true));
    //
  });
}
//

function loadBuildingObjects() {
  // create objects
  for(var i in buildingNames) {
    var x = {};
    x.name = buildingNames[i];
    buildings[x.name] = x;
    //
    var dropdown = $('<option value="'+x.name+'">'+x.name+'</option>');
    $('#fromoptgroup').append( dropdown.clone() );
    $('#destoptgroup').append( dropdown.clone() );
    //
  }
// objects created
loadBuildings();
}