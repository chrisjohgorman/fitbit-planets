# fitbit-planets
This application calculates the positions of the planets and celestial bodies including the sun and moon.  It provides right ascension and declianation values as well as distance, azimuth, altitude and the rise and set time of the body.  The calculations are thanks to the work of [Paul Schlyter](http://stjarnhimlen.se/english.html) and his pages on calculating planetary positions.

There are two types of pages that can be found on the app.  The first is a menu listing of all the celestial body, and the second is the data from the celestial body.  This first example is the menu.

![Screenshot](screenshots/screenshot2.png)

And the second is an example of the data from the celestial body.  The sun in this case.

![Screenshot](screenshots/screenshot1.png)

## Build Instructions
The following packages are needed to build the application.

### Software required to build a fitbit app
The following version is the one I used to build the app.  The instructions on how to set it up is avialable at the fitbit [developer](https://dev.fitbit.com/getting-started/) website.

```
$ node --version
v14.21.3
```

To install node 14 follow the instructions from the developer website, in short run.

```
nvm install 14
nvm alias default 14
```

### Instructions on how to build this fitbit app and install it
Install node  by running the above commands, then clone the fitbit-planets repository.  Change directory to the fitbit-planets directory yarn to build and install the app.

```
cd fitbit-planets
```
```
cd app && yarn install && yarn build
```
```
export FITBIT_QA_COMMANDS=1
export FITBIT_DEVBRIDGE_DUMP=1
yarn debug
```

```
npx fitbit
Logged in as Chris Gorman <chrisjohgorman@gmail.com>
```
```
fitbit$ build

> fitbit-planets@0.1.0 build
> fitbit-build

[12:25:08][warn][companion] This project is being built without a companion component. Create a file named companion/index.ts or companion/index.js to add a companion component to your project.
[12:25:08][warn][settings] This project is being built without a settings component. Create a file named settings/index.tsx, settings/index.ts, settings/index.jsx or settings/index.js to add a settings component to your project.
(node:45266) [DEP0148] DeprecationWarning: Use of deprecated folder mapping "./" in the "exports" field module resolution of the package at /home/chris/src/javascript/foo/fitbit-planets/node_modules/tslib/package.json.
Update this package.json to use a subpath pattern like "./*".
(Use `node --trace-deprecation ...` to show where the warning was created)
[12:25:10][info][app] Building app for Fitbit Ionic
[12:25:10][info][app] Building app for Fitbit Versa
[12:25:10][info][app] Building app for Fitbit Versa Lite
[12:25:10][info][app] Building app for Fitbit Versa 2
[12:25:10][info][build] App UUID: 4b678716-7e8e-4259-893d-d4b026e3c4a5, BuildID: 0x0e74dc736a701857
```

```
fitbit$ install
No app package specified. Reloading ./build/app.fba.
Loaded appID:4b678716-7e8e-4259-893d-d4b026e3c4a5 buildID:0x0e74dc736a701857
App requires a device, connecting...
Auto-connecting only known device: Versa
App install complete (partial)
Launching app
```
For further build and install instructions see the [Command Line Interface](https://dev.fitbit.com/blog/2018-08-23-cli-tools/) at dev.fitbit.com.

## License

This project has two licenses.  The [library](common/planetCoordinates.js) is licensed under the GNU Lesser General Public License 3.0 - see the [gpl-lgpl-v3.0.md](gnu-lgpl-v3.0.md) file for details.  The rest of the app was pulled shamelessly from [sdk-app-demo](https://github.com/Fitbit/sdk-app-demo) by Jon Barlow and is covered under the [MIT license](mit.md).
