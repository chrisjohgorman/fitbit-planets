import * as pc from "../common/planetCoordinates.js";

const lat = 45.3661;
const long = -75.7900;
const d = new Date();

const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
    d.getUTCSeconds()/3600;
const sun = pc.sun(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long);
console.log("sun azimuth %s", sun.az.toFixed(2));
console.log("sun altitude %s", sun.alt.toFixed(2));
const moon = pc.moon(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("moon azimuth %s", moon.az.toFixed(2));
console.log("moon altitude %s", moon.alt.toFixed(2));
const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("mercury azimuth %s", mercury.az.toFixed(2));
console.log("mercury altitude %s", mercury.alt.toFixed(2));
const venus = pc.venus(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("venus azimuth %s", venus.az.toFixed(2));
console.log("venus altitude %s", venus.alt.toFixed(2));
const mars = pc.mars(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("mars azimuth %s", mars.az.toFixed(2));
console.log("mars altitude %s", mars.alt.toFixed(2));
const jupiter = pc.jupiter(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("jupiter azimuth %s", jupiter.az.toFixed(2));
console.log("jupiter altitude %s", jupiter.alt.toFixed(2));
const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long);
console.log("uranus azimuth %s", uranus.az.toFixed(2));
console.log("uranus altitude %s", uranus.alt.toFixed(2));
