import { geolocation } from "geolocation";
import document from "document";
import * as pc from "../common/planetCoordinates.js";
import * as fs from "fs";

if(fs.existsSync("/private/data/fb-planets.txt")) {
  console.log("GPS cache file exists, using cache");
  let GPS_object  = fs.readFileSync("/private/data/fb-planets.txt", "json");
  console.log("GPS lat/long: " + GPS_object.latitude + " " +
    GPS_object.longitude);
  let cacheLatitude = GPS_object.latitude;
  let cacheLongitude = GPS_object.longitude;
  formatPlanets(cacheLatitude, cacheLongitude);
} else {
  console.log("failed to find JSON GPS cache file");
}

geolocation.getCurrentPosition(locationSuccess, locationError);

function locationSuccess(position) {
  //cache GPS data in json file
  let GPS_data = {
    "_id": "2331f964fcc9e0fd86378c16",
    "guid": "ca5a8609-a076-607d-f714-a1a54dd50fbf",
    "registered": "2021-04-05T18:38:25 GMT-04:00",
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude,
  };
  fs.writeFileSync("/private/data/fb-planets.txt", GPS_data, "json");

  //debugging
  let GPS_object = fs.readFileSync("/private/data/fb-planets.txt", "json");
  //let lat = GPS_object.latitude;
  //let long = GPS_object.longitude;
  //console.log("latitude:" + lat); 
  //console.log("longitude:" + long); 
  formatPlanets(GPS_object.latitude, GPS_object.longitude);
}

function formatPlanets(lat, long) {
  //
  const sunAltitudeText = document.getElementById("sunAltitudeText");
  const sunAzimuthText = document.getElementById("sunAzimuthText");
  const sunRightAscensionText = document.getElementById("sunRightAscnesionText");
  // debugging
  const d = new Date();
  const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
      d.getUTCSeconds()/3600;
  const sun = pc.sun(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  sunAzimuthText.text = `${sun.az.toFixed(2)}`;
  sunAltitudeText.text = `${sun.alt.toFixed(2)}`;
  sunRightAscensionText.text = `${sun.RA.toFixed(2)}`;
  console.log("sun azimuth: " + sun.az.toFixed(2));
  console.log("sun altitude: " + sun.alt.toFixed(2));
  const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("mercury azimuth: " + mercury.az.toFixed(2));
  console.log("mercury altitude: " + mercury.alt.toFixed(2));
  const venus = pc.venus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("venus azimuth: " + venus.az.toFixed(2));
  console.log("venus altitude: " + venus.alt.toFixed(2));
  const moon = pc.moon(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("moon azimuth: " + moon.az.toFixed(2));
  console.log("moon altitude: " + moon.alt.toFixed(2));
  const mars = pc.mars(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("mars azimuth: " + mars.az.toFixed(2));
  console.log("mars altitude: " + mars.alt.toFixed(2));
  const jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("jupiter azimuth: " + jupiter.az.toFixed(2));
  console.log("jupiter altitude: " + jupiter.alt.toFixed(2));
  const saturn = pc.saturn(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("saturn azimuth: " + saturn.az.toFixed(2));
  console.log("saturn altitude: " + saturn.alt.toFixed(2));
  const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("uranus azimuth: " + uranus.az.toFixed(2));
  console.log("uranus altitude: " + uranus.alt.toFixed(2));
  const neptune = pc.neptune(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("neptune azimuth: " + neptune.az.toFixed(2));
  console.log("neptune altitude: " + neptune.alt.toFixed(2));
  const pluto = pc.pluto(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("pluto azimuth: " + pluto.az.toFixed(2));
  console.log("pluto altitude: " + pluto.alt.toFixed(2));
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

