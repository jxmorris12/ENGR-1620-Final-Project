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
var STARTED_PATH = 1;
//
var hoverIdCount = 0;
//
var lastPointDrawn;
var lastHoverLine;
var hoverPointId;
//
$('#map')
  //
  .click(function(evt) {
    if(EDIT_MODE < 0) {
      return;
    }
    //
    var s = scaleCoordsInMap(evt);
    drawNode(s.x,s.y);
  })
  //
  .mousemove(function(evt) {
    // hovering. sick
    if(EDIT_MODE == STARTED_PATH) {
      var s = scaleCoordsInMap(evt);
      // if there is a last point, draw hover line
      if(lastPointDrawn) {
        // remove last hover line drawn
        // draw next hover line
      }
      // remove last hover point
      if(hoverPointId) {
        $('#'+hoverPointId).detach();
      }
      // draw hover point
      hoverPointId = drawNode(s.x, s.y);
    }
  });

function drawPathClicked() {
  if(EDIT_MODE == STARTED_PATH) {
    // end drawing path, save it or some shit
    // done
    $('#draw').text('Start Path');
    EDIT_MODE = NOT_DRAWING_PATH;
  } else if (EDIT_MODE == NOT_DRAWING_PATH) {
    // start drawing path

    //done
    $('#draw').text('End Path');
    EDIT_MODE = STARTED_PATH;
  }
}

function scaleCoordsInMap(evt) {
  /* Thank you, Stack Overflow */
  var svg = $('svg')[0];
  var pt = svg.createSVGPoint();
  pt.x = evt.clientX; pt.y = evt.clientY;
  return pt.matrixTransform(svg.getScreenCTM().inverse());
}


function drawNode(x, y) {
  var size = 10;
  // scale x/y so cursor is in the center of shape
  x -= size / 2;
  y -= size / 2;
  // set id
  var id = 'hover-'+hoverIdCount;
  // append x/y rect to DOM
  var r = ' <rect ';
  r += 'id = \"'+ id
    + '\" x=\"' + x
    + '\" y=\"' + y
    + '\" width=\"' + size
    + '\" height=\"' + size
    + '\"/>';
  // increment id
  hoverIdCount++;
  // hack hack hackity hack
  $('#map')[0].innerHTML += r; 
  return id;
}

function edit() {
  if(EDIT_MODE < 0) {
    /* Start Edit Mode */
    EDIT_MODE = NOT_DRAWING_PATH;
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
      .hide().slideDown(600, 'linear'); 
        /* Default duration: 400 ms */
    //
    $('.placeSelect')
      .hide().slideDown(600, 'linear');
    //
  } else {
    /* End Edit Mode */
    //
    if(EDIT_MODE == STARTED_PATH) {
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
    $('#draw')
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