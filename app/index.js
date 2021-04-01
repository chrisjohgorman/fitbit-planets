import * as pc from "../common/planetCoordinates.js";

const uranus = pc.uranus(pc.dayNumber(2021,4,1), 45.3661, -75.7900);
console.log("uranus azimuth %s", uranus.az.toFixed(2));
console.log("uranus altitude %s", uranus.alt.toFixed(2));
