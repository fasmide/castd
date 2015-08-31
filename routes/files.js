var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	debug = require('debug')('castd:routes:files'),
	async = require('async'),
	path = require('path');

var getDirs = function(app) {
	var dirs = app.get('nconf').get('dir');
	
	if (!(dirs instanceof Array)) {
		dirs = [dirs];
	}
	return dirs;
};

var pathIsAllowed = function(dirs, p) {
	p = path.normalize(p);

	for (var i = dirs.length - 1; i >= 0; i--) {
		if (p.indexOf(dirs[i]) >= 0) {
			return true;
		}
	}

	return false;
};

router.get('/', function(req, res, next) {
	
	var dirs = getDirs(req.app);

	debug("Listing dirs %j", dirs);

	async.map(dirs, fs.readdir, function(err, result) {
		if(err) {
			res.json({status:1, errMsg: err});
			return;
		}

		res.json({status: 0, errMsg: null, result: result});

	});
});

router.get('/:dIndex/:relativePath', function(req, res) {

	var dirs = getDirs(req.app),
		dIndex = req.params.dIndex,
		
		relativePath = req.params.relativePath,
		absolutePath = path.normalize(path.join(dirs[dIndex], relativePath));

	if (!pathIsAllowed(dirs, absolutePath)) {
		res.status(500).json({status: 2, errMsg: "You cannot access this"});
		return;
	}

	fs.readdir(absolutePath, function(err, list) {
		
		if (err) {
			res.status(500).json({status:1, errMsg:err});
			return;
		}

		res.json({status:0, errMsg: null, result: list});
	});

});

module.exports = router;
