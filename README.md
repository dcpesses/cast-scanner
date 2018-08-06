# cast-scanner

[![Build Status](https://travis-ci.org/dcpesses/cast-scanner?branch=master)](https://travis-ci.org/dcpesses/cast-scanner) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

### Scan your local network for all Chromecast devices.

Originally based on [xat/chromecast-scanner](https://github.com/xat/chromecast-scanner).


## Installation

`npm install dcpesses/cast-scanner`

## Usage

```javascript
var scanner = require('cast-scanner');
```

Results can be obtained through either a callback and/or an event.

### Simple Callback
```javascript
scanner(function(data) {
    console.log('data:', data);
});
```

### Event Listener
```javascript
scanner.on('results', function(data) {
    console.log('data:', data);
});
```

More usage examples can be found in the `examples` folder.

## API
```javascript
scanner([options], [callback]);
```
* `options`: Object (optional)
    * `ttl` Number (optional) - Lifespan (in milliseconds) to wait for responses from all devices. Default: `5000`
    * `mdns` Object (optional) - Config to pass to [multicast-dns](https://github.com/mafintosh/multicast-dns). Default: `{}`
    * `debug`: Verbose logging to console. Default: `false`
* `callback` Function (optional)

Returns CastScanner instance

Creates a CastScanner instance using any provided options and/or a callback function.

### Events

Event: `init`

Returns:
* `event` Event
* `type` String
* `timestamp` Number - Unix timestamp of when initialization occurred.

Emitted after the module is initialized.


Event: `update`

Returns:
* `event` Event
* `type` String
* `device` Object - Chromecast device object
    * `name` String - Local domain name
    * `displayName` String - Name displayed to users
    * `shortName` String
    * `host` String
    * `ip` String - IP address of device
    * `records` Object - DNS records received from device like (e.g. "A", "SRV", "TXT", etc)

Emitted when a response is received from a valid casting device.


Event: `close`

Returns:
* `event` Event
* `type` String
* `timestamp` Number - Unix timestamp of when initialization occurred.
* `duration` Number - Approximate ttl used to wait for device responses.

Emitted when the connection is closed.


Event: `results`

Returns:
* `event` Event
* `type` String
* `devices` Array - All valid Chromecast devices found.

Emitted once the scanner is no longer listening for any more devices and all of the responses have been processed.

Each object in the `devices` array uses the same format as the `details` object emitted from an 'update' event.

### Methods

```javascript
scanner.close()
```

Removes the response listener and clears the ttl timeout. Useful if you no longer want to listen for any additional responses.

## License
MIT
