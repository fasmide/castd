var castdControllers = angular.module('castdControllers', []);

castdControllers.controller('FilesListCtrl', ['$scope', '$http', '$routeParams', '$location',
	function ($scope, $http, $routeParams, $location) {
		
		$scope.$location = $location;

		var path = $routeParams.path ? 
			window.encodeURIComponent($routeParams.path) : 
			window.encodeURIComponent('/');
		
		$http.get('/files/' + $routeParams.dIndex + '/' + path).success(function(data) {
			$scope.files = data.result;
		});
	}
]);

castdControllers.controller('DirListCtrl', ['$scope', '$http', 
	function ($scope, $http) {
		$http.get('/files').success(function(data) {
			$scope.dirs = data.result;
		});

	}
]);