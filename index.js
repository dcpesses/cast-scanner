const mdns = require('multicast-dns');
const txt = require('dns-txt')();
const events = require('events');

var casts = {}

var defaults = {
    ttl: 5000,
    service_name: '_googlecast._tcp.local',
    service_type: 'PTR',
    mdns: {},
    debug: false
};

module.exports = function(opts, cb) {

    var self = new events.EventEmitter();

    // var emit = function(type, payload) {
    //     // let data = (payload instanceof Object && Object.getPrototypeOf(payload) === Object.prototype)
    //     //     ? Object.assign({type: type}, payload)
    //     //     : {type: type, data: payload}
    //
    //     self.emit(type, {type: type, data: payload})
    // }

    if (typeof opts === 'function') {
        cb = opts;
        opts = defaults;
    } else {
        opts = Object.assign({}, defaults, opts);
    }

    // var settings = opts;

    var m = mdns(opts.mdns);

    var timer = setTimeout(function() {
        close();
    }, opts.ttl);

    var debuglog = (opts.debug === true) ? console.log : ()=>{};

    var starttime = Date.now();

    var onResponse = function(response) {

        debuglog('onResponse:', response)

        // save responses to `casts` object
        response.answers.forEach(function(a) {
            if (a.type === 'PTR' && a.name === '_googlecast._tcp.local') {
                let name = a.data
                let shortName = a.data.replace('._googlecast._tcp.local', '')
                if (!casts[name])
                    casts[name] = {
                        name: name,
                        displayName: null,
                        shortName: shortName,
                        host: null,
                        ip: null,
                        records: {
                            PTR: a
                        }
                    }
                }
            }
        )

        var getNameFromARecord = function(a){
            return 'Chromecast-' + a.name.replace(/-/g, '').replace('.local', '._googlecast._tcp.local');
        };

        var onanswer = function(a) {
            debuglog('answer', a)

            // console.log(`[${a.type}]`, a);

            let name = a.name;

            switch (a.type) {
                case 'SRV':
                    // hostname
                    if (casts[name] && !casts[name].host) {
                        casts[name].host = a.data.target
                    }
                    // break;
                case 'TXT':
                    // decode given name from Uint8Array (mdns TXT record)
                    let text = (Array.isArray(a.data))
                        ? a.data.map(d => txt.decode(d))
                        : txt.decode(a.data)
                    debuglog('[TXT]', text);
                    if (text.fn) {
                        casts[name].displayName = text.fn
                    }
                    // break;
                case 'A':
                    let shortName = getNameFromARecord(a);

                    // ip address
                    if (casts[shortName])
                        casts[shortName].ip = a.data;
                    // break;
                default:
                    let key = (a.type === "A") ? getNameFromARecord(a) : name;

                    if (casts[key]) {
                        casts[key].records[a.type] = a;

                        if (casts[key].host && casts[key].displayName && casts[key].ip) {
                            self.emit('update', {type: 'update', device: casts[key]})
                        }
                    }
                    break;
            }

        }

        response.additionals.forEach(onanswer)
        response.answers.forEach(onanswer)

        return;
    };

    m.on('response', onResponse);

    m.query({
        questions: [
            {
                name: opts.service_name,
                type: opts.service_type
            }
        ]
    });

    var close = function() {
        debuglog('close()')
        m.removeListener('response', onResponse);
        clearTimeout(timer);
        m.destroy();
        let endtime = Date.now();
        self.emit('close', {type: 'close', timestamp: endtime, duration: Math.round(endtime - starttime)});
        if (cb && typeof cb === 'function') {
            cb(casts)
        } else {
            debuglog('cb:', cb)
        }
        self.emit('results', {type: 'results', devices: casts});
    };

    self.close = close;
    self.options = opts;

    setTimeout(function() {
        self.emit('init', {type: 'init', timestamp: starttime});
    }, 10);

    return self;
};
