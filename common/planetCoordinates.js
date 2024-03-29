/*
Fitbit planets, calculates the position of the planets in our solar
system and their rise and set times based on the user's GPS
location.

Copyright (C) 2021  Chris Gorman

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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
        lonsun: lon,
        rs: r,
    };
}

// sun and moon
export function sun (day_number, latitude, longitude, UT) {
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
        Math.sqrt(Math.pow(Math.abs(xequat), 2) + Math.pow(Math.abs(yequat), 2)));
    let distance = Math.sqrt(Math.pow(Math.abs(xequat), 2) +
        Math.pow(Math.abs(yequat), 2) + Math.pow(Math.abs(zequat), 2));
    
    // calculate hour angle
    let hour_angle = (sidtime(day_number, longitude, UT) - right_ascension) * 15;

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
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2)
        + Math.pow(Math.abs(yhor), 2)));

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
    let alt_geoc = altitude - mpar * Math.cosd(altitude);
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
        alt: alt_geoc,
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
    // sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2))); 
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
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
    //  sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
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
    // sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
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
    // sun's rectangular coordinates
    let sr = sunRectangular(day_number);
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
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
        alt: altitude,
        az: azimuth,
    };
}

export function saturn (day_number, latitude, longitude, UT) {
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
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
        alt: altitude,
        az: azimuth,
    };
}

export function uranus (day_number, latitude, longitude, UT) {
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
    // sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(Math.pow(Math.abs(xeclip), 2) + 
        Math.pow(Math.abs(yeclip), 2)));
    let perturbations_in_longitude = +0.040 * Math.sind(Ms - 2*Mu + 6)
                        +0.035 * Math.sind(Ms - 3*Mu + 33) 
                        -0.015 * Math.sind(Mj - Mu + 20);
    lon = perturbations_in_longitude + lon;
    lon = Math.revolveDegree(lon);
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
        alt: altitude,
        az: azimuth,
    };
}

export function neptune (day_number, latitude, longitude, UT) {
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
    // sun's rectangular coordinates
    let sr = sunRectangular(day_number);
    // convert to ecliptic longitude and latitude
    let lon = Math.atan2d(yeclip, xeclip);
    lon = Math.revolveDegree(lon);
    let lat = Math.atan2d(zeclip, Math.sqrt(xeclip*xeclip + yeclip*yeclip));
    // use lat and lon to produce RA and Dec
    let xh = r * Math.cosd(lon) * Math.cosd(lat);
    let yh = r * Math.sind(lon) * Math.cosd(lat);
    let zh = r * Math.sind(lat);
    // convert sun's position
    let xs = sr.rs * Math.cosd(sr.lonsun);
    let ys = sr.rs * Math.sind(sr.lonsun);
    // convert from heliocentric to geocentric
    let xg = xh + xs;
    let yg = yh + ys;
    let zg = zh;
    // convert to equitorial
    let xe = xg;
    let ye = yg * Math.cosd(oblecl) - zg * Math.sind(oblecl);
    let ze = yg * Math.sind(oblecl) + zg * Math.cosd(oblecl);
    // RA and Decl
    let RA = Math.atan2d(ye, xe);
    RA = Math.revolveDegree(RA);
    RA = RA/15;
    let Dec = Math.atan2d(ze, Math.sqrt(xe*xe+ye*ye));
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);
    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    x = Math.cosd(HA) * Math.cosd(Dec);
    y = Math.sind(HA) * Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor, Math.sqrt(Math.pow(Math.abs(xhor), 2) 
        + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
        alt: altitude,
        az: azimuth,
    };
}

export function pluto (day_number, latitude, longitude, UT) {
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

    let RA  = Math.atan2d( ye, xe );
    RA  = Math.revolveDegree(RA);
    RA = RA/15; 
    let Dec = Math.atan2d( ze, Math.sqrt(xe*xe+ye*ye) );
    let rg = Math.sqrt(xe*xe+ye*ye+ze*ze);

    // convert to azimuth and altitude
    let HA = sidtime(day_number, longitude, UT) - RA;
    HA = HA * 15;
    HA = Math.revolveDegree(HA);
    let x = Math.cosd(HA)*Math.cosd(Dec);
    let y = Math.sind(HA)*Math.cosd(Dec);
    let z = Math.sind(Dec);
    let xhor = x * Math.sind(latitude) - z * Math.cosd(latitude);
    let yhor = y;
    let zhor = x * Math.cosd(latitude) + z * Math.sind(latitude);
    let azimuth = Math.atan2d(yhor,xhor) + 180;
    let altitude = Math.atan2d(zhor,
        Math.sqrt(Math.pow(Math.abs(xhor), 2) + Math.pow(Math.abs(yhor), 2)));
    return{
        ra: RA,
        decl: Dec,
        dist: rg,
        alt: altitude,
        az: azimuth,
    };
}

// Helper functions for Rise and Set times
export function decimalToHM (time) {
  let decimalTime = time;
  if (decimalTime < 0) {
    decimalTime = decimalTime + 24;
  }
  let hours = addZero(Math.floor(decimalTime) % 24);
  let minutes = addZero(Math.floor((Math.round((decimalTime % 1)*100)/100)*60));
  let formatted = hours + ":" + minutes;
  return (formatted);
}

export function addZero (n) {
  return (n < 10 ? '0' : '') + n;
}

// Rise and Set times for Celestial Bodies
export function sunRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let sun1 = sun(d, latitude, longitude, UT);
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
  let srTime = decimalToHM(srise);
  let ssTime = decimalToHM(sset);
  return{
    rise: srTime,
    set: ssTime,
  }
}

export function mercriset (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Mercury = mercury(d, latitude, longitude, UT);
  let UT_Planet_in_south = Mercury.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Mercury.decl))/(Math.cosd(latitude) *
    Math.cosd(Mercury.decl));
  if (cos_lha > 1) {
    throw "Mercury is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Mercury is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
      
  let mercuryrise = UT_Planet_in_south - LHA;
  let mercuryset = UT_Planet_in_south + LHA;
  return{
    rise: mercuryrise, 
    set: mercuryset,
  }
}

export function mercuryRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Mercury = mercury(d, latitude, longitude, UT);
  let UT_Mercury_in_south = Mercury.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Mercury_in_south = Math.revolveHourAngle(UT_Mercury_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Mercury.decl))/(Math.cosd(latitude) *
    Math.cosd(Mercury.decl));
  if (cos_lha > 1) {
    throw "Mercury is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Mercury is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let mercuryrise = UT_Mercury_in_south - LHA;
  let mr1 = mercriset(year,month,day,mercuryrise,latitude,longitude);
  let mr2 = mercriset(year,month,day,mr1.rise,latitude,longitude);
  let mr3 = mercriset(year,month,day,mr2.rise,latitude,longitude);
  let mr4 = mercriset(year,month,day,mr3.rise,latitude,longitude);
  let mr5 = mercriset(year,month,day,mr4.rise,latitude,longitude);
  mercuryrise = mr5.rise - time.getTimezoneOffset()/60;
  mercuryrise = decimalToHM(mercuryrise);
  let mercuryset = UT_Mercury_in_south + LHA;
  let ms1 = mercriset(year,month,day,mercuryset,latitude,longitude);
  let ms2 = mercriset(year,month,day,ms1.set,latitude,longitude);
  let ms3 = mercriset(year,month,day,ms2.set,latitude,longitude);
  let ms4 = mercriset(year,month,day,ms3.set,latitude,longitude);
  let ms5 = mercriset(year,month,day,ms4.set,latitude,longitude);
  mercuryset = ms5.set - time.getTimezoneOffset()/60;
  mercuryset = decimalToHM(mercuryset);
  return {
    rise: mercuryrise,
    set: mercuryset,
  }
}

export function vriset (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Venus = venus(d, latitude, longitude, UT);
  let UT_Planet_in_south = Venus.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Venus.decl))/(Math.cosd(latitude) *
    Math.cosd(Venus.decl));
  if (cos_lha > 1) {
    throw "Venus is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Venus is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
      
  let venusrise = UT_Planet_in_south - LHA;
  let venusset = UT_Planet_in_south + LHA;
  return{
    rise: venusrise, 
    set: venusset,
  }
}

export function venusRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Venus = venus(d, latitude, longitude, UT);
  let UT_Venus_in_south = Venus.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Venus_in_south = Math.revolveHourAngle(UT_Venus_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Venus.decl))/(Math.cosd(latitude) *
    Math.cosd(Venus.decl));
  if (cos_lha > 1) {
    throw "Venus is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Venus is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let venusrise = UT_Venus_in_south - LHA;
  let mr1 = vriset(year,month,day,venusrise,latitude,longitude);
  let mr2 = vriset(year,month,day,mr1.rise,latitude,longitude);
  let mr3 = vriset(year,month,day,mr2.rise,latitude,longitude);
  let mr4 = vriset(year,month,day,mr3.rise,latitude,longitude);
  let mr5 = vriset(year,month,day,mr4.rise,latitude,longitude);
  venusrise = mr5.rise - time.getTimezoneOffset()/60;
  venusrise = decimalToHM(venusrise);
  let venusset = UT_Venus_in_south + LHA;
  let ms1 = vriset(year,month,day,venusset,latitude,longitude);
  let ms2 = vriset(year,month,day,ms1.set,latitude,longitude);
  let ms3 = vriset(year,month,day,ms2.set,latitude,longitude);
  let ms4 = vriset(year,month,day,ms3.set,latitude,longitude);
  let ms5 = vriset(year,month,day,ms4.set,latitude,longitude);
  venusset = ms5.set - time.getTimezoneOffset()/60;
  venusset = decimalToHM(venusset);
  return {
    rise: venusrise,
    set: venusset,
  }
}

export function mriset (year, month, day, UT, latitude, longitude) {
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Moon = moon(d, latitude, longitude, UT);
  let mpar = Math.asind(1/Moon.dist);
  let GMST0 = (sr.L + 180);
  let UT_Planet_in_south = Moon.ra/15 - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(-mpar) -
    Math.sind(latitude)*Math.sind(Moon.decl))/(Math.cosd(latitude) *
    Math.cosd(Moon.decl));
  if (cos_lha > 1) {
    throw "Moon is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Moon is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
      
  let moonrise = UT_Planet_in_south - LHA;
  let moonset = UT_Planet_in_south + LHA;
  return{
    rise: moonrise, 
    set: moonset,
  }
}

export function moonRiseSet (year, month, day, UT, latitude, longitude) {
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Moon = moon(d, latitude, longitude, UT);
  let mpar = Math.asind(1/Moon.dist);
  let GMST0 = (sr.L + 180);
  let UT_Moon_in_south = Moon.ra/15 - (sr.L+180)/15 - longitude/15.0;
  UT_Moon_in_south = Math.revolveHourAngle(UT_Moon_in_south);
  let cos_lha = (Math.sind(-mpar) -
    Math.sind(latitude)*Math.sind(Moon.decl))/(Math.cosd(latitude) *
    Math.cosd(Moon.decl));
  if (cos_lha > 1) {
    throw "Moon is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Moon is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let moonrise = UT_Moon_in_south - LHA;
  let mr1 = mriset(year,month,day,moonrise,latitude,longitude);
  let mr2 = mriset(year,month,day,mr1.rise,latitude,longitude);
  let mr3 = mriset(year,month,day,mr2.rise,latitude,longitude);
  let mr4 = mriset(year,month,day,mr3.rise,latitude,longitude);
  let mr5 = mriset(year,month,day,mr4.rise,latitude,longitude);
  moonrise = mr5.rise - time.getTimezoneOffset()/60;
  moonrise = decimalToHM(moonrise);
  let moonset = UT_Moon_in_south + LHA;
  let ms1 = mriset(year,month,day,moonset,latitude,longitude);
  let ms2 = mriset(year,month,day,ms1.set,latitude,longitude);
  let ms3 = mriset(year,month,day,ms2.set,latitude,longitude);
  let ms4 = mriset(year,month,day,ms3.set,latitude,longitude);
  let ms5 = mriset(year,month,day,ms4.set,latitude,longitude);
  moonset = ms5.set - time.getTimezoneOffset()/60;
  moonset = decimalToHM(moonset);
  return {
    rise: moonrise,
    set: moonset,
  }
}

export function mariset (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Mars = mars(d, latitude, longitude, UT);
  let UT_Planet_in_south = Mars.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Mars.decl))/(Math.cosd(latitude) *
    Math.cosd(Mars.decl));
  if (cos_lha > 1) {
    throw "Mars is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Mars is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
      
  let marsrise = UT_Planet_in_south - LHA;
  let marsset = UT_Planet_in_south + LHA;
  return{
    rise: marsrise, 
    set: marsset,
  }
}

export function marsRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Mars = mars(d, latitude, longitude, UT);
  let UT_Mars_in_south = Mars.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Mars_in_south = Math.revolveHourAngle(UT_Mars_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Mars.decl))/(Math.cosd(latitude) *
    Math.cosd(Mars.decl));
  if (cos_lha > 1) {
    throw "Mars is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Mars is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let marsrise = UT_Mars_in_south - LHA;
  let mr1 = mariset(year,month,day,marsrise,latitude,longitude);
  let mr2 = mariset(year,month,day,mr1.rise,latitude,longitude);
  let mr3 = mariset(year,month,day,mr2.rise,latitude,longitude);
  let mr4 = mariset(year,month,day,mr3.rise,latitude,longitude);
  let mr5 = mariset(year,month,day,mr4.rise,latitude,longitude);
  marsrise = mr5.rise - time.getTimezoneOffset()/60;
  marsrise = decimalToHM(marsrise);
  let marsset = UT_Mars_in_south + LHA;
  let ms1 = mariset(year,month,day,marsset,latitude,longitude);
  let ms2 = mariset(year,month,day,ms1.set,latitude,longitude);
  let ms3 = mariset(year,month,day,ms2.set,latitude,longitude);
  let ms4 = mariset(year,month,day,ms3.set,latitude,longitude);
  let ms5 = mariset(year,month,day,ms4.set,latitude,longitude);
  marsset = ms5.set - time.getTimezoneOffset()/60;
  marsset = decimalToHM(marsset);
  return {
    rise: marsrise,
    set: marsset,
  }
}

export function jupiterRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Jupiter = jupiter(d, latitude, longitude, UT);
  let GMST0 = (sr.L + 180) / 15;
  let UT_Planet_in_south = Jupiter.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Jupiter.decl))/(Math.cosd(latitude) *
    Math.cosd(Jupiter.decl));
  if (cos_lha > 1) {
    throw "Jupiter is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Jupiter is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let jr = UT_Planet_in_south - LHA - time.getTimezoneOffset()/60;
  let js = UT_Planet_in_south + LHA - time.getTimezoneOffset()/60;
  let jupiterrise = decimalToHM(jr);
  let jupiterset = decimalToHM(js);
  return {
    rise: jupiterrise,
    set: jupiterset,
  }
}

export function saturnRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Saturn = saturn(d, latitude, longitude, UT);
  let GMST0 = (sr.L + 180) / 15;
  let UT_Planet_in_south = Saturn.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Saturn.decl))/(Math.cosd(latitude) *
    Math.cosd(Saturn.decl));
  if (cos_lha > 1) {
    throw "Saturn is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Saturn is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let sar = UT_Planet_in_south - LHA - time.getTimezoneOffset()/60;
  let sas = UT_Planet_in_south + LHA - time.getTimezoneOffset()/60;
  let saturnrise = decimalToHM(sar);
  let saturnset = decimalToHM(sas);
  return {
    rise: saturnrise,
    set: saturnset,
  }
}

export function uranusRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Uranus = uranus(d, latitude, longitude, UT);
  let GMST0 = (sr.L + 180) / 15;
  let UT_Planet_in_south = Uranus.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Uranus.decl))/(Math.cosd(latitude) *
    Math.cosd(Uranus.decl));
  if (cos_lha > 1) {
    throw "Uranus is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Uranus is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let ur = UT_Planet_in_south - LHA - time.getTimezoneOffset()/60;
  let us = UT_Planet_in_south + LHA - time.getTimezoneOffset()/60;
  let uranusrise = decimalToHM(ur);
  let uranusset = decimalToHM(us);
  return {
    rise: uranusrise,
    set: uranusset,
  }
}

export function neptuneRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Neptune = neptune(d, latitude, longitude, UT);
  let GMST0 = (sr.L + 180) / 15;
  let UT_Planet_in_south = Neptune.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Neptune.decl))/(Math.cosd(latitude) *
    Math.cosd(Neptune.decl));
  if (cos_lha > 1) {
    throw "Neptune is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Neptune is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let nr = UT_Planet_in_south - LHA - time.getTimezoneOffset()/60;
  let ns = UT_Planet_in_south + LHA - time.getTimezoneOffset()/60;
  let neptunerise = decimalToHM(nr);
  let neptuneset = decimalToHM(ns);
  return {
    rise: neptunerise,
    set: neptuneset,
  }
}

export function plutoRiseSet (year, month, day, UT, latitude, longitude) {
  let h = -0.833;
  let d = dayNumber(year, month, day, UT);
  let sr = sunRectangular(d);
  let Pluto = pluto(d, latitude, longitude, UT);
  let GMST0 = (sr.L + 180) / 15;
  let UT_Planet_in_south = Pluto.ra - (sr.L+180)/15 - longitude/15.0;
  UT_Planet_in_south = Math.revolveHourAngle(UT_Planet_in_south);
  let cos_lha = (Math.sind(h) -
    Math.sind(latitude)*Math.sind(Pluto.decl))/(Math.cosd(latitude) *
    Math.cosd(Pluto.decl));
  if (cos_lha > 1) {
    throw "Pluto is always below our altitude limit.";
  }
  else if (cos_lha < -1) {
    throw "Pluto is always above our altitude limit.";
  }
  let LHA = Math.acosd(cos_lha)/15.04107;
  let time = new Date();
  let pr = UT_Planet_in_south - LHA - time.getTimezoneOffset()/60;
  let ps = UT_Planet_in_south + LHA - time.getTimezoneOffset()/60;
  let plutorise = decimalToHM(pr);
  let plutoset = decimalToHM(ps);
  return {
    rise: plutorise,
    set: plutoset,
  }
}
