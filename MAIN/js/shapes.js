//big vars
let squares = [];
let squareCount = 0;
let circles = [];
let circleCount = 0;

//functions to create shapes on map


//SQUARES
function createSquare(e) {
  //TODO square is not being created center of click point

  let lat = e.latlng.lat;
  let lng = e.latlng.lng;
  let x = $("#squareSize").val();
  x = x / 4;

  console.log("Creating square of size: " + x + " at point " + e.latlng);

  let bounds = [
    [lat - x, lng - x],
    [lat + x, lng - x],
    [lat + x, lng + x],
    [lat - x, lng + x],
  ];

  squares[squareCount] = L.polygon(bounds, {
    color: "red",
    draggable: true,
  }).addTo(map);

  squareCount++;
}

function clearMap() {
  clearSquares();
  clearMarkers();
  clearOutput();
  clearCircles();
}

function clearSquares() {
  for (i = 0; i < squares.length; i++) squares[i].remove();

  i = squares.length;

  while (i !== 0) {
    squares.pop();
    i--;
  }

  squareCount = 0;
}


//CIRCLES


function createCircle(e){

    radius = $("#circleSize").val() * 1000; //convert km to m for method

    console.log("Creating Square of size: " + radius + " at " + e.latlng);

    circles[circleCount] = L.circle([e.latlng.lat, e.latlng.lng], {radius: radius, draggable: true}).addTo(map);

    circleCount++;

}

function clearCircles(){

    for(i = 0; i < circles.length; i++){
        circles[i].remove();
    }
    i = circles.length;

    while(i !== 0){
        circles.pop();
        i--;
    }

    console.log(circles);
}

//POLYGON

function addPolyNode(e){

    console.log("Adding poly node at: " + e.latlng);
}






//MARKERS
function clearMarkers() {
  console.log(markers);
  for (i = 0; i < markers.length; i++) {
    markers[i].remove();
  }
  //     console.log(markers[i]);

  i = markers.length;

  while (i !== 0) {
    markers.pop();
    i--;
  }

  markerCount = 0;
}

function clearOutput() {
  $("#zipOutput").val("");
}

//geoJSON test methods

function loadGeoJSON(){

    console.log("load geoJSON");


}

function updateGeoJSON(){

    console.log("updating geoJSON"); 

}

function exportGeoJSON(){
    console.log("exporting geoJSON");
}