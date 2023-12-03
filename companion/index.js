/*
 * Entry point for the companion app
 */

import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { me as companion } from "companion";

messaging.peerSocket.addEventListener("error", (err) => {
  console.error(`Connection error: ${err.code} - ${err.message}`);
});

function sendMessage(data) {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // Send the data to peer as a message
    messaging.peerSocket.send(data);
  }
}

async function locationSuccess(position) {
  console.log(
    "companion Latitude: " + position.coords.latitude,
    "companion Longitude: " + position.coords.longitude
  );
  const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
  };
  console.log("data is " + data);
  await sendMessage(data);
  console.log("message sent");
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};

function getCoordinates() {
    geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
}


// Listen for the event
companion.addEventListener("readystatechange", doThis);

// The Device application caused the Companion to start
if (companion.launchReasons.peerAppLaunched) {
  doThis();
}

function doThis() {
  messaging.peerSocket.onopen = () => {
    getCoordinates();
  };
  console.log("Device application was launched!");
}

