var markerCount = 0;
var markers = [];


function printOutput(outputString){

    if($("#zipOutput").val() === ""){
        $("#zipOutput").val(outputString);
    }else{
        $("#zipOutput").val($("#zipOutput").val() + "," + outputString);
    }
}




function exportCSVFromString(output){



}





async function getZipsSquare(squares){

    var finalOutput;


    for(i = 0; i < squares.length; i++){
        output = await getZipFromSquare(squares[i], i);
       // printOutput(await output);
    }

    console.log(await output);
        



    return finalOutput;
}//end get zips


//returns zips from 
async function getZipFromSquare(square, i){

    console.log("parsing square: " + i);

        let coords = square.getLatLngs();
        let latMin = coords[0][0].lat;
        let latMax = coords[0][1].lat;
        let lngMin = coords[0][0].lng;
        let lngMax = coords[0][3].lng;
        let currentLat;
        let currentLng;
        let zipsOutput = "";

        $.getJSON("assets/zips.json", function(data){


            $.each(data, function(key, val){

                currentLat = val.Lat;
                currentLng = val.Long;
        
                if(currentLat > latMin && currentLat < latMax && currentLng > lngMin && currentLng < lngMax){

                    if(zipsOutput === ""){
                        zipsOutput = `${val.Zipcode}` 
                    }else{
                        zipsOutput = zipsOutput + "," + `${val.Zipcode}`;
                    }
                     

                     markers[markerCount] = L.marker([val.Lat, val.Long], {
                     title: val.Zipcode,
                     }).addTo(map);

                    
                     markerCount++;

                }//end zip validation if

            });//end for each in JSON

            //console.log("output from square: " + i + " " +  zipsOutput);
            
           //printOutput("first output " + zipsOutput + " END" );
            console.log(zipsOutput);
           printOutput(zipsOutput);

            return zipsOutput;  

        })//end JSON get

        return zipsOutput;


}


