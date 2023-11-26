import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("mars clicked");
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
}
