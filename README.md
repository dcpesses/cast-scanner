# cast-scanner

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



## License
MIT
