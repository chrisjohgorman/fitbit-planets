import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("moon clicked");
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

  const moon = pc.moon(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
  const moonrs = pc.moonRiseSet(d.getFullYear(),
      (d.getMonth() + 1), d.getDate(), ut, lat, long);

  bodyName.text = "Moon";
  bodyRightAscension.text = `${moon.ra.toFixed(4)}` + " h";
  bodyDeclination.text = `${moon.decl.toFixed(4)}` + "°";
  bodyDistance.text = `${(moon.dist *6371).toFixed()}` + " km";
  bodyAzimuth.text = `${moon.az.toFixed(4)}` + "°";
  bodyAltitude.text = `${moon.alt.toFixed(4)}` + "°";
  bodyRiseTime.text = `${moonrs.rise}`;
  bodySetTime.text = `${moonrs.set}`;

  console.log("moon RA: " + moon.ra.toFixed(4));
  console.log("moon Decl: " + moon.decl.toFixed(4));
  console.log("moon Dist: " + moon.dist.toFixed(4));
  console.log("moon azimuth: " + moon.az.toFixed(4));
  console.log("moon altitude: " + moon.alt.toFixed(4));
}
