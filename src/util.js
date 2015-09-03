
var path = require('path');

exports.getDirs = function(app) {
	var dirs = app.get('nconf').get('dir');
	
	if (!(dirs instanceof Array)) {
		dirs = [dirs];
	}
	return dirs;
};

exports.pathIsAllowed = function(dirs, p) {
	p = path.normalize(p);

	for (var i = dirs.length - 1; i >= 0; i--) {
		if (p.indexOf(dirs[i]) >= 0) {
			return true;
		}
	}

	return false;
};