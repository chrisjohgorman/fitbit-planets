import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("uranus clicked");
  geolocation.getCurrentPosition(locationSuccess, locationError);
  return document.location.assign('celestial-body.view');
}

function locationSuccess(position) {
  formatPlanets(position.coords.latitude, position.coords.longitude);
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

function formatPlanets(lat, long) {
  //
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
}
