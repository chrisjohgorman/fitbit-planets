import * as document from "document";
import { geolocation } from "geolocation";
import * as pc from "../common/planetCoordinates.js";
import * as fs from "fs";


var idx = 0;
var flag = 0;

//////////////////////////////////
// { Sun view menu entry

function sunViewStart() {
  console.log("sun-view clicked");
  idx = 0;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Mercury view menu entry

function mercuryViewStart() {
  console.log("mercury-view clicked");
  idx = 1;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////


//////////////////////////////////
// { Venus view menu entry

function venusViewStart() {
  console.log("venus-view clicked");
  idx = 2;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Moon view menu entry

function moonViewStart() {
  console.log("moon-view clicked");
  idx = 3;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Mars view menu entry

function marsViewStart() {
  console.log("mars-view clicked");
  idx = 4;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Jupiter view menu entry

function jupiterViewStart() {
  console.log("jupiter-view clicked");
  idx = 5;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Saturn view menu entry

function saturnViewStart() {
  console.log("saturn-view clicked");
  idx = 6;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Uranus view menu entry

function uranusViewStart() {
  console.log("uranus-view clicked");
  idx = 7;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Neptune view menu entry

function neptuneViewStart() {
  console.log("neptune-view clicked");
  idx = 8;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

//////////////////////////////////
// { Pluto view menu entry

function plutoViewStart() {
  console.log("pluto-view clicked");
  idx = 9;
  displayCoordinates();
  document.location.assign('celestial-body.view');
}

// }
//////////////////////////////////

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

function displayCoordinates() {
  geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
  if(fs.existsSync("/private/data/fb-planets.txt")) {
    console.log("GPS cache file exists, using cache");
    let GPSObject  = fs.readFileSync("/private/data/fb-planets.txt", "json");
    console.log("GPS lat/long: " + GPSObject.latitude + " " +
      GPSObject.longitude);
    let cacheLatitude = GPSObject.latitude;
    let cacheLongitude = GPSObject.longitude;
    formatPlanets(idx, cacheLatitude, cacheLongitude);
  } else {
    console.log("failed to find JSON GPS cache file");
    if (flag === 0) {
      let flag = 1;
      // Write to fb-planets.txt for initial pass
      let GPSDataInitial = {
        "_id": "2331f964fcc9e0fd86378c16",
        "guid": "ca5a8609-a076-607d-f714-a1a54dd50fbf",
        "registered": "2021-04-05T18:38:25 GMT-04:00",
        "latitude": 45.36585,
        "longitude": -75.7894,
      };
      fs.writeFileSync("/private/data/fb-planets.txt", GPSDataInitial, "json");
    }
  }
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};

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
  let GPSObject = fs.readFileSync("/private/data/fb-planets.txt", "json");
  let lat = GPSObject.latitude;
  let long = GPSObject.longitude;
  console.log("latitude:" + lat); 
  console.log("longitude:" + long); 
  formatPlanets(idx, position.coords.latitude, position.coords.longitude);
}

function formatPlanets(index, lat, long) {

  const bodyName = document.getElementById("bodyName");
  const bodyRightAscension = document.getElementById("bodyRightAscension");
  const bodyDeclination = document.getElementById("bodyDeclination");
  const bodyDistance = document.getElementById("bodyDistance");
  const bodyAzimuth = document.getElementById("bodyAzimuth");
  const bodyAltitude = document.getElementById("bodyAltitude");
  const bodyRiseTime = document.getElementById("bodyRiseTime");
  const bodySetTime = document.getElementById("bodySetTime");

  const d = new Date();
  const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
      d.getUTCSeconds()/3600;

  if (1) {
    const sun = pc.sun(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const sunrs = pc.sunRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);
  
    bodyName.text = "Sun";
    bodyRightAscension.text = `${sun.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${sun.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${sun.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${sun.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${sun.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${sunrs.rise}`;
    bodySetTime.text = `${sunrs.set}`;
  
    console.log("sun RA: " + sun.ra.toFixed(4));
    console.log("sun Decl: " + sun.decl.toFixed(4));
    console.log("sun Dist: " + sun.dist.toFixed(4));
    console.log("sun azimuth: " + sun.az.toFixed(4));
    console.log("sun altitude: " + sun.alt.toFixed(4));
  } else if (index === 1) {
    const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const mercuryrs = pc.mercuryRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Mercury";
    bodyRightAscension.text = `${mercury.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${mercury.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${mercury.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${mercury.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${mercury.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${mercuryrs.rise}`;
    bodySetTime.text = `${mercuryrs.set}`;

    console.log("mercury ra: " + mercury.ra.toFixed(4));
    console.log("mercury decl: " + mercury.decl.toFixed(4));
    console.log("mercury dist: " + mercury.dist.toFixed(4));
    console.log("mercury azimuth: " + mercury.az.toFixed(4));
    console.log("mercury altitude: " + mercury.alt.toFixed(4));
  } else if (index === 2) {
    const venus = pc.venus(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const venusrs = pc.venusRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Venus";
    bodyRightAscension.text = `${venus.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${venus.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${venus.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${venus.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${venus.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${venusrs.rise}`;
    bodySetTime.text = `${venusrs.set}`;

    console.log("venus RA: " + venus.ra.toFixed(4));
    console.log("venus Decl: " + venus.decl.toFixed(4));
    console.log("venus Dist: " + venus.dist.toFixed(4));
    console.log("venus azimuth: " + venus.az.toFixed(4));
    console.log("venus altitude: " + venus.alt.toFixed(4));
  } else if (index === 3) {
    const moon = pc.moon(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const moonrs = pc.moonRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Moon";
    bodyRightAscension.text = `${moon.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${moon.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${(moon.dist * 6371).toFixed()}` + " km";
    bodyAzimuth.text = `${moon.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${moon.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${moonrs.rise}`;
    bodySetTime.text = `${moonrs.set}`;

    console.log("moon RA: " + moon.ra.toFixed(4));
    console.log("moon Decl: " + moon.decl.toFixed(4));
    console.log("moon Dist: " + moon.dist.toFixed(4));
    console.log("moon azimuth: " + moon.az.toFixed(4));
    console.log("moon altitude: " + moon.alt.toFixed(4));
  } else if (index === 4) {
    const mars = pc.mars(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const marsrs = pc.marsRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Mars";
    bodyRightAscension.text = `${mars.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${mars.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${mars.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${mars.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${mars.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${marsrs.rise}`;
    bodySetTime.text = `${marsrs.set}`;

    console.log("mars RA: " + mars.ra.toFixed(4));
    console.log("mars Decl: " + mars.decl.toFixed(4));
    console.log("mars Dist: " + mars.dist.toFixed(4));
    console.log("mars azimuth: " + mars.az.toFixed(4));
    console.log("mars altitude: " + mars.alt.toFixed(4));
  } else if (index === 5) {
    const jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const jupiterrs = pc.jupiterRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Jupiter";
    bodyRightAscension.text = `${jupiter.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${jupiter.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${jupiter.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${jupiter.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${jupiter.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${jupiterrs.rise}`;
    bodySetTime.text = `${jupiterrs.set}`;

    console.log("jupiter RA: " + jupiter.ra.toFixed(4));
    console.log("jupiter Decl: " + jupiter.decl.toFixed(4));
    console.log("jupiter Dist: " + jupiter.dist.toFixed(4));
    console.log("jupiter azimuth: " + jupiter.az.toFixed(4));
    console.log("jupiter altitude: " + jupiter.alt.toFixed(4));
  } else if (index === 6) {
    const saturn = pc.saturn(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const saturnrs = pc.saturnRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Saturn";
    bodyRightAscension.text = `${saturn.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${saturn.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${saturn.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${saturn.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${saturn.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${saturnrs.rise}`;
    bodySetTime.text = `${saturnrs.set}`;

    console.log("saturn RA: " + saturn.ra.toFixed(4));
    console.log("saturn Decl: " + saturn.decl.toFixed(4));
    console.log("saturn Dist: " + saturn.dist.toFixed(4));
    console.log("saturn azimuth: " + saturn.az.toFixed(4));
    console.log("saturn altitude: " + saturn.alt.toFixed(4));
  } else if (index === 7) {
    const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const uranusrs = pc.uranusRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Uranus";
    bodyRightAscension.text = `${uranus.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${uranus.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${uranus.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${uranus.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${uranus.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${uranusrs.rise}`;
    bodySetTime.text = `${uranusrs.set}`;

    console.log("uranus RA: " + uranus.ra.toFixed(4));
    console.log("uranus Decl: " + uranus.decl.toFixed(4));
    console.log("uranus Dist: " + uranus.dist.toFixed(4));
    console.log("uranus azimuth: " + uranus.az.toFixed(4));
    console.log("uranus altitude: " + uranus.alt.toFixed(4));
  } else if (index === 8) {
    const neptune = pc.neptune(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const neptuners = pc.neptuneRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Neptune";
    bodyRightAscension.text = `${neptune.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${neptune.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${neptune.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${neptune.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${neptune.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${neptuners.rise}`;
    bodySetTime.text = `${neptuners.set}`;

    console.log("neptune RA: " + neptune.ra.toFixed(4));
    console.log("neptune Decl: " + neptune.decl.toFixed(4));
    console.log("neptune Dist: " + neptune.dist.toFixed(4));
    console.log("neptune azimuth: " + neptune.az.toFixed(4));
    console.log("neptune altitude: " + neptune.alt.toFixed(4));
  } else if (index === 9) {
    const pluto = pc.pluto(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
    const plutors = pc.plutoRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, lat, long);

    bodyName.text = "Pluto";
    bodyRightAscension.text = `${pluto.ra.toFixed(4)}` + " h";
    bodyDeclination.text = `${pluto.decl.toFixed(4)}` + "°";
    bodyDistance.text = `${pluto.dist.toFixed(4)}` + " au";
    bodyAzimuth.text = `${pluto.az.toFixed(4)}` + "°";
    bodyAltitude.text = `${pluto.alt.toFixed(4)}` + "°";
    bodyRiseTime.text = `${plutors.rise}`;
    bodySetTime.text = `${plutors.set}`;

    console.log("pluto RA: " + pluto.ra.toFixed(4));
    console.log("pluto Decl: " + pluto.decl.toFixed(4));
    console.log("pluto Dist: " + pluto.dist.toFixed(4));
    console.log("pluto azimuth: " + pluto.az.toFixed(4));
    console.log("pluto altitude: " + pluto.alt.toFixed(4));
  }
}

function updateMainMenu() {
  document.getElementById("sun-view/start").addEventListener("click", sunViewStart);
  document.getElementById("mercury-view/start").addEventListener("click", mercuryViewStart);
  document.getElementById("venus-view/start").addEventListener("click", venusViewStart);
  document.getElementById("moon-view/start").addEventListener("click", moonViewStart);
  document.getElementById("mars-view/start").addEventListener("click", marsViewStart);
  document.getElementById("jupiter-view/start").addEventListener("click", jupiterViewStart);
  document.getElementById("saturn-view/start").addEventListener("click", saturnViewStart);
  document.getElementById("uranus-view/start").addEventListener("click", uranusViewStart);
  document.getElementById("neptune-view/start").addEventListener("click", neptuneViewStart);
  document.getElementById("pluto-view/start").addEventListener("click", plutoViewStart);
}

updateMainMenu();
