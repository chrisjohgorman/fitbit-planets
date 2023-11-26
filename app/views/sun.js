import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("sun clicked");
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
}
