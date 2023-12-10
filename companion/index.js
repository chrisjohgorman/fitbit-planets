/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
import { geolocation } from "geolocation";

function locationSuccess(position) {
  const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
  };
  returnGPSCoordinates(data);
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};

// #5
function launchGeoLocation() {
   console.log("sending message");
   geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
}

// Send the GPS data to the device
// #6
function returnGPSCoordinates(data) {
   if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      // Send a command to the device
      messaging.peerSocket.send(data);
   } else {
      console.log("Error: Connection is not open");
   }
}

// Listen for messages from the device
// #3 
messaging.peerSocket.onmessage = function(evt) {
   console.log("received request");
   if (evt.data && evt.data.command == "coordinates") {
      // The device requested GPS data
      launchGeoLocation();
   }
}
