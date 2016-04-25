// File created by Jack Morris on 04/18/16

console.log('app.js loaded');

/// set funcs

$('svg').click(function(evt) {
  console.log('x:',evt.clientX,'\ty:',evt.clientY);
  evt.cancelBubble = false; // ??¿
  drawNode(evt.clientX,evt.clientY);
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
loadBuildings();
loadBuildingObjects();
//
var step = 0; 
var numOfSteps = buildingNames.length;
//
var editing = false;
//
function edit() {
  if(!editing) {
    //
    $('path')
      .css('stroke-dasharray','5,5')
      .css('stroke-width','2')
      .css('stroke','blue');
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
  var svg = $('svg');
  var rect = document.createElement('rect');
  rect = $(rect);
   // put x and y first !
  rect.attr('x',x).attr('y',y)
  .attr('width',50).attr('height',50);
  /* .attr('style',
    'fill:blue;stroke:pink;stroke-width:5;fill-opacity:0.1;stroke-opacity:0.9'); */
  svg.append(rect);
}


function loadSVGFromAddress(base, name) {
  //Create SVG Element
  var svg = $("#map"); //.attr("width", w).attr("height", h);
  var address = base + name;

  //Import the plane
  step++;
  d3.xml(address, "image/svg+xml", function(xml) { 
    var importedNode = $( document.importNode(xml.documentElement, true) );
    var path = importedNode.find("path");
    //
    // add mouseover label (later)
    //
    svg[0].appendChild(path[0].cloneNode(true));
    //
    step++;
  });
}
//

function loadBuildingObjects() {
  for(var i in buildingNames) {
    var x = {};
    x.name = buildingNames[i];
    buildings[x.name] = x;
    //
    var dropdown = $('<option value="'+x.name+'">'+x.name+'</option>');
    $('#from')        .append( dropdown.clone() );
    $('#destination') .append( dropdown.clone() );
    //
    console.log('appending',dropdown);
  }
}