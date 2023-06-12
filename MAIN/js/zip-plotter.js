var map = L.map("map").setView([40.31, -84.32], 5);
var track;
var json;
var statusText = document.getElementById("statusText");
let markers = [];


$(function(){

// //create marker icons
//   var lowCostIcon = L.Icon({

//     iconURL: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
//     shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//     iconSize: [25, 41],
//     iconAnchor: [12, 41],
//     popupAnchor: [1, -34],
//     shadowSize: [41, 41]
//   });



    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        minZoom: 5,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    

      $("#adrMapCheck").change(function () {
        let isChecked = $("#adrMapCheck").prop("checked");
    
        if (isChecked) {
          fetch("assets/ADR-Map.kml")
            .then((res) => res.text())
            .then((kmltext) => {
              // Create new kml overlay
              const parser = new DOMParser();
              const kml = parser.parseFromString(kmltext, "text/xml");
              track = new L.KML(kml);
              map.addLayer(track);
            });
        } else {
          map.removeLayer(track);
        }
      });


    $("#uploadFile").click(function(){


        console.log("loading file.");

        statusText.innerHTML = "loading file.";

        //console.log(json);

        let count = 0;
        let zips = [];
        let markerCount = 0;
        let spread;
        let components = [];

        //populate table
            $("#zipTable").bootstrapTable({
              data: json,
            });
      
            $("#zipTable").bootstrapTable("load", json);
            console.log("table refreshed");
          
        
            //create marker cluster
            var markerCluster = L.markerClusterGroup();
            

        $.each(json, function(key,val) {

          //TODO: Maybe Do Checks for after-hours, mobile, and such
          
            let zipFromEntry = val["Location"].slice(0, 5);
            //console.log(zipFromEntry)
            
            if(isZip(zipFromEntry)){

                $.getJSON("assets/zips.json", function (data){

                    statusText.innerHTML = "Parsing through data."

                    $.each(data, function(key, val2){
                        currentZip = `${val2.Zipcode}`;

                        spread = Math.floor(Math.random() * 50);
                        spread = spread / 1000; //random spread value to limit marker stacking
                        
                        if(currentZip == zipFromEntry && val.Cost > 0){
                            console.log("parsing: " + currentZip + " validating: " + zipFromEntry + " at cost: " + val.Cost + " and spread: " + spread);

                            let marker;


                            //decide marker icon based on cost

                            // cost = val.Cost;

                            // if(cost < 10){
                            //   marker = L.marker([val2.Lat, val2.Long], {
                            //     title: val2.Zipcode,
                            //     icon: lowCostIcon
                            //   });
                            // }else{
                            //   marker = L.marker([val2.Lat, val2.Long], {
                            //     title: val2.Zipcode,
                            //   });
                            // }

                            marker = L.marker([val2.Lat, val2.Long], {
                              title: val2.Zipcode,
                            });

                            markerCluster.addLayer(marker);

                            map.addLayer(markerCluster);

                            marker.bindPopup('<h3>Zip: ' + zipFromEntry + ' </h3> <p>Campaign: ' + val.Campaign + '</p> <p> Cost = $' + val.Cost + '</p', {
                              //popup options
                              closeOnClick: false, 
                              autoClose: true
                            }).openPopup();

                          markerCount++;  
                        }//end create marker if
                    })

                })//end getJSON

            } //isZip
          
          // statusText.innerHTML = "Finished"
          // console.log(markerCount);

        })//end for each  
        
    });

    $("#fileImport").change(async function(e){
        console.log("changed");
        //console.log(e.target.files[0]);

        const file = e.target.files[0];

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        json = XLSX.utils.sheet_to_json(sheet);

        statusText.innerHTML = "file selected, waiting for user to confirm"

    })

    function isZip(zip){
        return /^\d+$/.test(zip);
    }
    //tests if there is a radius object from the google data
    // function isCircle(test){
      
      
    //   let parts = test.split("|");
     
    //   if(isZip(parts[0].slice(0,1))){
    //     console.log("circle found " + parts);
    //   }
    // }


    //onclick row to zoom map to selected area

    $("#zipTable").bootstrapTable({
      onClickRow: function (row, $element) {
        
        let zipFromClick = row.Location.slice(0, 5);
        if(isZip(zipFromClick)){

          $.getJSON("assets/zips.json", function (data){

            $.each(data, function(key, val2){
                currentZip = `${val2.Zipcode}`;
                
                if(currentZip === zipFromClick){
                   
                  console.log("Panning map to " + zipFromClick);
                  map.flyTo([val2.Lat, val2.Long], 15);

                }//end create marker if
            })

        })//end getJSON


        }//end if is zip
      }
    }); //end onclickRow




    //tutorial button

    $("#tutorialButton").click(function(){
      console.log("opening tutorial in new tab");
      window.open(
        'file-tutorial.html',
        '_blank'
      );

    });

})//end DOM ready