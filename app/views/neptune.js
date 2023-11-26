import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("neptune clicked");
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
}
