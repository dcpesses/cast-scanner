var scanner = require('..');

const onScannerEvent = function(e) {
    if (e.type) console.log(`[onScannerEvent] ${e.type}:`, e);
    else console.log(`[onScannerEvent]:`, e);
}
const onScannerCallback = function(data) {
    console.log('[onScannerCallback]', data);
}

scanner({ttl: 3000, debug:true}, onScannerCallback)
    .on('init', onScannerEvent)
    .on('update', onScannerEvent)
    .on('close', onScannerEvent)
    .on('results', onScannerEvent);
