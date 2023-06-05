//classes

// const locationCircles = []

// class LocationCircle{

//    constructor(id, latlng){

//         this.id = id;
//         this.circle = L.circle(latlng,{

//             color:'blue',
//             fillColor: 'blue',
//             fillOpacity: .5,
//             radius: radiusKM

//         })

//         this.marker = L.marker(latlng);
//    }
// // add to map method: Shawn
//    addToMap(map) {
//        //this.circle.addTo(map);
//       // this.marker.addTo(map);
//    }

//    //getters

//    getMarker(){ return this.marker; }

//    getCircle(){ this.circle }

//    getId(){ this.id }

// }

//DOM READY
$(function () {
  //load kml

  

  let polyLine;
  let polygon;
  var count = 1;
  var map = L.map("map").setView([35.31, -84.32], 4);
  var circleCount = 0;
  let circles = [];
  var track;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //ADR map checkbox

  $("#adrMapCheck").change(function(){

    let isChecked = $("#adrMapCheck").prop("checked");

    console.log("Check box is now: " + isChecked);

    if(isChecked){
            fetch("assets/ADR-Map.kml")
        .then((res) => res.text())
        .then((kmltext) => {
        // Create new kml overlay
        const parser = new DOMParser();
        const kml = parser.parseFromString(kmltext, "text/xml");
        track = new L.KML(kml);
        map.addLayer(track);

        });
    }else{
        map.removeLayer(track);
    }

  })
  
  
  
  
  
  
  
  
  //map click
  function onMapClick(e) {
    //alert("You clicked the map at " + e.latlng);

    // addToLine(e.latlng);
    // radiusCheck = $("#radiusCheck").val();

    //check map draw mode
    if ($("#radiusCheck").is(":checked")) {
      radiusKM = $("#radiusSize").val();
      radiusKM = radiusKM * 1000; //convert m to km

      console.log(
        "drawing circle at " +
          e.latlng +
          " with radius size: " +
          radiusKM +
          "km"
      );

      // //Shawn Code
      // const newCircle = new LocationCircle(circleCount, e.latlng);

      // newCircle.getCircle.addTo(map);

      // locationCircles.push(newCircle);

      circles[circleCount] = L.circle(e.latlng, {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
        radius: radiusKM,
      }).addTo(map);

      circleCount++;

      console.log(circles.length);
      // circle.redraw();
    } else {

        //POLYGON METHODS
      console.log(e.latlng);

      if (count == 1) {
        polyLine = L.polyline([
          [e.latlng.lat, e.latlng.lng],
          [e.latlng.lat, e.latlng.lng],
        ]).addTo(map);
        count++;
      } else {
        polyLine.addLatLng([e.latlng.lat, e.latlng.lng]);
        count++;
      }
    }
  }

  $("#clearCircle").click(function () {
    for (i = 0; i < circles.length; i++) {
      circles[i].remove();
    }

    i = circles.length;

    while (i !== 0) {
      circles.pop();
      i--;
      console.log(circles);
    }

    circleCount = 0;
  });

  $("#drawPolyBtn").click(function () {
    coords = polyLine.getLatLngs();
    console.log(coords);

    polygon = L.polygon(coords, {
      //ill do this later lol
      color: "red",
    }).addTo(map);

    setOutput();
  });

  function setOutput() {
    //setup input
    let outputString;
    outputString = JSON.stringify(polygon.getLatLngs());
    console.log(JSON.parse(outputString));

    $("#coordOutput").val(outputString);
  }

  map.on("click", onMapClick);

  $("#clearButton").click(function () {
    polyLine.setLatLngs([]);
    clearLine();
    clearPoly();
    clearOutput();
  });

  function clearLine() {
    polyLine.setLatLngs([]);
  }

  function clearPoly() {
    polygon.setLatLngs([]);
  }

  function clearOutput() {
    $("#coordOutput").val("");
  }


  //get zips from circles 
  $("#getCircleZip").click(function(){
    
   console.log(circles.length);
   console.log(circles[0]);
   let output = "Radii: ";

   for(i = 0; i < circles.length; i++){
        output = output + " " + circles[i]._latlng;
   }

   $("#coordOutput").val(output);

  });




}); //end ready
