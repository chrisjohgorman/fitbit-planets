import { geolocation } from "geolocation";
import document from "document";
import * as pc from "../common/planetCoordinates.js";

geolocation.getCurrentPosition(locationSuccess, locationError);

function locationSuccess(position) {
  const lat = position.coords.latitude;
  const long = position.coords.longitude;
  //FIXME - remove
  //const lat = 45.3661;
  //const long = -75.7900;
  const d = new Date();
  console.log("latitude:" + lat); 
  console.log("longitude:" + long); 
  const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
      d.getUTCSeconds()/3600;
  const sun = pc.sun(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("sun azimuth: " + sun.az.toFixed(2));
  console.log("sun altitude: " + sun.alt.toFixed(2));
  const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("mercury azimuth: " + mercury.az.toFixed(2));
  console.log("mercury altitude: " + mercury.alt.toFixed(2));
  const venus = pc.venus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("venus azimuth: " + venus.az.toFixed(2));
  console.log("venus altitude: " + venus.alt.toFixed(2));
  const moon = pc.moon(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("moon azimuth: " + moon.az.toFixed(2));
  console.log("moon altitude: " + moon.alt.toFixed(2));
  const mars = pc.mars(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("mars azimuth: " + mars.az.toFixed(2));
  console.log("mars altitude: " + mars.alt.toFixed(2));
  const jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long, ut);
  console.log("jupiter azimuth: " + jupiter.az.toFixed(2));
  console.log("jupiter altitude: " + jupiter.alt.toFixed(2));
  const saturn = pc.saturn(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("saturn azimuth: " + saturn.az.toFixed(2));
  console.log("saturn altitude: " + saturn.alt.toFixed(2));
  const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("uranus azimuth: " + uranus.az.toFixed(2));
  console.log("uranus altitude: " + uranus.alt.toFixed(2));
  const neptune = pc.neptune(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("neptune azimuth: " + neptune.az.toFixed(2));
  console.log("neptune altitude: " + neptune.alt.toFixed(2));
  const pluto = pc.pluto(pc.dayNumber(d.getFullYear(),
      (d.getMonth() + 1),d.getDate()), lat, long);
  console.log("pluto azimuth: " + pluto.az.toFixed(2));
  console.log("pluto altitude: " + pluto.alt.toFixed(2));
}

function locationError(error) {
  console.log("Error: " + error.code, "Message: " + error.message);
}

