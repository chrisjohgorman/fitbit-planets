/*
 * Entry point for the companion app
 */

import * as cbor from "cbor";
import { me as companion } from "companion";
import { outbox } from "file-transfer";
import { dataFile, wakeTime } from "../common/constants";
import { geolocation } from "geolocation";

function returnGPSCoordinates(data) {
  outbox.enqueue(dataFile, cbor.encode(data)).catch(error => {
    console.warn(`Failed to enqueue data. Error: ${error}`);
  });
}

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

function launchGeoLocation() {
   console.log("sending message");
   geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
}

if (companion.permissions.granted("access_location")) {
  // Refresh on companion launch
  launchGeoLocation();

  // Schedule a refresh every 30 minutes
  companion.wakeInterval = wakeTime;
  companion.addEventListener("wakeinterval", launchGeoLocation);

} else {
  console.error("This app requires the access_location permission.");
}
