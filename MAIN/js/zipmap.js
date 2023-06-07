
//DOM READY
$(function () {

  let polyLine;
  let polygon;
  var count = 1;
  var map = L.map("map").setView([40.31, -84.32], 5);
  var circleCount = 0;
  let circles = [];
  var track;
  let squares = [];
  let squareCount = 0;

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    minZoom: 5,
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

      circles[circleCount] = L.circle(e.latlng, {
        color: "blue",
        fillColor: "blue",
        fillOpacity: 0.5,
        radius: radiusKM,
      }).addTo(map);

      circleCount++;

      console.log(circles.length);
      // circle.redraw();
    } else if($("#squareCheck").is(":checked")){


      console.log("Creating square");

      //e.latlng;

      //squares[];
      let lat = e.latlng.lat;
      let lng = e.latlng.lng;
      let x = $("#squareSize").val();

      //let bounds = [[lat + x, lng - x], [lat+x, lng+x], [lat-x,lng-x], [lat-x,lng+x]];

      let bounds = [[lat-x,lng-x],[lat+x,lng-x],[lat+x,lng+x],[lat-x,lng+x]];

      squares[squareCount] = L.polygon(bounds, {color: 'red'}).addTo(map);
      
      //L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
      

      squareCount++;



    }else{

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




  //clear circles
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
   let output = "Circles: ";

   for(i = 0; i < circles.length; i++){
        let lat = Math.round(circles[i]._latlng.lat * 100)/100;
        let long = Math.round(circles[i]._latlng.lng * 100)/100;


        output = output + " Lat:" + lat + " Long: " + long + " Radius: " + circles[i]._mRadius + ",";
   }

   $("#coordOutput").val(output);

  });


//export csv

$("#exportCSV").click(function(){

  let outputCSV = "Lat,Long,Radius(km)\n";

  for(i = 0; i < circles.length; i++){
    let lat = Math.round(circles[i]._latlng.lat * 100)/100;
    let long = Math.round(circles[i]._latlng.lng * 100)/100;

    outputCSV = outputCSV + lat + "," + long + "," + circles[i]._mRadius/1000 + "\n";
  }





  console.log(outputCSV);
  //Shahjahan Jewel Stack Overflow
  var downloadLink = document.createElement("a");
  var blob = new Blob(["\ufeff", outputCSV]);
  var url = URL.createObjectURL(blob);
  downloadLink.href = url;
  downloadLink.download = "radiusData.csv";
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);



});


//test JSON

$("#parseJSON").click(function (){
  let count = 0;
  console.log("parsing JSON");
  let startTime = Math.floor(Date.now() / 1000);

  $.getJSON("assets/zips.json", function(data){

    $.each(data, function(key, val){
      count++;
    })

  

  console.log(count + " items parsed in:");

  let endTime = Math.floor(Date.now() / 1000);
  let elapsed = endTime - startTime;

  console.log(elapsed + " seconds");



  });



});


//clear squares

$("#clearSquare").click(function(){

  console.log(squareCount);

  console.log(squares);


  for(i = 0; i < squares.length;i++){
    squares[i].remove();
  }

  i = squares.length;

  while(i !== 0){
    squares.pop();
    i--;
    
  }

  console.log(squares);
  squareCount = 0;

});





//get square zip

$("#getSquareZip").click(function(){


  for(i = 0; i < squares.length; i++){

    getZips(squares[i]); //call function on current

  }

  
  // let coords = squares[0].getLatLngs();
  // console.log(coords);

  // console.log("~~~~~~~~");


  // singleCoord = coords[0][0].lat

  
  
  // // coordsJSON = JSON.stringify(coords);
  // // coordsJSON = JSON.parse(coordsJSON);
  // // console.log(coordsJSON);


  // latMin = coords[0][0].lat;
  // latMax = coords[0][1].lat;
  // lngMin = coords[0][0].lng;
  // lngMax = coords[0][3].lng;
  // let currentLat;
  // let currentLng;
  // let zipsOutput;
  
  // let markers = [];

  // console.log(latMin + " " + latMax);
  // console.log(lngMin + " " + lngMax);

  // $.getJSON("assets/zips.json", function(data){

  //   $.each(data, function(key, val){
      
      
  //     currentLat = val.Lat;
  //     currentLng = val.Long;
      
  //       if(currentLat > latMin && currentLat < latMax && currentLng > lngMin && currentLng < lngMax){

  //         count++

  //         console.log("Matching Zip: " + val.Zipcode);

  //         zipsOutput = zipsOutput + ", " + `${val.Zipcode}`; 

  //         markers[count] = L.marker([val.Lat, val.Long], {
  //           title: val.Zipcode,
  //         }).addTo(map);

  //        markers[count].bindPopup(`${val.Zipcode}`).openPopup();
          
  //       }
  //   })

  //    $("#zipOutput").val(zipsOutput);
  // })



});

function getZips(currentSquare){

  
  let coords = squares[0].getLatLngs();
  console.log(coords);

  console.log("~~~~~~~~");


  singleCoord = coords[0][0].lat

  
  
  // coordsJSON = JSON.stringify(coords);
  // coordsJSON = JSON.parse(coordsJSON);
  // console.log(coordsJSON);


  latMin = coords[0][0].lat;
  latMax = coords[0][1].lat;
  lngMin = coords[0][0].lng;
  lngMax = coords[0][3].lng;
  let currentLat;
  let currentLng;
  let zipsOutput;
  
  let markers = [];

  console.log(latMin + " " + latMax);
  console.log(lngMin + " " + lngMax);

  $.getJSON("assets/zips.json", function(data){

    $.each(data, function(key, val){
      
      
      currentLat = val.Lat;
      currentLng = val.Long;
      
        if(currentLat > latMin && currentLat < latMax && currentLng > lngMin && currentLng < lngMax){

          count++

          console.log("Matching Zip: " + val.Zipcode);

          zipsOutput = zipsOutput + ", " + `${val.Zipcode}`; 

          markers[count] = L.marker([val.Lat, val.Long], {
            title: val.Zipcode,
          }).addTo(map);

         markers[count].bindPopup(`${val.Zipcode}`).openPopup();
          
        }
    })

     $("#zipOutput").val(zipsOutput);
  })







}




}); //end ready
