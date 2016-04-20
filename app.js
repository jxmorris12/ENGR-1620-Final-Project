// File created by Jack Morris on 04/18/16

console.log('app.js loaded');

//Width and height
var w = 1500;
var h = 1500;

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


var step = 0; var numOfSteps = buildings.length;

function loadPenguins() {
  loadSVGFromAddress("https://rawgit.com/VengadoraVG/moving-to-gnulinux/master/img/tux.svg", "");
}

function loadBuildings() {
  var addressBase = "final project/vectors/";
  for(var i in buildings) {
    var buildingName = buildings[i];
    console.log('loading building', String(i)+':', buildingName);
    loadSVGFromAddress(addressBase, buildingName);
  }
}

function loadSVGFromAddress(base, name) {
  //Create SVG Element
  var svg = $("#map").attr("width", w).attr("height", h);
  var address = base + name;

  //Import the plane
  step++;
  d3.xml(address, "image/svg+xml", function(xml) { 
    var importedNode = $( document.importNode(xml.documentElement, true) );
    var path = importedNode.find("path");
    path.attr("fill", "#e0e0e0");
    //
    svg[0].appendChild(path[0].cloneNode(true));
    step++;
  });
}

function getRandomColor() {
  return "#"+((1<<24)*Math.random()|0).toString(16); // thanks Stack Overflow this is sick
}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}