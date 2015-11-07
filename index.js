var express = require('express'),
	unirest = require('unirest'),
    app = express(),
    router = express.Router(),
    config = require('./config');

function handler(req, res) {
	return function(response) {
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