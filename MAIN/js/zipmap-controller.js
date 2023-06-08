//handles most all jQuery controls from index

//big vars

var map = L.map("map").setView([40.31, -84.32], 5);
var track;

//DOM READY

$(function () {
  //on load immediate functions
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 17,
    minZoom: 5,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  //handles ADR Map Overlay
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

  //makes overlay interactable or not (currently does nothing)
  $("#adrMapInteractable").change(function () {
    let isChecked = $("#adrMapInteractable").prop("checked");

    if (isChecked) {
    } else {
    }
  });

  //make checkboxes behave like radio buttons (why did i do this)

  $("#squareCheck").change(function(){

    let isChecked = $("#squareCheck").prop("checked");

    if(isChecked){
        $("#circleCheck").prop("checked", false);
        $("#polyCheck").prop("checked", false);
    }else{
       // $("#circleCheck").prop("checked", true);
    }
  });

  $("#circleCheck").change(function(){

    let isChecked = $("#circleCheck").prop("checked");

    if(isChecked){
        $("#squareCheck").prop("checked", false);
        $("#polyCheck").prop("checked", false);
    }else{
       // $("squareCheck").prop("checked", true);
    }
  });

  $("#polyCheck").change(function(){

    let isChecked = $("#polyCheck").prop("checked");

    if(isChecked){
        $("#circleCheck").prop("checked", false);
        $("#squareCheck").prop("checked", false);
    }
  });





  //fires on map click
  map.on("click", function (e) {
    if ($("#squareCheck").is(":checked")) {
        createSquare(e);
    }else if($("#circleCheck").is(":checked")){
        createCircle(e);
    }else if($("#polyCheck").is(":checked")){
        addPolyNode(e);
    }else{
      console.log("no option selected");
    }
  });

  $("#clearMap").click(function () {
    clearMap();
  });

  $("#getSquareZip").click(async function () {
    output = await getZipsSquare(squares);
    //console.log("final output: " + output);
  });

  $("#getCircleZip").click(async function() {
    output = await getZipsCircle(circles);
  })


  //geoJSON load/save

  $("#loadGeoJSON").click(function(){
    loadGeoJSON();
  });

  $("#updateGeoJSON").click(function(){
    updateGeoJSON();
  });
  
  $("#exportGeoJSON").click(function(){
    exportGeoJSON();
  })

//OUTPUT OPTIONS

$("#csvCheck").change(function(){

    let isChecked = $("#csvCheck").prop("checked");

    if(isChecked){
        console.log("changing to csv format");
        //change to CSV

    }else{
        console.log("changing to per-line format");
        //change to PER LINE
    }



});

});//end DOM ready
