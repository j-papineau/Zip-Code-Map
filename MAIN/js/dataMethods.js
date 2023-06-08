var markerCount = 0;
var markers = [];

//PRINT -- EXPORT 
function printOutput(outputString) {
  if ($("#zipOutput").val() === "") {
    $("#zipOutput").val(outputString);
  } else {
    $("#zipOutput").val($("#zipOutput").val() + "," + outputString);
  }
}

function exportCSVFromString(output) {}





//SQUARES
async function getZipsSquare(squares) {
  var finalOutput;

  for (i = 0; i < squares.length; i++) {
    output = await getZipFromSquare(squares[i], i);
    // printOutput(await output);
  }

  console.log(await output);

  return finalOutput;
} //end get zips


async function getZipFromSquare(square, i) {
  console.log("parsing square: " + i);

  let coords = square.getLatLngs();
  let latMin = coords[0][0].lat;
  let latMax = coords[0][1].lat;
  let lngMin = coords[0][0].lng;
  let lngMax = coords[0][3].lng;
  let currentLat;
  let currentLng;
  let zipsOutput = "";

  $.getJSON("assets/zips.json", function (data) {
    $.each(data, function (key, val) {
      currentLat = val.Lat;
      currentLng = val.Long;

      if (
        currentLat > latMin &&
        currentLat < latMax &&
        currentLng > lngMin &&
        currentLng < lngMax
      ) {
        if (zipsOutput === "") {
          zipsOutput = `${val.Zipcode}`;
        } else {
          zipsOutput = zipsOutput + "," + `${val.Zipcode}`;
        }

        markers[markerCount] = L.marker([val.Lat, val.Long], {
          title: val.Zipcode,
        }).addTo(map);

        markerCount++;
      } //end zip validation if
    }); //end for each in JSON

    //console.log("output from square: " + i + " " +  zipsOutput);

    //printOutput("first output " + zipsOutput + " END" );
    console.log(zipsOutput);
    printOutput(zipsOutput);

    return zipsOutput;
  }); //end JSON get

  return zipsOutput;
}


//CIRCLES

async function getZipsCircle(circles){

    for(i = 0; i < circles.length; i++){
        output = await getZipFromCircle(circles[i], i);
    }

    return output;

}

async function getZipFromCircle(circle, i){

    let center = circle.getLatLng();
    let centerLat = center.lat;
    let centerLng = center.lng;
    var centerPair = new L.LatLng(centerLat, centerLng);
    var radius = circle.getRadius(); //returns in m NOT KM
    let currentPair;
    let zipsOutput = "";

    console.log("Parsing circle " + i);
    
    $.getJSON("assets/zips.json", function (data) {


        $.each(data, function(key, val){

            currentPair = new L.LatLng(val.Lat, val.Long);
            distance = currentPair.distanceTo(centerPair);

            
            if(distance < radius){
                //console.log("Matched Zip: " + val.Zipcode);

                if (zipsOutput === "") {
                    zipsOutput = `${val.Zipcode}`;
                  } else {
                    zipsOutput = zipsOutput + "," + `${val.Zipcode}`;
                  }


                markers[markerCount] = L.marker([val.Lat, val.Long], {
                    title: val.Zipcode,
                  }).addTo(map);

                markerCount++;
            }
        })//end for each in JSON
        printOutput(zipsOutput);
        return zipsOutput;
    })//End get JSON


}

async function getZipsPoly(polyLine){
    i = 0;
    let zipsOutput = "";

    console.log("parsing polyline");
    coords = polyLine.getLatLngs();

    polygons[i] = L.polygon(coords, {
        color: "green",
    }).addTo(map);

    clearPolyLine();

    $.getJSON("assets/zips.json", function(data){

        $.each(data, function(key, val){

            x = val.Lat; //current lat
            y = val.Long; //current long
            polygonPoints = polygons[0].getLatLngs()[0]; //get coords of polygon
            //coords = polyPoints

            var isInside = false; //set initial condition
            for(i = 0, j = polygonPoints.length - 1; i < polygonPoints.length; j = i++){

                var xi = coords[i].lat, yi = coords[i].lng;
                var xj = coords[j].lat, yj = coords[j].lng;

                //var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
                if(intersect){
                    isInside = !isInside;
                }//end flipper

            }//end ray-casting for loop

            if(isInside){
                
                if (zipsOutput === "") {
                    zipsOutput = `${val.Zipcode}`;
                  } else {
                    zipsOutput = zipsOutput + "," + `${val.Zipcode}`;
                  }
                
                
                markers[markerCount] = L.marker([val.Lat, val.Long], {
                    title: val.Zipcode,
                  }).addTo(map);

                markerCount++;
            }//end if true stmt


        })//end for each in JSON

    })//end getJSON


}