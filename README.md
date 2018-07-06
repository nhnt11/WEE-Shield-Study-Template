# WebExtension Experiment Shield Study Template
This is a spin-off of the Firefox Monitor Shield Study addon (https://github.com/mozilla/blurts-addon).
The idea is to capture a minimal template for studies that require the control and versatility of a bootstrap addon,
providing the basic shield study wrapper code and a simple mechanism to pass telemetry from the privileged context
to the Shield study WebExtension API.

## Requirements
* Use an unbranded build for testing - see https://wiki.mozilla.org/Add-ons/Extension_Signing#Unbranded_Builds

## Setup
1. Fork the repo
2. Change add-on specific metadata in package.json and src/manifest.json
3. $npm install

## Running
1. $export FIREFOX_BINARY=/path/to/unbranded/firefox/binary
3. $npm start

## Building
$npm run build
