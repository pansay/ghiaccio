var unirest = require('unirest'),
    fs = require('fs'),
    mkdirp = require('mkdirp'),
    config = require('../config');

function getPath(path) {
    return config.cacheFolder + '/' + path.replace(/\//g, '_') + '.json';
}

function cacheWrite(path, content) {

    if (!fs.existsSync(config.cacheFolder)) {
        mkdirp(config.cacheFolder);
    }

    fs.writeFile(path, content, function(err) {
        if(err) {
            return console.log(err);
        }
    });

}

function ghHandler(res, path) {
    return function(response) {
        cacheWrite(path, response.raw_body);
        output(res, response.body);
    };
}

function cacheHandler(res) {
    return function (err, content) {
        if (err) {
            throw err;
        }
        output(res, JSON.parse(content));
    };
}

function output(res, content) {
    res.header('Access-Control-Allow-Origin', config.cors);
    res.json(content);
}

module.exports =  {
    isCached: function(path) {
        return fs.existsSync(getPath(path));
    },
    isCacheFresh: function(path, cacheExp) {
        var stats = fs.statSync(getPath(path)),
            cacheTime = stats.mtime.getTime(),
            nowTime = (new Date()).getTime();
        return cacheTime + cacheExp > nowTime;
    },
    getCacheAndOutput: function(res, path) {
        fs.readFile(getPath(path), cacheHandler(res));
    },
    writeCacheAndOutput: function(res, path) {
        unirest.get(config.gitHubUrl + path)
            .headers({
                'User-Agent': config.userAgent // https://developer.github.com/v3/#user-agent-required
            })
            .end(ghHandler(res, getPath(path)));
    }
};

