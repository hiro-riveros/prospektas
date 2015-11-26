/*
=========================================
	CONFIGURATION CONTROLLER
=========================================
*/

(function() {
	this.app.controller('ConfigurationController', ['$scope', '$state', '$ionicPopup',
		function($scope, $state, $ionicPopup) {
	/*
	=========================================
		SCOPE DEFINITION
	=========================================
	*/
		$scope.configuration = {};


		// TO-DO SEND CONFIGURATION TO SERVER
		$scope.saveConfiguration = function() {
			
		};

		$scope.goTo = function(option) {
			if (option === 'editProfile') {
				$state.go('editProfile');
			} else {
				var currentUser = 'passenger'
				if (currentUser === 'jitney') {
					$state.go('mapJitney');
				} else if (currentUser === 'passenger') {
					$state.go('mapPassenger');
				};
			};
		};

	}]);
}).call(this);