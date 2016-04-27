// File created by Jack Morris on 04/18/16

/// set funcs

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
var EDIT_MODE = -1;
// constants
var NOT_DRAWING_PATH = 0;
var PATH_STARTED = 1;
//
$('#map')
.click(function(evt) {
  if(EDIT_MODE < 0) {
    return;
  }
  //
  var s = scaleCoordsInMap(evt);
  // console.log('s:',s);
  drawNode(s.x,s.y);
})
.hover(function(evt) {

});

function scaleCoordsInMap(evt) {
  /* Thank you, Stack Overflow */
  var svg = $('svg')[0];
  var pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}
function edit() {
  if(EDIT_MODE < 0) {
    /* Start Edit Mode */
    EDIT_MODE = 0;
    //
    $('path')
      .css('stroke-dasharray','5,5')
      .css('stroke-width','4')
      .css('stroke','#2196f3');
    //
    $('#edit')
      .text('View Mode');
    //
    $('#draw')
      .hide().slideDown();
    //
  } else {
    /* End Edit Mode */
    EDIT_MODE = -1;
    //
    $('path')
      .css('stroke-dasharray','')
      .css('stroke-width','1')
      .css('stroke','gray');
    //
    $('#edit')
      .text('Content Editor');
    //
    $('#draw')
      .slideUp(); /* sick animation bro */
    //
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
  var size = 10;
  // scale x/y so cursor is in the center of shape
  x -= size / 2;
  y -= size / 2;
  // append x/y rect to DOM
  var r = ' <rect ';
  r += 'x=\"' + x
    + '\" y=\"' + y
    + '\" width=\"' + size
    + '\" height=\"' + size
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
    svg.append(path.clone());
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