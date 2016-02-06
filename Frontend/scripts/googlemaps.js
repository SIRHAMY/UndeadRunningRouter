var config = require('config');

var map;
function initMap() {

  //Find curr lat, lng

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34, lng: 20},
    zoom: 8
  });
  directionsDisplay.setMap(map);

  //document.getElementById('submit').addEventListener('click', function() {
    console.log("Debug: Calculated and Display Route");
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  //});
}

function httpGetAsync(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          callback(xmlHttp.responseText);
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous
  xmlHttp.send(null);
}

//Implement http call to backend here
function calculateNewRoute(req, __callback) {
  httpGetAsync("http://localhost:8000/api/update-route", function(res) {
    console.log("Debug: Attempting to hit backend");
    console.log("Debug: res = " + res);
  });
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //Need to update this with real latitude and longitude
  var waypts = [];
  calculateNewRoute({lat: -34, lng: 20}, function(err, res) {
    //var checkboxArray = document.getElementById('waypoints');
    var start;

    //We're only worried about circuits right now, so start == end
    for (var i = 1; i < res.length; i++) {
        if(i == 0) start = res.splice(i, 1);
        else if(i != 0) {
          waypts.push({
            location: res.splice(i, 1),
            stopover: true
          });
        }
    }

    directionsService.route({
      origin: start,
      destination: start,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
        var route = response.routes[0];
        var summaryPanel = document.getElementById('directions-panel');
        summaryPanel.innerHTML = '';
        // For each route, display summary information.
        for (var i = 0; i < route.legs.length; i++) {
          var routeSegment = i + 1;
          summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment +
              '</b><br>';
          summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
          summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
          summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
        }
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  });

}

//Calls for map to be updated, shows new
function updateRoute() {

}

function drawRoute() {
  // Get the directions.
   var directions = Maps.newDirectionFinder()
       .setOrigin('Times Square, New York, NY')
       .addWaypoint('Lincoln Center, New York, NY')
       .setDestination('Central Park, New York, NY')
       .setMode(Maps.DirectionFinder.Mode.DRIVING)
       .getDirections();
   var route = directions.routes[0];

   // Set up marker styles.
   var markerSize = Maps.StaticMap.MarkerSize.MID;
   var markerColor = Maps.StaticMap.Color.GREEN
   var markerLetterCode = 'A'.charCodeAt();

   // Add markers to the map.
   var map = Maps.newStaticMap();
   for (var i = 0; i < route.legs.length; i++) {
     var leg = route.legs[i];
     if (i == 0) {
       // Add a marker for the start location of the first leg only.
       map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode));
       map.addMarker(leg.start_location.lat, leg.start_location.lng);
       markerLetterCode++;
     }
     map.setMarkerStyle(markerSize, markerColor, String.fromCharCode(markerLetterCode));
     map.addMarker(leg.end_location.lat, leg.end_location.lng);
     markerLetterCode++;
   }

   // Add a path for the entire route.
   map.addPath(route.overview_polyline.points);
 }
