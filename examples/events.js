// Monitor events

var scanner = require('..');

const onInitEvent = function(e) {
    console.log('scan initialized');
}

const onUpdateEvent = function(e) {
    console.log('update: chromecast "%s" running on: %s', e.device.displayName, e.device.ip);
}

const onCloseEvent = function(e) {
    console.log('scan completed');
}

const onResultsEvent = function(e) {
    console.log('results: found %s chromecasts:', e.devices.length);
    // Convert object into array and loop through devices
    e.devices.forEach(device => {
        console.log('- chromecast "%s" running on: %s', device.displayName, device.ip);
    })
}

scanner()
    .on('init', onInitEvent)
    .on('update', onUpdateEvent)
    .on('close', onCloseEvent)
    .on('results', onResultsEvent);
