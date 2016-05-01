// File created by Jack Morris on 04/18/16
//
//
//
// getData();
var buildings = {};
var buildingNames = 
  [
  "Bavaro",
  "Chem",
  "Dell 1",
  "Dell 2",
  "Mech",
  "Olsson",
  "Physical and Life Sciences",
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
var buildingLoadedCount = 0;
//
var lastPointDrawn;
var lastHoverLine;
var lastHoverPoint;
//
var pathData;
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


function setBuildingHover() {
  console.log('setting building hover');
  $('.building').attr('onmouseover','buildingHover(evt)');
  $('.building').attr('onmouseleave','buildingHoverOut(evt)');
}
function buildingHover(evt) {
  // get name
  var name = evt.target.id;
  // show ones with me as loc
  $( "path[loc='"+name+"']" ).css('visibility','visible');
  // show ones with me as to
  $( "path[to='"+name+"']" ).css('visibility','visible');
}

function buildingHoverOut(evt) {
  // get name
  var name = evt.target.id;
  // hide ones with me as loc
  $( "path[loc='"+name+"']" ).css('visibility','hidden');
  // hide ones with me as to
  $( "path[to='"+name+"']" ).css('visibility','hidden');
}

function clickPoint(evt) {
  if(EDIT_MODE <= 0) {
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
  if(EDIT_MODE <= 0) {
    return;
  }
  // debugger;
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
  //
  var loc = $('#from').find(':selected').val();
  var to = $('#to').find(':selected').val();
  /* @TODO: Something nicer than alerts */
  if(!loc && !to) { 
    alert('Please choose a location and a destination.');
    return;
  } else if(!loc) { 
    alert('Please choose a location.');
    return;
  } else if(!to) { 
    alert('Please choose a destination.');
    return;
  }
  // confirm line save & locations with modal
  displaySaveModal(function(saveClicked) {
    // hide modal
    $('#saveModal')
      .fadeOut(600, 'linear');
    // evaluate
    if(saveClicked) {
      savePath();
    } else {
      // do nothing - just stay in path draw mode
    }
  });
}

/* 
  @TODO: Delete paths & persist deletion to file 
*/

function savePath() {
  /* @TODO: MUCH nicer way to create elements.... we are
    using JQuery for a reason, after all! 
  */
  // change 'lines' to svg 'path' element
    // save the last point drawn
  pathPoints.push( lastPointDrawn );
    // get first point
  var P = '<path class="drawnPath" d="';
  var x = parseInt ( $('#'+pathPoints[0]).attr('cx') ) ;
  var y = parseInt ( $('#'+pathPoints[0]).attr('cy') ) ;
  P += 'M' + x + ' ' + y;
  // add lines to all subsequent points
  for(var i = 1; i < pathPoints.length; i++) {
    var point = pathPoints[i];
    x = parseInt ( $('#'+point).attr('cx') ) ;
    y = parseInt ( $('#'+point).attr('cy') ) ;
    P += ' L ' + x + ' ' + y;
  }
  var loc = $('#from').find(':selected').val();
  P += '" loc="' + loc;
  var to = $('#to').find(':selected').val();
  P += '" to="'  + to;
  P += '" />';
  // draw path on svg
  var m = $('#map')[0].innerHTML;
  $('#map')[0].innerHTML = P + m; 
  // save new path to file...
  var el = $('#map').children().first(); //grab element
  postPathData(el[0].outerHTML); //string version
  // clear all old stuff
  clearPathClicked(); // weird, but works!
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
  $('#map')[0].innerHTML = $('#map')[0].innerHTML + L; 
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
  $('#map')[0].innerHTML = $('#map')[0].innerHTML + r; 
  return id;
}

function edit() {
  if(EDIT_MODE < 0) {
    /* Start Edit Mode */
    EDIT_MODE = EDIT_MODE_NOT_STARTED_PATH;
    //
    $('.building')
      .css('stroke-dasharray','5,5')
      .css('stroke','#333');
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
      clearPathClicked();
    }
    EDIT_MODE = -1;
    //
    $('.building')
      .css('stroke-dasharray','')
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

function displaySaveModal(callback) {
  $('#saveModal')
    .hide().fadeIn(600, 'linear');
  // wait for button events
  //
  $('#saveBack')
    .click(function(evt) {
      // saved = false
      callback(false);
    });
  //

  $('#saveSave')
    .click(function(evt) {
      // saved = true
      callback(true);
    });
  //
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
    path.addClass('building');
    //
    // add mouseover label (later)
    //
    svg.append(path.clone());
    //
    buildingLoadedCount++;
    if(buildingLoadedCount == buildingNames.length) {
      // add building class to all buildings
      svg.find('path').attr('class','building');
      // set hover func for buildings
      setBuildingHover();
      // load all paths
      loadPathObjects();
    }
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

function loadPathObjects() {
  // query node server 
  getPathData(function(data) {
    pathData = data;
    pathData = pathData.split('\n');
    for(var i in pathData) {
      var path = $( pathData[i].trim() );
      // debugger;
      $('#map').prepend( path ); 
    }
    // refresh for some reason
    var n = drawNode(-pathNodeSize,-pathNodeSize);
    $(n).detach();
  });
}