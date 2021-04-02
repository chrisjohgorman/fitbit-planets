import * as pc from "../common/planetCoordinates.js";

const lat = 45.3661;
const long = -75.7900;
const d = new Date();

const ut = d.getUTCHours() + d.getUTCMinutes()/60 +
    d.getUTCSeconds()/3600;
const mercury = pc.mercury(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long, ut);
console.log("mercury azimuth %s", mercury.az.toFixed(2));
console.log("mercury altitude %s", mercury.alt.toFixed(2));
const uranus = pc.uranus(pc.dayNumber(d.getFullYear(),
    (d.getMonth() + 1),d.getDate()), lat, long);
console.log("uranus azimuth %s", uranus.az.toFixed(2));
console.log("uranus altitude %s", uranus.alt.toFixed(2));
