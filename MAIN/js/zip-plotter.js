var map = L.map("map").setView([40.31, -84.32], 5);
var track;
var json;



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

        //console.log(json);

        let count = 0;
        let zips = [];

        $.each(json, function(key,val) {

            //console.log(val["Location report"]);

            let zipFromEntry = val["Location report"].slice(0, 5);
            
            if(isZip(zipFromEntry)){
                zips[count] = zipFromEntry;
                count++;
            }


        })//end for each

        console.log(zips);

    });

    $("#fileImport").change(async function(e){
        console.log("changed");
        //console.log(e.target.files[0]);

        const file = e.target.files[0];

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        let sheet = workbook.Sheets[workbook.SheetNames[0]];
        json = XLSX.utils.sheet_to_json(sheet);

    })

    function isZip(zip){
        return /^\d+$/.test(zip);
    }




})//end DOM ready