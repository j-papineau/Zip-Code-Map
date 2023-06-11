var map = L.map("map").setView([40.31, -84.32], 5);
var track;
var json;
var statusText = document.getElementById("statusText");
let markers = [];

class markerInfo{

  constructor(){




  }

}






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

        console.log(json);

        
      
            $("#zipTable").bootstrapTable({
              data: json,
            });
      
            $("#zipTable").bootstrapTable("load", json);
            console.log("table refreshed");
          
        
        $.each(json, function(key,val) {

          //TODO: Maybe Do Checks for after-hours, mobile, and such
          
            let zipFromEntry = val["Location"].slice(0, 5);
            //console.log(zipFromEntry)
            
            if(isZip(zipFromEntry)){

                $.getJSON("assets/zips.json", function (data){

                    statusText.innerHTML = "Parsing through data, please wait... (i get stuck sometimes)"

                    $.each(data, function(key, val2){
                        currentZip = `${val2.Zipcode}`;
                        
                        if(currentZip == zipFromEntry){
                            console.log("parsing: " + currentZip + " validating: " + zipFromEntry);

                            let marker = L.marker([val2.Lat, val2.Long], {
                                title: val2.Zipcode,
                            }).addTo(map);

                            marker.bindPopup('<h3>Zip: ' + zipFromEntry + ' </h3> <p>Campaign: ' + val.Campaign + '</p> <p> cost = ' + val.Cost + '</p', {
                              //popup options
                              closeOnClick: false, 
                              autoClose: false
                            }).openPopup();





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