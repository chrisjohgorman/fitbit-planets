import { geolocation } from "geolocation";
import document from "document";
import * as pc from "../common/planetCoordinates.js";
import * as fs from "fs";

var idx;

function launchTile() {
  let list = document.getElementById("myList");
  let items = list.getElementsByClassName("list-item");

  items.forEach((element, index) => {
    let touch = element.getElementById("touch");
    touch.addEventListener("click", (evt) => {
      idx = index;
      console.log(`touched: ${index}`);
      document.replaceSync("./resources/celestial-body.gui");
      console.log(document.location.pathname);
      displayCoordinates();
    });
  });
}

function displayCoordinates() {
  geolocation.getCurrentPosition(locationSuccess, locationError);
  if(fs.existsSync("/private/data/fb-planets.txt")) {
    console.log("GPS cache file exists, using cache");
    let GPS_object  = fs.readFileSync("/private/data/fb-planets.txt", "json");
    console.log("GPS lat/long: " + GPS_object.latitude + " " +
      GPS_object.longitude);
    let cacheLatitude = GPS_object.latitude;
    let cacheLongitude = GPS_object.longitude;
    formatPlanets(idx, cacheLatitude, cacheLongitude);
  } else {
    console.log("failed to find JSON GPS cache file");
  }
}

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
  //let GPS_object = fs.readFileSync("/private/data/fb-planets.txt", "json");
  //let lat = GPS_object.latitude;
  //let long = GPS_object.longitude;
  //console.log("latitude:" + lat); 
  //console.log("longitude:" + long); 
  formatPlanets(idx, position.coords.latitude, position.coords.longitude);
}

function formatPlanets(index, lat, long) {
  //
  const bodyName = document.getElementById("bodyName");
  const bodyRightAscension = document.getElementById("bodyRightAscension");
  const bodyDeclination = document.getElementById("bodyDeclination");
  const bodyDistance = document.getElementById("bodyDistance");
  const bodyAzimuth = document.getElementById("bodyAzimuth");
  const bodyAltitude = document.getElementById("bodyAltitude");
  const bodyRiseTime = document.getElementById("bodyRiseTime");
  const bodySetTime = document.getElementById("bodySetTime");
  
  let button = document.getElementById("button");
  button.onactivate = function(evt) {
    document.replaceSync("./resources/index.gui");
    console.log(document.location.pathname);
    launchTile();
  }

  const d = new Date();
  const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
      d.getUTCSeconds()/3600;

  const sun = pc.sun(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  const sunrs = pc.sunRiseSet(d.getFullYear(),
      (d.getMonth() + 1), d.getDate(), lat, long);
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

  if (index === 0) {
    bodyName.text = "Sun";
    bodyRightAscension.text = `${sun.ra.toFixed(2)}`;
    bodyDeclination.text = `${sun.decl.toFixed(2)}`;
    bodyDistance.text = `${sun.dist.toFixed(2)}`;
    bodyAzimuth.text = `${sun.az.toFixed(2)}`;
    bodyAltitude.text = `${sun.alt.toFixed(2)}`;
    bodyRiseTime.text = `${sunrs.sr}`;
    bodySetTime.text = `${sunrs.ss}`;
  } else if (index === 1) {
    bodyName.text = "Mercury";
    bodyRightAscension.text = `${mercury.ra.toFixed(2)}`;
    bodyDeclination.text = `${mercury.decl.toFixed(2)}`;
    bodyDistance.text = `${mercury.dist.toFixed(2)}`;
    bodyAzimuth.text = `${mercury.az.toFixed(2)}`;
    bodyAltitude.text = `${mercury.alt.toFixed(2)}`;
  } else if (index === 2) {
    bodyName.text = "Venus";
    bodyRightAscension.text = `${venus.ra.toFixed(2)}`;
    bodyDeclination.text = `${venus.decl.toFixed(2)}`;
    bodyDistance.text = `${venus.dist.toFixed(2)}`;
    bodyAzimuth.text = `${venus.az.toFixed(2)}`;
    bodyAltitude.text = `${venus.alt.toFixed(2)}`;
  } else if (index === 3) {
    bodyName.text = "Moon";
    bodyRightAscension.text = `${moon.ra.toFixed(2)}`;
    bodyDeclination.text = `${moon.decl.toFixed(2)}`;
    bodyDistance.text = `${moon.dist.toFixed(2)}`;
    bodyAzimuth.text = `${moon.az.toFixed(2)}`;
    bodyAltitude.text = `${moon.alt.toFixed(2)}`;
  } else if (index === 4) {
    bodyName.text = "Mars";
    bodyRightAscension.text = `${mars.ra.toFixed(2)}`;
    bodyDeclination.text = `${mars.decl.toFixed(2)}`;
    bodyDistance.text = `${mars.dist.toFixed(2)}`;
    bodyAzimuth.text = `${mars.az.toFixed(2)}`;
    bodyAltitude.text = `${mars.alt.toFixed(2)}`;
  } else if (index === 5) {
    bodyName.text = "Jupiter";
    bodyRightAscension.text = `${jupiter.ra.toFixed(2)}`;
    bodyDeclination.text = `${jupiter.decl.toFixed(2)}`;
    bodyDistance.text = `${jupiter.dist.toFixed(2)}`;
    bodyAzimuth.text = `${jupiter.az.toFixed(2)}`;
    bodyAltitude.text = `${jupiter.alt.toFixed(2)}`;
  } else if (index === 6) {
    bodyName.text = "Saturn";
    bodyRightAscension.text = `${saturn.ra.toFixed(2)}`;
    bodyDeclination.text = `${saturn.decl.toFixed(2)}`;
    bodyDistance.text = `${saturn.dist.toFixed(2)}`;
    bodyAzimuth.text = `${saturn.az.toFixed(2)}`;
    bodyAltitude.text = `${saturn.alt.toFixed(2)}`;
  } else if (index === 7) {
    bodyName.text = "Uranus";
    bodyRightAscension.text = `${uranus.ra.toFixed(2)}`;
    bodyDeclination.text = `${uranus.decl.toFixed(2)}`;
    bodyDistance.text = `${uranus.dist.toFixed(2)}`;
    bodyAzimuth.text = `${uranus.az.toFixed(2)}`;
    bodyAltitude.text = `${uranus.alt.toFixed(2)}`;
  } else if (index === 8) {
    bodyName.text = "Neptune";
    bodyRightAscension.text = `${neptune.ra.toFixed(2)}`;
    bodyDeclination.text = `${neptune.decl.toFixed(2)}`;
    bodyDistance.text = `${neptune.dist.toFixed(2)}`;
    bodyAzimuth.text = `${neptune.az.toFixed(2)}`;
    bodyAltitude.text = `${neptune.alt.toFixed(2)}`;
  } else if (index === 9) {
    bodyName.text = "Pluto";
    bodyRightAscension.text = `${pluto.ra.toFixed(2)}`;
    bodyDeclination.text = `${pluto.decl.toFixed(2)}`;
    bodyDistance.text = `${pluto.dist.toFixed(2)}`;
    bodyAzimuth.text = `${pluto.az.toFixed(2)}`;
    bodyAltitude.text = `${pluto.alt.toFixed(2)}`;
  }

  // debugging
  console.log("sun RA: " + sun.ra.toFixed(2));
  console.log("sun Decl: " + sun.decl.toFixed(2));
  console.log("sun Dist: " + sun.dist.toFixed(2));
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

launchTile();
