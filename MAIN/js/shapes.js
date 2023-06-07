//big vars
let squares = [];
let squareCount = 0;

//functions to create shapes on map

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
