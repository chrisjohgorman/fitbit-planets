/*
 * Entry point for the companion app
 */
import { geolocation } from "geolocation";
import { encode } from 'cbor';
import { outbox } from "file-transfer";

console.log("Companion code started");

geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);

function locationSuccess(position) {
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );
  let GPSData = {  
    "_id": "7887d7f58ae0a6afcfd61ce206e7137c",
    "guid": "ab76cd9d-583d-496c-97a7-6f2a8360c112",
    "registered": "2023-12-01T08:41:21 GMT-05:00",
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude,
  };
  const myFileInfo = encode(GPSData);
  outbox.enqueue('companion-fb-planets.txt', myFileInfo);
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};
