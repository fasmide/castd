var castdApp = angular.module('castdApp', [
  'ngRoute',
  'castdControllers'
]);

castdApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/partials/dir-list.html',
			controller: 'DirListCtrl'
		})
		.when('/files/:dIndex', {
			templateUrl: '/partials/files-list.html',
			controller: 'FilesListCtrl'
		})
		.when('/files/:dIndex/:path*', {
			templateUrl: '/partials/files-list.html',
			controller: 'FilesListCtrl'
		})
		.when('/file/:file', {
			templateUrl: '/partials/file-detail.html',
			controller: 'FileDetailCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});
	}
]);

castdApp.filter('bytes', function() {
	return function(bytes, precision) {
		if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
		if (typeof precision === 'undefined') precision = 1;
		var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
			number = Math.floor(Math.log(bytes) / Math.log(1024));
		return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
	}
});