// Utility functions and variables

var radToDeg = 180.0 / Math.PI;

var degToRad = Math.PI / 180;

Math.sind = function(x) {
    return Math.sin(x * degToRad);
}

Math.cosd = function(x) {
    return Math.cos(x * degToRad);
}

Math.tand = function(x) {
    return Math.tan(x * degToRad);
}

Math.asind = function(x) {
    return Math.asin(x) * radToDeg;
}

Math.acosd = function(x) {
    return Math.acos(x) * radToDeg;
}

Math.atand = function(x) {
    return Math.atan(x) * radToDeg;
}

Math.atan2d = function(y, x) {
    return Math.atan2(y, x) * radToDeg;
}

// Normalize degree of x to between 0 and 360
Math.revolveDegree = function (x) {
    return x - Math.floor(x/360.0)*360.0;
}

// Normalize Hour Angle x to between 0 and 24
Math.revolveHourAngle = function (x) {
    return x - Math.floor(x/24.0)*24.0;
}

// Helper functions
export function dayNumber (year, month, day, UT) {
    let d = 367*year 
        - Math.floor(7 * (year + Math.floor((month+9)/12))  / 4) 
        - Math.floor(3 * ((year + Math.floor((month -9)/ 7)) / 100 + 1) / 4) 
        + Math.floor(275*month/9) + day - 730515;
    if (UT === undefined) {
        let utc = new Date();
        d = d + (utc.getUTCHours() + utc.getUTCMinutes()/60 +
            utc.getUTCSeconds()/3600)/24;    
    } else {
        d = d + UT/24;
    } 
    return d;
}

export function eccentricAnomaly (M, e, tol) {
    let e0 = M 
        + (180/Math.PI) * e * Math.sind(M) * (1 + e + Math.cosd(M));
    let e1 = e0 - 
        (e0 - (180/Math.PI) * e * Math.sind(e0) - M) / (1 - e *
        Math.cosd(e0));
    while (Math.abs(e0 - e1) > tol) {
        e0 = e1;
        e1 = e0 - (e0 - (180/Math.PI) * e * Math.sind(e0) - M) / (1 - e
        * Math.cosd(e0));
    }
    return e1;
}

export function sidtime (day_number, longitude, UT) {
    let sr = sunRectangular (day_number);
    let gmst0 = Math.revolveDegree(sr.L + 180);
    if (UT === undefined) {
        let utc = new Date();
        var st = gmst0/15 + (utc.getUTCHours() + utc.getUTCMinutes()/60 +
            utc.getUTCSeconds()/3600) + longitude/15;
    } else {
        var st = gmst0/15 + UT + longitude/15;
    }
    return st; 
}

export function sunRectangular (day_number) {
    let w = 282.9404 + 4.70935e-5 * day_number;   // longitude of perihelion
    let a = 1;                                    // mean distance, a.u.
    let e = 0.016709 - 1.151e-9 * day_number;     // eccentricity
    let M = 356.0470 + 0.9856002585 * day_number; // mean anomaly
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number; // obliquity of the eliptic
    let L = w + M;                // sun's mean longitude
    L = Math.revolveDegree(L);
    // sun's eccentric anomaly
    let E = M + (180/Math.PI) * e * Math.sind(M) * (1 + e * Math.cosd(M));
    // sun's rectrangular coordinates
    let x = Math.cosd(E) - e;
    let y = Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // sun's longitude
    let lon = v + w;
    lon = Math.revolveDegree(lon);
    // sun's ecliptic rectangular coordinates
    let x1 = r * Math.cosd(lon);
    let y1 = r * Math.sind(lon);
    let z1 = 0;
    return {
        x1: x1,
        y1: y1,
        z1: z1, 
        oblecl: oblecl,
        L: L,    
    };
}

// planets
export function mercury (day_number, latitude, longitude, UT) {
    let N =  48.3313 + 3.24587e-5   * day_number;   // (Long of asc. node)
    let i =   7.0047 + 5.00e-8      * day_number;   // (Inclination)
    let w =  29.1241 + 1.01444e-5   * day_number;   // (Argument of perihelion)
    let a = 0.387098;                               // (Semi-major axis)
    let e = 0.205635 + 5.59e-10     * day_number;   // (Eccentricity)
    let M = 168.6562 + 4.0923344368 * day_number;   // (Mean anonaly)
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number;   // obliquity of the eliptic

    let E = eccentricAnomaly(M, e, 0.0005);
    // mercury's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // mercury's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) *
        Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) *
        Math.sind(v+w) * Math.cosd(i));
    let zeclip = r * Math.sind(v+w) * Math.sind(i);
    // add sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    let xgeoc = sr.x1 + xeclip;
    let ygeoc = sr.y1 + yeclip;
    let zgeoc = sr.z1 + zeclip;
    // rotate the equitorial coordinates
    let xequat = xgeoc;
    let yequat = ygeoc * Math.cosd(oblecl) - zgeoc * Math.sind(oblecl);
    let zequat = ygeoc * Math.sind(oblecl) + zgeoc * Math.cosd(oblecl);
    // convert to right_ascension and declination
    let right_ascension = Math.atan2d(yequat, xequat);
    right_ascension = Math.revolveDegree(right_ascension);
    right_ascension = right_ascension/15;
    let declination = Math.atan2d(zequat, Math.sqrt(Math.pow(xequat, 2)
        + Math.pow(yequat, 2)));
    let distance = Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2) +
        Math.pow(zequat,2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    // convert to azimuth and altitude
    let hour_angle = sidtime(day_number, longitude, UT) - right_ascension;
    hour_angle = Math.revolveHourAngle(hour_angle);
    hour_angle = hour_angle * 15;
    x = Math.cosd(hour_angle) * Math.cosd(declination);
    y = Math.sind(hour_angle) * Math.cosd(declination);
    let z = Math.sind(declination);
    let x_horizon = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let y_horizon = y;
    let z_horizon = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(y_horizon,x_horizon) + 180;
    let altitude = Math.atan2d(z_horizon, Math.sqrt(Math.pow(x_horizon, 2) 
        + Math.pow(y_horizon, 2))); 
    return{
        ra: right_ascension,
        decl: declination,
        dist: distance,
        alt: altitude,
        az: azimuth,
    };
}

export function venus (day_number, latitude, longitude, UT) {
    let N =  76.6799 + 2.46590e-5   * day_number;
    let i =   3.3946 + 2.75e-8      * day_number;
    let w =  54.8910 + 1.38374e-5   * day_number;
    let a = 0.723330;               
    let e = 0.006773     - 1.302e-9 * day_number;
    let M =  48.0052 + 1.6021302244 * day_number;
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number; // obliquity of the eliptic
    
    let E = eccentricAnomaly(M, e, 0.0005);
    // venus's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // venus's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) *
        Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) *
        Math.sind(v+w) * Math.cosd(i));
    let zeclip = r * Math.sind(v+w) * Math.sind(i);
    // add sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    let xgeoc = sr.x1 + xeclip;
    let ygeoc = sr.y1 + yeclip;
    let zgeoc = sr.z1 + zeclip;
    // rotate the equitorial coordinates
    let xequat = xgeoc;
    let yequat = ygeoc * Math.cosd(oblecl) - zgeoc * Math.sind(oblecl);
    let zequat = ygeoc * Math.sind(oblecl) + zgeoc * Math.cosd(oblecl);
    // convert to right_ascension and declination
    let right_ascension = Math.atan2d(yequat, xequat);
    right_ascension = Math.revolveDegree(right_ascension);
    right_ascension = right_ascension/15;
    let declination = Math.atan2d(zequat, Math.sqrt(Math.pow(xequat, 2) 
        + Math.pow(yequat, 2)));
    let distance = Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2) 
        + Math.pow(zequat, 2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(Math.pow(xeclip, 2) 
        + Math.pow(yeclip, 2)));
    // convert to azimuth and altitude
    let hour_angle = sidtime(day_number, longitude, UT) - right_ascension;
    hour_angle = Math.revolveHourAngle(hour_angle);
    hour_angle = hour_angle * 15;
    x = Math.cosd(hour_angle) * Math.cosd(declination);
    y = Math.sind(hour_angle) * Math.cosd(declination);
    let z = Math.sind(declination);
    let x_horizon = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let y_horizon = y;
    let z_horizon = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(y_horizon,x_horizon) + 180;
    let altitude = Math.atan2d(z_horizon, Math.sqrt(Math.pow(x_horizon, 2) 
        + Math.pow(y_horizon, 2)));
    return{
        ra: right_ascension,
        decl: declination,
        dist: distance,
        alt: altitude,
        az: azimuth,
    };
}

export function uranus (day_number, latitude, longitude) {
    let N =  74.0005 + 1.3978E-5    * day_number;  // Long of asc. node
    let i =   0.7733 + 1.9E-8       * day_number;  // Inclination
    let w =  96.6612 + 3.0565E-5    * day_number;  // Argument of perihelion
    let a = 19.18171 - 1.55E-8      * day_number;  // Semi-major axis
    let e = 0.047318 + 7.45E-9      * day_number;  // eccentricity
    let M = 142.5905 + 0.011725806  * day_number;  // Mean anomaly Uranus
    M = Math.revolveDegree(M);
    let Mu = M;
    let Ms = 316.9670 + 0.0334442282 * day_number; // Mean anomaly Saturn
    Ms = Math.revolveDegree(Ms);
    let Mj =  19.8950 + 0.0830853001 * day_number; // Mean anomaly Jupiter
    Mj = Math.revolveDegree(Mj);
    let oblecl = 23.4393 - 3.563e-7 * day_number;  // obliquity of the eliptic

    let E = eccentricAnomaly(M, e, 0.0005);
    // uranus's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // uranus's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) *
        Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) *
        Math.sind(v+w) * Math.cosd(i));
    let zeclip = r * Math.sind(v+w) * Math.sind(i);
    // add sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    let xgeoc = sr.x1 + xeclip;
    let ygeoc = sr.y1 + yeclip;
    let zgeoc = sr.z1 + zeclip;
    // rotate the equitorial coordinates
    let xequat = xgeoc;
    let yequat = ygeoc * Math.cosd(oblecl) - zgeoc * Math.sind(oblecl);
    let zequat = ygeoc * Math.sind(oblecl) + zgeoc * Math.cosd(oblecl);
    // convert to right_ascension and declination
    let right_ascension = Math.atan2d(yequat, xequat);
    right_ascension = Math.revolveDegree(right_ascension);
    right_ascension = right_ascension / 15;
    let declination = Math.atan2d(zequat, 
        Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2)));
    let distance = Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2) 
        + Math.pow(zequat, 2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(Math.pow(xeclip, 2) + 
        Math.pow(yeclip, 2)));
    let perturbations_in_longitude = +0.040 * Math.sind(Ms - 2*Mu + 6)
                        +0.035 * Math.sind(Ms - 3*Mu + 33) 
                        -0.015 * Math.sind(Mj - Mu + 20);
    lon = perturbations_in_longitude + lon;
    lon = Math.revolveDegree(lon);
    // convert to azimuth and altitude
    let hour_angle = sidtime(day_number, longitude) - right_ascension;
    hour_angle = Math.revolveHourAngle(hour_angle);
    hour_angle = hour_angle * 15;
    x = Math.cosd(hour_angle)*Math.cosd(declination);
    y = Math.sind(hour_angle)*Math.cosd(declination);
    let z = Math.sind(declination);
    let x_horizon = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let y_horizon = y;
    let z_horizon = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(y_horizon,x_horizon) + 180;
    let altitude = Math.atan2d(z_horizon, 
        Math.sqrt(Math.pow(x_horizon, 2) + Math.pow(y_horizon, 2)));
    return{
        ra: right_ascension,
        decl: declination,
        dist: distance,
        alt: altitude,
        az: azimuth,
    };
}
