var map = L.map("map").setView([40.31, -84.32], 5);
var track;
var json;
var statusText = document.getElementById("statusText");



$(function(){

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

        $.each(json, function(key,val) {


            let zipFromEntry = val["Location"].slice(0, 5);
            //console.log(zipFromEntry)
            
            if(isZip(zipFromEntry)){

                $.getJSON("assets/zips.json", function (data){

                    statusText.innerHTML = "Parsing through data, please wait..."

                    $.each(data, function(key, val){
                        currentZip = `${val.Zipcode}`;
                        
                        if(currentZip === zipFromEntry){
                            console.log("parsing: " + currentZip + " validating: " + zipFromEntry);

                            L.marker([val.Lat, val.Long], {
                                title: val.Zipcode,
                            }).addTo(map);

                          markerCount++;  
                        }//end create marker if
                    })

                })//end getJSON

            }//isZip


        })//end for each

        statusText.innerHTML = "Finished"
        console.log(markerCount);

        

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


    function plotZips(zips){




    }




})//end DOM ready