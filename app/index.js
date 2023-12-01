import * as document from "document";
import { geolocation } from "geolocation";
import * as pc from "../common/planetCoordinates.js";
import * as fs from "fs";
import { inbox } from "file-transfer"


//var idx = 0;
//var flag = 0;
var latitude = 0
var longitude = 0;


//////////////////////////////////
// { Sun view menu entry

function sunViewStart() {
  console.log("sun-view clicked");
  document.location.assign('celestial-body.view').then(updateSun);
}

function updateSun() {

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
  console.log("Date is " + `${d}`);

  let sun = pc.sun(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let sunrs = pc.sunRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("sun Rise " + sunrs.rise);
  console.log("sun Set " + sunrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Mercury view menu entry

function mercuryViewStart() {
  console.log("mercury-view clicked");
  document.location.assign('celestial-body.view').then(updateMercury);
}

function updateMercury() {

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
  console.log("Date is " + `${d}`);

  let mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let mercuryrs = pc.mercuryRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
  bodyName.text = "Mercury";
  bodyRightAscension.text = `${mercury.ra.toFixed(4)}` + " h";
  bodyDeclination.text = `${mercury.decl.toFixed(4)}` + "°";
  bodyDistance.text = `${mercury.dist.toFixed(4)}` + " au";
  bodyAzimuth.text = `${mercury.az.toFixed(4)}` + "°";
  bodyAltitude.text = `${mercury.alt.toFixed(4)}` + "°";
  bodyRiseTime.text = `${mercuryrs.rise}`;
  bodySetTime.text = `${mercuryrs.set}`;
  
  console.log("mercury RA: " + mercury.ra.toFixed(4));
  console.log("mercury Decl: " + mercury.decl.toFixed(4));
  console.log("mercury Dist: " + mercury.dist.toFixed(4));
  console.log("mercury azimuth: " + mercury.az.toFixed(4));
  console.log("mercury altitude: " + mercury.alt.toFixed(4));
  console.log("mercury Rise " + mercuryrs.rise);
  console.log("mercury Set " + mercuryrs.set);
}

// }
//////////////////////////////////


//////////////////////////////////
// { Venus view menu entry

function venusViewStart() {
  console.log("venus-view clicked");
  document.location.assign('celestial-body.view').then(updateVenus);
}

function updateVenus() {

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
  console.log("Date is " + `${d}`);

  let venus = pc.venus(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let venusrs = pc.venusRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("venus Rise " + venusrs.rise);
  console.log("venus Set " + venusrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Moon view menu entry

function moonViewStart() {
  console.log("moon-view clicked");
  document.location.assign('celestial-body.view').then(updateMoon);
}

function updateMoon() {

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
  console.log("Date is " + `${d}`);

  let moon = pc.moon(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let moonrs = pc.moonRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
 
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
  console.log("moon Rise " + moonrs.rise);
  console.log("moon Set " + moonrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Mars view menu entry

function marsViewStart() {
  console.log("mars-view clicked");
  document.location.assign('celestial-body.view').then(updateMars);
}

function updateMars() {

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
  console.log("Date is " + `${d}`);

  let mars = pc.mars(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let marsrs = pc.marsRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("mars Rise " + marsrs.rise);
  console.log("mars Set " + marsrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Jupiter view menu entry

function jupiterViewStart() {
  console.log("jupiter-view clicked");
  document.location.assign('celestial-body.view').then(updateJupiter);
}

function updateJupiter() {

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
  console.log("Date is " + `${d}`);

  let jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let jupiterrs = pc.jupiterRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("jupiter Rise " + jupiterrs.rise);
  console.log("jupiter Set " + jupiterrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Saturn view menu entry

function saturnViewStart() {
  console.log("saturn-view clicked");
  document.location.assign('celestial-body.view').then(updateSaturn);
}

function updateSaturn() {

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
  console.log("Date is " + `${d}`);

  let saturn = pc.saturn(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let saturnrs = pc.saturnRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("saturn Rise " + saturnrs.rise);
  console.log("saturn Set " + saturnrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Uranus view menu entry

function uranusViewStart() {
  console.log("uranus-view clicked");
  document.location.assign('celestial-body.view').then(updateUranus);
}

function updateUranus() {

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
  console.log("Date is " + `${d}`);

  let uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let uranusrs = pc.uranusRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("uranus Rise " + uranusrs.rise);
  console.log("uranus Set " + uranusrs.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Neptune view menu entry

function neptuneViewStart() {
  console.log("neptune-view clicked");
  document.location.assign('celestial-body.view').then(updateNeptune);
}

function updateNeptune() {
  
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
  console.log("Date is " + `${d}`);

  let neptune = pc.neptune(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let neptuners = pc.neptuneRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("neptune Rise " + neptuners.rise);
  console.log("neptune Set " + neptuners.set);
}
// }
//////////////////////////////////

//////////////////////////////////
// { Pluto view menu entry

function plutoViewStart() {
  console.log("pluto-view clicked");
  document.location.assign('celestial-body.view').then(updatePluto);
}

function updatePluto() {

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
  console.log("Date is " + `${d}`);

  let pluto = pc.pluto(pc.dayNumber(d.getFullYear(),
        (d.getMonth() + 1),d.getDate(), ut), latitude, longitude, ut);
  let plutors = pc.plutoRiseSet(d.getFullYear(),
        (d.getMonth() + 1), d.getDate(), ut, latitude, longitude);
  console.log ("pc.dayNumber " + pc.dayNumber(d.getFullYear(), (d.getMonth() + 1),d.getDate(), ut));
  
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
  console.log("pluto Rise " + plutors.rise);
  console.log("pluto Set " + plutors.set);
}
// }
//////////////////////////////////

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

async function displayCoordinates() {
  geolocation.getCurrentPosition(locationSuccess, locationError, geoOptions);
  if(!fs.existsSync("/private/data/companion-fb-planets.txt")) {
    inbox.addEventListener("newfile", processAllFiles);
    await processAllFiles();
    //GPSObject = fs.readFileSync('/private/data/companion-fb-planets.txt', 'cbor');
    var latitude = 45.3654395;
    var longitude = -75.7895892;
    console.log("using gps data from companion");
    updateMainMenu();
  } else if (fs.existsSync("/private/data/fb-planets.txt")) {
    console.log("Watch GPS cache file exists, using cache");
    let GPSObject  = fs.readFileSync("/private/data/fb-planets.txt", "json");
    console.log("GPS lat/long: " + GPSObject.latitude + " " +
      GPSObject.longitude);
    var latitude = GPSObject.latitude;
    var longitude = GPSObject.longitude;
    updateMainMenu();
  } else {
    // FIXME add gps error to top of page displayed
    console.log("Failed to set gps");
    updateMainMenu();
  }
}

function processAllFiles() {
  let fileName;
  while (fileName = inbox.nextFile()) {
      console.log("Received:", fileName);
  }
}

var geoOptions = {
  enableHighAccuracy: false,
  maximumAge        : 0,
  timeout           : Infinity,
};

function locationSuccess(position) {
  //cache GPS data in json file
    let GPSData = {
    "_id": "a338e68c6a14c2cc5deef3b03ddab7fd",
    "guid": "de88671e-125f-4166-a9c5-a12389d8696a",
    "registered": "2023-12-01T08:46:05 GMT-05:00",
    "latitude": position.coords.latitude,
    "longitude": position.coords.longitude,
  };
  fs.writeFileSync("/private/data/fb-planets.txt", GPSData, "json");
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  //debugging
  let GPSObject = fs.readFileSync("/private/data/fb-planets.txt", "json");
  console.log("fb-planets.txt latitude:" + GPSObject.latitude); 
  console.log("fb-planets.txt longitude:" + GPSObject.longitude); 
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

displayCoordinates();
