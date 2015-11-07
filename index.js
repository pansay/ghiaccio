var express = require('express'),
    app = express(),
    router = express.Router(),
    config = require('./config'),
    g = require('./src/g');

router
    .get('/:path(*)', function (req, res) {
        var path = req.params.path;

        if (g.isCached(path)) {
            g.getCacheAndOutput(res, path);
        }
        else {
            g.writeCacheAndOutput(res, path);
        }
        
    });

app
    .use('/', router)
    .listen(config.port, function() {
        console.log('Ghiaccio started.');
    });
