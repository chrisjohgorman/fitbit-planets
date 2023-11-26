import document from "document";
import { geolocation } from "geolocation";
import * as pc from "../../common/planetCoordinates.js";
import * as fs from "fs";

export function update() {
}

export function init() {
  console.log("venus clicked");
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

  const venus = pc.venus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate(), ut), lat, long, ut);
  const venusrs = pc.venusRiseSet(d.getFullYear(),
      (d.getMonth() + 1), d.getDate(), ut, lat, long);

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
}
