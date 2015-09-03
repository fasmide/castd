var express = require('express'),
	router = express.Router(),
	fs = require('fs'),
	debug = require('debug')('castd:routes:stream'),
	async = require('async'),
	path = require('path'),
	cUtil = require('../src/util'),
	Transcoder = require('stream-transcoder');

router.get('/:dIndex/*', function(req, res) {

	var dirs = cUtil.getDirs(req.app),
	dIndex = req.params.dIndex,
	
	relativePath = decodeURI(req.url.split('/'+dIndex+'/').pop()),
	absolutePath = path.normalize(path.join(dirs[dIndex], relativePath));
	
	if (!cUtil.pathIsAllowed(dirs, absolutePath)) {
		res.status(500).json({status: 2, errMsg: "You cannot access this"});
		return;
	}	
	debug("Piping %s to client", absolutePath);
	var localStream = fs.createReadStream(absolutePath);
	res.set('Content-Type', 'video/mp4');
	new Transcoder(localStream)
        .videoCodec('h264')
        .audioCodec('libmp3lame')
        .sampleRate(44100)
        .channels(2)
        .audioBitrate(128 * 1000)
        .format('mp4')
        .stream().pipe(res);
});

module.exports = router;
