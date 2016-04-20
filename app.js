// File created by Jack Morris on 04/18/16

console.log('app.js loaded');

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
// loadPenguins();



var step = 0; 
var numOfSteps = buildings.length;

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
    // add mouseover label (later!)
    //
    step++;
  });
}