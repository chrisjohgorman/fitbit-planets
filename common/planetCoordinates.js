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

// sun and moon
export function sun (day_number, latitude, longitude) {
    // rotate equitorial coordinates
    let sr = sunRectangular(day_number);
    let xequat = sr.x1;
    let yequat = sr.y1 * Math.cosd(sr.oblecl) - sr.z1 * Math.sind(sr.oblecl);
    let zequat = sr.y1 * Math.sind(sr.oblecl) - sr.z1 * Math.cosd(sr.oblecl);

    let right_ascension = Math.atan2d(yequat, xequat);
    right_ascension = Math.revolveDegree(right_ascension);
    // convert right_ascension to hours
    right_ascension = right_ascension / 15;
    let declination = Math.atan2d(zequat,
        Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2)));
    let distance = Math.sqrt(Math.pow(xequat, 2) +
        Math.pow(yequat, 2) + Math.pow(zequat, 2));
    
    // calculate hour angle
    let hour_angle = (sidtime(day_number, longitude) - right_ascension) * 15;

    // convert hour_angle and declination to rectangular system
    let x2 = Math.cosd(hour_angle) * Math.cosd(declination);
    let y2 = Math.sind(hour_angle) * Math.cosd(declination);
    let z2 = Math.sind(declination);

    // rotate this along the y2 axis
    let xhor = x2 * Math.sind(latitude) - z2 * Math.cosd(latitude);
    let yhor = y2;
    let zhor = x2 * Math.cosd(latitude) + z2 * Math.sind(latitude);

    // finally calculate azimuth and altitude 
    let azimuth = Math.atan2d(yhor, xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(xhor, 2)
        + Math.pow(yhor, 2)));
    return{
        ra: right_ascension,
        decl: declination,
        dist: distance,
        alt: altitude,
        az: azimuth,
    };
}

export function moon (day_number, latitude, longitude, UT) {
    let N = 125.1228 - 0.0529538083 * day_number;  // long asc. node
    let i = 5.1454;                                // inclination
    let w = 318.0634 + 0.1643573223 * day_number;  // Arg. of perigree
    let a = 60.2666;                               // mean distance
    let e = 0.054900;                              // eccentricity
    let M = 115.3654 + 13.0649929509 * day_number; // mean anomaly
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number;  // obliquity of the eliptic
    let E = eccentricAnomaly(M, e, 0.0005);
    // moon's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let distance = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // moon's position in ecliptic coordinates
    let xeclip = distance * ( Math.cosd(N) * Math.cosd(v+w) -
        Math.sind(N) * Math.sind(v+w) * Math.cosd(i));
    let yeclip = distance * ( Math.sind(N) * Math.cosd(v+w) +
        Math.cosd(N) * Math.sind(v+w) * Math.cosd(i));
    let zeclip = distance * Math.sind(v+w) * Math.sind(i);
    // convert to ecliptic longitude, latitude and distance
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    let Sw = 282.9404 + 4.70935e-5   * day_number; // sun's (longitude of 
                                                   // perihelion)
    let Ms = 356.0470 + 0.9856002585 * day_number; // sun's mean anomaly
    let Ls = Sw + Ms;
    Ls = Math.revolveDegree(Ls);
    let Lm = N + w + M;
    let Mm = M;
    let D = Lm - Ls;
    let F = Lm - N;

    let perturbations_in_longitude = -1.274 * Math.sind(Mm - 2*D) 
                     +0.658 * Math.sind(2*D)  
                     -0.186 * Math.sind(Ms) 
                     -0.059 * Math.sind(2*Mm - 2*D) 
                     -0.057 * Math.sind(Mm - 2*D + Ms)  
                     +0.053 * Math.sind(Mm + 2*D) 
                     +0.046 * Math.sind(2*D - Ms)  
                     +0.041 * Math.sind(Mm - Ms) 
                     -0.035 * Math.sind(D) 
                     -0.031 * Math.sind(Mm + Ms) 
                     -0.015 * Math.sind(2*F - 2*D)  
                     +0.011 * Math.sind(Mm - 4*D);
    let perturbations_in_latitude = -0.173 * Math.sind(F - 2*D) 
                    -0.055 * Math.sind(Mm - F - 2*D) 
                    -0.046 * Math.sind(Mm + F - 2*D) 
                    +0.033 * Math.sind(F + 2*D) 
                    +0.017 * Math.sind(2*Mm + F);
    let perturbations_in_distance = -0.58 * Math.cosd(Mm - 2*D) 
                        -0.46 * Math.cosd(2*D);
    lon = lon + perturbations_in_longitude;
    lat = lat + perturbations_in_latitude;
    distance = distance + perturbations_in_distance;
    let x1 = Math.cosd(lon) * Math.cosd(lat);
    let y1 = Math.cosd(lat) * Math.sind(lon);
    let z1 = Math.sind(lat);
    let x2 = x1;
    let y2 = y1 * Math.cosd(oblecl) - z1 * Math.sind(oblecl);
    let z2 = y1 * Math.sind(oblecl) + z1 * Math.cosd(oblecl);
    let right_ascension = Math.atan2d(y2,x2);
    let right_ascension1 = right_ascension;
    right_ascension = right_ascension / 15;
    right_ascension = Math.revolveHourAngle(right_ascension);
    let declination = Math.atan2d(z2, Math.sqrt(x2*x2 + y2*y2));
    let hour_angle = (sidtime(day_number, longitude, UT) - right_ascension) * 15;
    hour_angle = Math.revolveDegree(hour_angle);
    x = Math.cosd(hour_angle) * Math.cosd(declination);
    y = Math.sind(hour_angle) * Math.cosd(declination);
    let z = Math.sind(declination);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth  = Math.atan2d( yhor, xhor ) + 180;
    let altitude = Math.atan2d( zhor , Math.sqrt(xhor*xhor + yhor*yhor));
    let mpar = Math.asind(1/distance);
    let gclat = latitude - 0.1924 * Math.sind(2*latitude);
    let rho   = 0.99833 + 0.00167 * Math.cosd(2*latitude);
    let g = Math.atand(Math.tand(gclat) / Math.cosd(hour_angle));
    let topocentric_right_ascension   = right_ascension1  
        - mpar * rho * Math.cosd(gclat) 
        * Math.sind(hour_angle) / Math.cosd(declination);
    topocentric_right_ascension = 
        Math.revolveDegree(topocentric_right_ascension);
    let topocentric_declination = declination 
        - mpar * rho * Math.sind(gclat) * Math.sind(g - declination) /
          Math.sind(g);
    return{
        ra: topocentric_right_ascension,
        decl: topocentric_declination,
        dist: distance,
        alt: altitude,
        az: azimuth,
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

export function mars (day_number, latitude, longitude, UT) {
    let N =  49.5574 + 2.11081e-5   * day_number;
    let i =   1.8497 - 1.78e-8      * day_number;
    let w = 286.5016 + 2.92961e-5   * day_number;
    let a = 1.523688;               
    let e = 0.093405     + 2.516e-9 * day_number;
    let M =  18.6021 + 0.5240207766 * day_number;
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number; // obliquity of the eliptic

    let E = eccentricAnomaly(M, e, 0.0005);
    // mars's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // mars's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) 
        - Math.sind(N) * Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) 
        + Math.cosd(N) * Math.sind(v+w) * Math.cosd(i));
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
        Math.sqrt(xequat*xequat + yequat*yequat));
    let distance = Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2)
        + Math.pow(zequat, 2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(longitude);
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

export function jupiter (day_number, latitude, longitude, UT) {
    let N = 100.4542 + 2.76854e-5   * day_number;  // Long of asc. node
    let i =   1.3030 - 1.557e-7     * day_number;  // Inclination
    let w = 273.8777 + 1.64505e-5   * day_number;  // Argument of perihelion
    let a = 5.20256;                   // Semi-major axis
    let e = 0.048498 + 4.469e-9     * day_number;  // eccentricity
    let M =  19.8950 + 0.0830853001 * day_number;  // Mean anomaly Jupiter
    M = Math.revolveDegree(M);
    let Mj = M;
    let Ms = 316.9670 + 0.0334442282 * day_number; // Mean anomaly Saturn
    Ms = Math.revolveDegree(Ms);
    let Mu = 142.5905 + 0.011725806 * day_number;  // Mean anomaly Uranus
    Mu = Math.revolveDegree(Mu);
    let oblecl = 23.4393 - 3.563e-7 * day_number;  // obliquity of the eliptic
    
    let E = eccentricAnomaly(M, e, 0.0005);
    // jupiter's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // jupiter's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) * Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) * Math.sind(v+w) * Math.cosd(i));
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
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip +
        yeclip*yeclip));
    let perturbations_of_longitude = -0.332 * Math.sind(2*Mj - 5*Ms - 67.6) 
                     -0.056 * Math.sind(2*Mj - 2*Ms + 21) 
                     +0.042 * Math.sind(3*Mj - 5*Ms + 21) 
                     -0.036 * Math.sind(Mj - 2*Ms) 
                     +0.022 * Math.cosd(Mj - Ms) 
                     +0.023 * Math.sind(2*Mj - 3*Ms + 52) 
                     -0.016 * Math.sind(Mj - 5*Ms - 69);
    lon = lon + perturbations_of_longitude;
    lon = Math.revolveDegree(lon);
    // convert to azimuth and altitude
    let hour_angle = sidtime(day_number, longitude, UT) - right_ascension;
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

export function saturn (day_number, latitude, longitude) {
    let N = 113.6634 + 2.38980E-5   * day_number; // Long of asc. node
    let i =   2.4886 - 1.081E-7     * day_number; // Inclination
    let w = 339.3939 + 2.97661E-5   * day_number; // Argument of perihelion
    let a = 9.55475;                      // Semi-major axis
    let e = 0.055546 - 9.499E-9     * day_number; // eccentricity
    let M = 316.9670 + 0.0334442282 * day_number; // Mean anomaly
    M = Math.revolveDegree(M);
    let Ms = M;
    let Mj = 19.8950 + 0.0830853001 * day_number; // Mean anomaly Jupiter
    Mj = Math.revolveDegree(Mj);
    let Mu = 142.5905 + 0.011725806 * day_number; // Mean anomaly Uranus
    Mu = Math.revolveDegree(Mu);
    let oblecl = 23.4393 - 3.563e-7 * day_number; // obliquity of the eliptic

    let E = eccentricAnomaly(M, e, 0.0005);
    // saturn's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // saturn's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) * Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) * Math.sind(v+w) * Math.cosd(i));
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
    let declination = Math.atan2d(zequat, Math.sqrt(xequat*xequat + yequat*yequat));
    let distance = Math.sqrt(Math.pow(xequat, 2) + Math.pow(yequat, 2) 
        + Math.pow(zequat, 2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    let perturbations_in_longitude = 0.812 * Math.sind(2*Mj - 5*Ms - 67.6) 
                    -0.229 * Math.cosd(2*Mj - 4*Ms - 2) 
                    +0.119 * Math.sind(Mj - 2*Ms - 3) 
                    +0.046 * Math.sind(2*Mj - 6*Ms - 69)  
                    +0.014 * Math.sind(Mj - 3*Ms + 32); 
    let perturbations_in_latitude = -0.020 * Math.cosd(2*Mj - 4*Ms - 2) 
                    +0.018 * Math.sind(2*Mj - 6*Ms - 49);
    lon = lon + perturbations_in_longitude;
    lon = Math.revolveDegree(lon);
    lat = lat + perturbations_in_latitude;
    lat = Math.revolveDegree(lat);
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

export function neptune (day_number, latitude, longitude) {
    let N = 131.7806 + 3.0173E-5    * day_number;
    let i =   1.7700 - 2.55E-7      * day_number;
    let w = 272.8461 - 6.027E-6     * day_number;
    let a = 30.05826 + 3.313E-8     * day_number;
    let e = 0.008606 + 2.15E-9      * day_number;
    let M = 260.2471 + 0.005995147  * day_number;
    M = Math.revolveDegree(M);
    let oblecl = 23.4393 - 3.563e-7 * day_number; // obliquity of the eliptic
    
    let E = eccentricAnomaly(M, e, 0.0005);
    // neptune's rectrangular coordinates
    let x = a * (Math.cosd(E) - e);
    let y = a * Math.sind(E) * Math.sqrt(1 - e*e);
    // convert to distance and true anomaly
    let r = Math.sqrt(x*x + y*y);
    let v = Math.atan2d(y, x);
    // neptune's position in ecliptic coordinates
    let xeclip = r * ( Math.cosd(N) * Math.cosd(v+w) - Math.sind(N) * Math.sind(v+w) * Math.cosd(i));
    let yeclip = r * ( Math.sind(N) * Math.cosd(v+w) + Math.cosd(N) * Math.sind(v+w) * Math.cosd(i));
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
    let distance = Math.sqrt(Math.pow(xequat, 2) +
        Math.pow(yequat, 2) + Math.pow(zequat, 2));
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
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

export function pluto (day_number, latitude, longitude) {
    let S  =   50.03  +  0.033459652 * day_number;
    let P  =  238.95  +  0.003968789 * day_number;
    let lonecl = 238.9508  +  0.00400703 * day_number 
            - 19.799 * Math.sind(P)     + 19.848 * Math.cosd(P) 
             + 0.897 * Math.sind(2*P)    - 4.956 * Math.cosd(2*P) 
             + 0.610 * Math.sind(3*P)    + 1.211 * Math.cosd(3*P) 
             - 0.341 * Math.sind(4*P)    - 0.190 * Math.cosd(4*P) 
             + 0.128 * Math.sind(5*P)    - 0.034 * Math.cosd(5*P) 
             - 0.038 * Math.sind(6*P)    + 0.031 * Math.cosd(6*P) 
             + 0.020 * Math.sind(S-P)    - 0.010 * Math.cosd(S-P);
    let latecl =  -3.9082 
             - 5.453 * Math.sind(P)     - 14.975 * Math.cosd(P) 
             + 3.527 * Math.sind(2*P)    + 1.673 * Math.cosd(2*P) 
             - 1.051 * Math.sind(3*P)    + 0.328 * Math.cosd(3*P) 
             + 0.179 * Math.sind(4*P)    - 0.292 * Math.cosd(4*P) 
             + 0.019 * Math.sind(5*P)    + 0.100 * Math.cosd(5*P) 
             - 0.031 * Math.sind(6*P)    - 0.026 * Math.cosd(6*P) 
                                   + 0.011 * Math.cosd(S-P);
    let r     =  40.72 
           + 6.68 * Math.sind(P)       + 6.90 * Math.cosd(P) 
           - 1.18 * Math.sind(2*P)     - 0.03 * Math.cosd(2*P) 
           + 0.15 * Math.sind(3*P)     - 0.14 * Math.cosd(3*P);

    let xh = r * Math.cosd(lonecl) * Math.cosd(latecl);
    let yh = r * Math.sind(lonecl) * Math.cosd(latecl);
    let zh = r               * Math.sind(latecl);

    let sr = sunRectangular(day_number); 

    let xg = xh + sr.x1;
    let yg = yh + sr.y1;
    let zg = zh;

    let xe = xg;
    let ye = yg * Math.cosd(sr.oblecl) - zg * Math.sind(sr.oblecl);
    let ze = yg * Math.sind(sr.oblecl) + zg * Math.cosd(sr.oblecl);

    let right_ascension  = Math.atan2d( ye, xe );
    right_ascension  = Math.revolveDegree(right_ascension);
    right_ascension = right_ascension/15; 
    let declination = Math.atan2d( ze, Math.sqrt(xe*xe+ye*ye) );
    let distance = Math.sqrt(xe*xe+ye*ye+ze*ze);

    // convert to azimuth and altitude
    let hour_angle = sidtime(day_number, longitude) - right_ascension;
    hour_angle = Math.revolveHourAngle(hour_angle);
    hour_angle = hour_angle * 15;
    let x = Math.cosd(hour_angle)*Math.cosd(declination);
    let y = Math.sind(hour_angle)*Math.cosd(declination);
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

// Rise and Set times for Celestial Bodies
export function sunRiseSet (year, month, day, latitude, longitude) {
    let h = -0.833;
    let d = dayNumber(year, month, day);
    let sr = sunRectangular(d);
    let sun1 = sun(d, latitude, longitude);
    let GMST0 = (sr.L + 180) / 15;
    let UT_Sun_in_south = sun1.ra - (sr.L+180)/15 - longitude/15.0;
    UT_Sun_in_south = Math.revolveHourAngle(UT_Sun_in_south);
    let cos_lha = (Math.sind(h) -
      Math.sind(latitude)*Math.sind(sun1.decl))/(Math.cosd(latitude) *
      Math.cosd(sun1.decl));
    if (cos_lha > 1) {
        throw "Sun is always below our altitude limit.";
    }
    else if (cos_lha < -1) {
        throw "Sun is always above our altitude limit.";
    }
    let LHA = Math.acosd(cos_lha)/15;
    let time = new Date();
    let srise = UT_Sun_in_south - LHA - time.getTimezoneOffset()/60;
    let sset = UT_Sun_in_south + LHA - time.getTimezoneOffset()/60;
    let srHours = Math.floor(srise);
    if (srHours < 10) {
      srHours = "0" + srHours;
    }
    let srMinutes = Math.round((srise % 1)*100)/100;
    let srTime = srHours + ':' + Math.floor(srMinutes * 60);
    let ssHours = Math.floor(sset);
    let ssMinutes = Math.round((sset % 1)*100)/100;
    let ssTime = ssHours + ':' + Math.floor(ssMinutes * 60);
    return{
      sr: srTime,
      ss: ssTime,
    }
}
