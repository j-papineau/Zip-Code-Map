//classes

const locationCircles = []

class LocationCircle{

   constructor(id, latlng){

        this.id = id;
        this.circle = L.circle(latlng,{

            color:'blue',
            fillColor: 'blue',
            fillOpacity: .5,
            radius: radiusKM

        })
        
        this.marker = L.marker(e.latlng);
   }
// add to map method: Shawn
   addToMap() {
        
   }

   //getters

   getMarker(){ return this.marker; }

   getCircle(){ this.circle }

   getId(){ this.id }

}



$(function(){

    let polyLine;
    let polygon;
    var count = 1;
    var map = L.map('map').setView([35.31, -84.32], 4);
    let circle;
    let circleMarker;
    var circleCount = 0;

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    function onMapClick(e) {
        //alert("You clicked the map at " + e.latlng);
        
       // addToLine(e.latlng);
       // radiusCheck = $("#radiusCheck").val();

       
       //check map draw mode
        if($('#radiusCheck').is(':checked')){

                radiusKM = $("#radiusSize").val();
                radiusKM = radiusKM * 1000; //convert m to km

                console.log("drawing circle at " + e.latlng + " with radius size: " + radiusKM + "km");
                //add marker on click
                console.log(circleCount);
            
                circleCount = circleCount + 1;

                
                //Shawn Code
                const newCircle = new LocationCircle(circleCount, e.latlng);


                locationCircles.push(newCircle);

                newCircle.addToMap(map);



                // circle = L.circle(e.latlng,{

                //     color:'blue',
                //     fillColor: 'blue',
                //     fillOpacity: .5,
                //     radius: radiusKM

                // }).addTo(map);
                
            

            circleCount++;
           // circle.redraw();
        }

        else{
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
    }

  
    $("#clearCircle").click(function(){

        circle.remove();

    });

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

   