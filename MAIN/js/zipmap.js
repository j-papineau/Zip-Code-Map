$(function(){

    let polyLine;
    let polygon;
    var latlngs = [];
    var count = 1;
    var map = L.map('map').setView([35.31, -84.32], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    function onMapClick(e) {
        //alert("You clicked the map at " + e.latlng);
        
       // addToLine(e.latlng);
        console.log(e.latlng);

        if(count == 1){
            polyLine = L.polyline(
                [
                    [e.latlng.lat, e.latlng.lng],
                    [e.latlng.lat, e.latlng.lng]
                ]
            ).addTo(map);
            count++;
        }else{
            
            polyLine.addLatLng([e.latlng.lat, e.latlng.lng]);
            count++;
        }

        
    }

   

    $("#drawPolyBtn").click(function(){

        coords = polyLine.getLatLngs();
        console.log(coords);

        polygon = L.polygon(coords, {
            //ill do this later lol 
            color: 'red'

        }).addTo(map);

        setOutput();

    })

    function setOutput(){
        //setup input
        let outputString;
        outputString = JSON.stringify(polygon.getLatLngs());
        console.log(JSON.parse(outputString));

        $("#coordOutput").val(outputString);
    }
    
    map.on('click', onMapClick);

    $("#clearButton").click(function(){ 
        polyLine.setLatLngs([]);
        clearLine();
        clearPoly();
        clearOutput();
    });

    function clearLine(){ polyLine.setLatLngs([]); }
    
    function clearPoly(){ polygon.setLatLngs([]); }

    function clearOutput(){ $("#coordOutput").val(""); }
    

    })//end ready