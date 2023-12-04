import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("pluto clicked");
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
