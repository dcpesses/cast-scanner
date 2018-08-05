// Manually close before ttl is reached

const CastScanner = require('..');

var scanner = CastScanner({ttl: 6000})
    .on('init', function(){
        console.log('Scan started');
    })
    .on('close', function(e){
        console.log('Scan completed in %s seconds', e.duration/1000);
    })
    .on('results', function(e){
        console.log('results: found %s chromecasts', e.devices.length);
    });

setTimeout(function(){
    // end early
    scanner.close();
}, 3000);
