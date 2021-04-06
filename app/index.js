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
  const sunAzimuth = document.getElementById("sunAzimuth");
  const sunAltitude = document.getElementById("sunAltitude");
  const mercuryAzimuth = document.getElementById("mercuryAzimuth");
  const mercuryAltitude = document.getElementById("mercuryAltitude");
  const venusAzimuth = document.getElementById("venusAzimuth");
  const venusAltitude = document.getElementById("venusAltitude");
  const moonAzimuth = document.getElementById("moonAzimuth");
  const moonAltitude = document.getElementById("moonAltitude");
  const marsAzimuth = document.getElementById("marsAzimuth");
  const marsAltitude = document.getElementById("marsAltitude");
  const jupiterAzimuth = document.getElementById("jupiterAzimuth");
  const jupiterAltitude = document.getElementById("jupiterAltitude");
  const saturnAzimuth = document.getElementById("saturnAzimuth");
  const saturnAltitude = document.getElementById("saturnAltitude");
  const uranusAzimuth = document.getElementById("uranusAzimuth");
  const uranusAltitude = document.getElementById("uranusAltitude");
  const neptuneAzimuth = document.getElementById("neptuneAzimuth");
  const neptuneAltitude = document.getElementById("neptuneAltitude");
  const plutoAzimuth = document.getElementById("plutoAzimuth");
  const plutoAltitude = document.getElementById("plutoAltitude");
  
  const d = new Date();
  const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
      d.getUTCSeconds()/3600;

  const sun = pc.sun(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  const venus = pc.venus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  const moon = pc.moon(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  const mars = pc.mars(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  const jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  const saturn = pc.saturn(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  const neptune = pc.neptune(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  const pluto = pc.pluto(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);

  sunAzimuth.text = `${sun.az.toFixed(2)}`;
  sunAltitude.text = `${sun.alt.toFixed(2)}`;
  mercuryAzimuth.text = `${mercury.az.toFixed(2)}`;
  mercuryAltitude.text = `${mercury.alt.toFixed(2)}`;
  venusAzimuth.text = `${venus.az.toFixed(2)}`;
  venusAltitude.text = `${venus.alt.toFixed(2)}`;
  moonAzimuth.text = `${moon.az.toFixed(2)}`;
  moonAltitude.text = `${moon.alt.toFixed(2)}`;
  marsAzimuth.text = `${mars.az.toFixed(2)}`;
  marsAltitude.text = `${mars.alt.toFixed(2)}`;
  jupiterAzimuth.text = `${jupiter.az.toFixed(2)}`;
  jupiterAltitude.text = `${jupiter.alt.toFixed(2)}`;
  saturnAzimuth.text = `${saturn.az.toFixed(2)}`;
  saturnAltitude.text = `${saturn.alt.toFixed(2)}`;
  uranusAzimuth.text = `${uranus.az.toFixed(2)}`;
  uranusAltitude.text = `${uranus.alt.toFixed(2)}`;
  neptuneAzimuth.text = `${neptune.az.toFixed(2)}`;
  neptuneAltitude.text = `${neptune.alt.toFixed(2)}`;
  plutoAzimuth.text = `${pluto.az.toFixed(2)}`;
  plutoAltitude.text = `${pluto.alt.toFixed(2)}`;

  // debugging
  console.log("sun azimuth: " + sun.az.toFixed(2));
  console.log("sun altitude: " + sun.alt.toFixed(2));
  console.log("mercury azimuth: " + mercury.az.toFixed(2));
  console.log("mercury altitude: " + mercury.alt.toFixed(2));
  console.log("venus azimuth: " + venus.az.toFixed(2));
  console.log("venus altitude: " + venus.alt.toFixed(2));
  console.log("moon azimuth: " + moon.az.toFixed(2));
  console.log("moon altitude: " + moon.alt.toFixed(2));
  console.log("mars azimuth: " + mars.az.toFixed(2));
  console.log("mars altitude: " + mars.alt.toFixed(2));
  console.log("jupiter azimuth: " + jupiter.az.toFixed(2));
  console.log("jupiter altitude: " + jupiter.alt.toFixed(2));
  console.log("saturn azimuth: " + saturn.az.toFixed(2));
  console.log("saturn altitude: " + saturn.alt.toFixed(2));
  console.log("uranus azimuth: " + uranus.az.toFixed(2));
  console.log("uranus altitude: " + uranus.alt.toFixed(2));
  console.log("neptune azimuth: " + neptune.az.toFixed(2));
  console.log("neptune altitude: " + neptune.alt.toFixed(2));
  console.log("pluto azimuth: " + pluto.az.toFixed(2));
  console.log("pluto altitude: " + pluto.alt.toFixed(2));
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

