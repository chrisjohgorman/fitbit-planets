import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("saturn clicked");
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
}
