import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("mercury clicked");
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

  console.log("mercury RA: " + mercury.ra.toFixed(4));
  console.log("mercury Decl: " + mercury.decl.toFixed(4));
  console.log("mercury Dist: " + mercury.dist.toFixed(4));
  console.log("mercury azimuth: " + mercury.az.toFixed(4));
  console.log("mercury altitude: " + mercury.alt.toFixed(4));
}
