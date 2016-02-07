var distance = require('google-distance');
distance.apiKey = 'AIzaSyBTUTpeAhZpktVPYvYvZPMSRQIphU1BMHE';

//Constants & storage structures
var latRatio = 121.8133;   //miles per 1 lat change
var lngRatio = 72.4223;    //miles per 1 lng change
//var steps = 20

//Call this function with {new google.maps.LatLng(55.930385, -3.118425)} origin & desiredDist in km
exports.mapRequests = function (lat, lng, desiredDistance, done) {

	var numRequests = 0;
	var start = lat.toString() + ',' + lng.toString();
	var markers = [start];
	var distanceTravelled = 0;
	var delMile = desiredDistance * .06;
	var delLng = delMile / lngRatio;
	var delLat = delMile / latRatio;

	function makeOneRequest(start, dest) {
		//Make Http requests (google API)
		//These are raw latitudes & longitudes
		var from;
		var err;
		var data;
		var dist;

		var getParams = {index: 1, origin: start, destination: dest, mode: 'walking'};

		distance.get(getParams, oneReqDone);
		markers.push(dest);
	}

	function oneReqDone(err, data, distanceTravelled) {
		console.log("err in oneReqDone", err)
		numRequests += 1;
		//Check max requests
		if (numRequests > 20) {
			console.log("Hit request limit")
			return done(null, markers);
		}
		//If error and only 2 points, return done(err)
		if (markers.length == 2 && err) {
			console.log("Couldn't find single correct point")
			return done(err);
		}
		//If error and more than 2 (3), then pop from markers & call chooseNewDest
		if (markers.length > 2 && err) {
			markers.pop();
			return chooseNewDestination(markers[markers.length - 1]);
		}
		//if (err) return done(err);
		console.log("data from oneReqDone", data.distanceValue);
		//Check distance & iterations
		if (distanceTravelled > (desiredDistance / 2) || numRequests > 20) {
			//If meets criteria, call doneCallBack
			//Shouldn't I pass 
			console.log("Success");
			done(err, markers)
		} else {
			//If doesn't meet criteria, chooseNewDestination
			chooseNewDestination(markers[markers.length - 1]);
		}
	}

	function chooseNewDestination(prev) {
		//Choose new random destination
		var random = Math.floor(Math.random() * (4));
		var dArr = prev.split(",");
		var lat = Number(dArr[0]);
		var lng = Number(dArr[1]);
		var dest;
		//var from = start;
		if (random == 0) {
			dest = (lat + delLat).toString() + ',' + lng.toString();
		} else if (random == 1) {
			dest = (lat - delLat).toString() + ',' + lng.toString();
		} else if (random == 2) {
			dest = lat.toString() + ',' + (lng + delLng).toString();
		} else {
			dest = lat.toString() + ',' + (lng - delLng).toString();
		}
		//Call makeOneRequest
		makeOneRequest(start, dest);
	}

	chooseNewDestination(start);
	return markers;
}