// File created by Jack Morris on 04/18/16
//
//
//
var buildings = {};
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
//
loadBuildingObjects();
//
var pathNodeSize = 10;
//
var EDIT_MODE                  = -1;
var EDIT_MODE_NOT_STARTED_PATH = 0;
var EDIT_MODE_STARTED_PATH     = 1;
//
var pointIdCount = 0;
var lineIdCount  = 0;
//
var lastPointDrawn;
var lastHoverLine;
var lastHoverPoint;
//
var pathPoints = [];
var pathLines  = [];
//
$('#map')
  //
  .click(function(evt) {
    // wow, someone clicked
    clickPoint(evt);
  })
  //
  .mousemove(function(evt) {
    // they're hovering, sick
    hoverPoint(evt);
  })
  .mouseleave(function(evt) {
    // remove hover line and point when cursor leaves frame
    removeHoverLine();
    removeHoverPoint();
  });

function clickPoint(evt) {
  if(EDIT_MODE < 0) {
    return;
  }
  //
  var s = scaleCoordsInMap(evt);
  var thisPoint = drawNode(s.x,s.y);
  //
  if(lastPointDrawn) {
    // save the last point drawn
    pathPoints.push( lastPointDrawn );
    // remove hover line
    removeHoverLine();
    // draw ~permanent~ line
    var Lx = parseInt ( $('#'+lastPointDrawn).attr('cx') ) ;
    var Ly = parseInt ( $('#'+lastPointDrawn).attr('cy') ) ;
    //
    var thisLineId = drawLine(Lx, Ly, s.x, s.y, 'stroke:black');
    pathLines.push( thisLineId );
    //
  }
  // set new last point
  lastPointDrawn = thisPoint;
}

function hoverPoint(evt) {
  if(EDIT_MODE != EDIT_MODE_STARTED_PATH) {
    return;
  }
  var s = scaleCoordsInMap(evt);
  // if there is a last point, draw hover line
  if(lastPointDrawn) {
    // remove last hover line drawn, if it exists
    removeHoverLine();
    // calc line pos
    var Lx = parseInt ( $('#'+lastPointDrawn).attr('cx') ) ;
    var Ly = parseInt ( $('#'+lastPointDrawn).attr('cy') ) ;
    // draw next hover line and set last id
    lastHoverLine = drawLine(Lx, Ly, s.x, s.y);
  }
  // remove last hover point
  removeHoverPoint();
  // draw hover point
  lastHoverPoint = drawNode(s.x, s.y);
}

function removeHoverLine() {
  if(lastHoverLine) {
    $('#'+lastHoverLine).detach();
  }
}

function removeHoverPoint() {
  if(lastHoverPoint) {
    $('#'+lastHoverPoint).detach();
  }
}

function startPathClicked() {
  // hide draw button
  $('#draw')
    .fadeOut(600, 'linear'); /* sick animation bro */
  // unhide other ones
  $('#endPathButtons')
    .hide().fadeIn(600, 'linear'); 
  // change edit mode
  EDIT_MODE = EDIT_MODE_STARTED_PATH;
}

function savePathClicked() {
  // confirm line save & locations with modal
  // change 'lines' to svg 'path' element
  // save to file
  // fix buttons
  showNewPathButton();
}

function clearPathClicked() {
  // remove last (unsaved) point
  $('#'+lastPointDrawn).detach();
  // remove hover point
  $('#'+lastHoverPoint).detach();
  // remove hover line
  $('#'+lastHoverLine).detach();
  // reset vars
  pointIdCount = 0;
  lineIdCount = 0;
  lastPointDrawn = '';
  lastHoverPoint = '';
  lastHoverLine = '';
  // remove queued elements - nodes first
  while(pathPoints.length > 0) {
    var id = pathPoints.pop();
    $('#'+id).detach();
  }
  // now lines
  while(pathLines.length > 0) {
    var id = pathLines.pop();
    $('#'+id).detach();
  }
  // fix buttons & reset edit mode
  showNewPathButton();
}

function showNewPathButton() {
  // change edit mode so we can't draw right now
  EDIT_MODE = EDIT_MODE_NOT_STARTED_PATH;
  // hide end buttons
  $('#endPathButtons')
    .fadeOut(600, 'linear'); /* sick animation bro */
  // unhide new path
  $('#draw')
    .hide().fadeIn(600, 'linear'); 
}

function scaleCoordsInMap(evt) {
  /* Thank you, Stack Overflow */
  var svg = $('svg')[0];
  var pt = svg.createSVGPoint();
  pt.x = evt.clientX; 
  pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function drawLine(x1, y1, x2, y2, style) {
  // set new id
  var id = 'l-' + lineIdCount;
  lineIdCount++;
  // draw next hover line
  var L = ' <line id='
    + '"' + id
    + '" x1 = "' + x1
    + '" y1 = "' + y1
    + '" x2 = "' + x2
    + '" y2 = "' + y2;
  if(style) {
    L += '" style = "' + style;
  }
  L += '"/>';

  // hack hack hackity hack
  $('#map')[0].innerHTML += L; 
  // return id
  return id;
}

function drawNode(x, y) {
  // set id
  var id = 'p-'+pointIdCount;
  // append x/y rect to DOM
  var r = ' <circle ';
  r += 'id = "'+ id
    + '" cx="' + x
    + '" cy="' + y
    + '" r="' + pathNodeSize
    + '"/>';
  // increment id
  pointIdCount++;
  // hack hack hackity hack
  $('#map')[0].innerHTML += r; 
  return id;
}

function edit() {
  if(EDIT_MODE < 0) {
    /* Start Edit Mode */
    EDIT_MODE = EDIT_MODE_NOT_STARTED_PATH;
    //
    $('path')
      .css('stroke-dasharray','5,5')
      .css('stroke-width','4')
      .css('stroke','#2196f3');
    //
    $('#edit')
      .text('View Mode');
    //
    $('#pathButtons')
      .hide().slideDown(600, 'linear'); 
        /* Default duration: 400 ms */
    //
    $('.placeSelect')
      .hide().slideDown(600, 'linear');
    //
  } else {
    /* End Edit Mode */
    //
    if(EDIT_MODE == EDIT_MODE_STARTED_PATH) {
      drawPathClicked();
    }
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
    $('#pathButtons')
      .slideUp(600, 'linear'); /* sick animation bro */
    //
    $('.placeSelect')
      .slideUp(600, 'linear');
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