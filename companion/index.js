/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { me as companion } from "companion";

messaging.peerSocket.addEventListener("error", function (err) {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

function sendMessage(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}

function locationSuccess(position) {
  const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
  };
  sendMessage(data);
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};

// Listen for the event
companion.addEventListener("readystatechange", getCoordinates);

// The Device application caused the Companion to start
if (companion.launchReasons.peerAppLaunched) {
  getCoordinates();
}

function getCoordinates() {
  messaging.peerSocket.onopen = function () {
    geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
  };
  console.log("Device application was launched!");
}

