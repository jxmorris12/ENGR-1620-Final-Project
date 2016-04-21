// File created by Jack Morris on 04/18/16

console.log('app.js loaded');

/// set funcs

$('svg').click(function(evt) {
  console.log('x:',evt.clientX,'\ty:',evt.clientY);
});

// var address = "https://rawgit.com/VengadoraVG/moving-to-gnulinux/master/img/tux.svg"
var buildings = 
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
loadBuildings();
//
var step = 0; 
var numOfSteps = buildings.length;
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

function loadPenguins() {
  loadSVGFromAddress("https://rawgit.com/VengadoraVG/moving-to-gnulinux/master/img/tux.svg", "");
}

function loadBuildings() {
  var addressBase = "final project/vectors/";
  for(var i in buildings) {
    var buildingName = buildings[i];
    loadSVGFromAddress(addressBase, buildingName);
  }
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