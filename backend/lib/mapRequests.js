// var gMap = require("googlemaps");
// var GoogleMapsAPI = require('../node_modules/googlemaps/lib/index');
// var distance = require('../node_modules/googlemaps/lib/distance');

//Constants & storage structures
var scale = 1333 / 23.35   //1333km = 23.35 lat/long manhattan distance
//var steps = 20

//Call this function with {new google.maps.LatLng(55.930385, -3.118425)} origin & desiredDist in km
function search(origin, desiredDistance) {
	var markers = [origin];
	var distanceTravelled = 0;
	var delta = desiredDistance / scale;
	var directions = [delta, -delta];
	while (distanceTravelled < (desiredDistance / 2)) {
		var random = Math.floor(Math.random() * (4));
		var service = new google.maps.DistanceMatrixService();
		var destination;
		if (random== 0) {
			destination = new google.maps.LatLng({lat: origin.lat() + delta, lng: origin.lng()});
		} else if (random == 1) {
			destination = new google.maps.LatLng({lat: origin.lat() - delta, lng: origin.lng()});
		} else if (random == 2) {
			destination = new google.maps.LatLng({lat: origin.lat(), lng: origin.lng() + delta});
		} else {
			destination = new google.maps.LatLng({lat: origin.lat(), lng: origin.lng() - delta});
		}
		service.getDistanceMatrix({
		    origins: origin,
		    destinations: destination,
		    travelMode: google.maps.TravelMode.WALKING,
		    avoidHighways: true,
		}, function callback(response, status) {
				if (status == google.maps.DistanceMatrixStatus.OK) {
			    	var origins = response.originAddresses;
			    	var destinations = response.destinationAddresses;
			    	for (var i = 0; i < origins.length; i++) {
			      		var results = response.rows[i].elements;
			      		for (var j = 0; j < results.length; j++) {
					        var element = results[j];
					        var distance = element.distance.text;
					        var from = origins[i];
					        var to = destinations[j];
					    }
					}
				}
			}
		);
		distanceTravelled += distance;
		origin = to;
		markers.push(origin);
	}
	return markers;
}




module.exports = {
	search: search,
}