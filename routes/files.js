var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	debug = require('debug')('castd:routes:files'),
	async = require('async'),
	path = require('path'),
	cUtil = require('../src/util');


router.get('/', function(req, res) {
	res.json({status: 0, errMsg: null, result: cUtil.getDirs(req.app)});
});

router.get('/:dIndex/:relativePath?', function(req, res) {

	var dirs = cUtil.getDirs(req.app),
		dIndex = req.params.dIndex,
		
		relativePath = req.params.relativePath || '/',
		absolutePath = path.normalize(path.join(dirs[dIndex], relativePath));

	if (!cUtil.pathIsAllowed(dirs, absolutePath)) {
		res.status(500).json({status: 2, errMsg: "You cannot access this"});
		return;
	}


	async.waterfall([
		fs.readdir.bind(null, absolutePath),

		function(dirs, cb) {

			async.mapLimit(dirs, 10,
				function(dir, cb) {
					fs.stat(path.join(absolutePath, dir), cb);
				}, 
				function(err, fStats) {
				
				if (err) {
					cb(err);
					return;
				}

				for (var i = dirs.length - 1; i >= 0; i--) {
					dirs[i] = { name: dirs[i], stat: fStats[i], isDirectory: fStats[i].isDirectory() };
				}
				cb(null, dirs);
			});
		}

	],
	
	function(err, files) {
	
		if (err) {
			res.status(500).json({status:1, errMsg:err});
			return;
		}

		res.json({status:0, errMsg: null, result: files});
	}
);
	

});

module.exports = router;
