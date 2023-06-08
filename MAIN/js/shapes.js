//big vars
let squares = [];
let squareCount = 0;
let circles = [];
let circleCount = 0;
let polyCount = 0;
let polyLines = [];
let polyLine;
let polygons = [];

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
  clearPolyLine();
}

function clearPolyLine(){
    polyLine.setLatLngs([]);
    polyCount = 0;
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

    console.log("Creating Circle of size: " + radius + " at " + e.latlng);

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

    circleCount = 0;

    console.log(circles);
}

//POLYGON

function addPolyNode(e){
    console.log("Adding poly node at: " + e.latlng);

    if(polyCount === 0){
        polyLine = L.polyline([
            [e.latlng.lat, e.latlng.lng],
            [e.latlng.lat, e.latlng.lng]
        ]).addTo(map);
        polyCount++;
    }else{
        polyLine.addLatLng([e.latlng.lat, e.latlng.lng]);
        polyCount++;
    }

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