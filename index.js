var express = require('express'),
    unirest = require('unirest'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    app = express(),
    router = express.Router(),
    config = require('./config');

function cacheWrite(path, content) {

    if (!fs.existsSync(config.cacheFolder)) {
        mkdirp(config.cacheFolder);
    }

    fs.writeFile(config.cacheFolder + '/' + path, content, function(err) {
        if(err) {
            return console.log(err);
        }
    });

    console.log('cache saved');
}; 

function handler(req, res) {
    return function(response) {
        cacheWrite('test.json', response.raw_body);
        res.json({"path": req.params.path, "response": response.body});
    }
}

router
    .get('/:path(*)', function (req, res) {
        unirest
            .get(config.gitHubUrl + req.params.path)
                .headers({'User-Agent': config.userAgent}) // https://developer.github.com/v3/#user-agent-required
                .end(handler(req, res));
    });

app
    .use('/', router)
    .listen(config.port, function() {
        console.log('Ghiaccio started.');
    });