import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("jupiter clicked");
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
}
