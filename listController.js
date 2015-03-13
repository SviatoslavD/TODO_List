
(function(){
	
	var app = angular.module('listApp', ['services', 'taskApp']);

	app.controller('listController', ['$scope', 'DAL', function($scope, DAL){ 

		$scope.contentList = [];             // contain all lists name loaded from database
		//$scope.contentTask = [];           // contain all tasks loaded from database  
		$scope.newList = "";				 // contain typed new todo list

		// open database on content load
		$scope.$on('$viewContentLoaded', function(){
			init();
		});

		// open database on page load
		function init() {
			DAL.open(dbOpened);
		};

		// read all todo lists and tasks from database
		function dbOpened () {
			DAL.readLists(fetchLists);
		};

		// refresh loaded todo lists from database
		function fetchLists (contentList) {
			$scope.$apply(function(){
				$scope.contentList = contentList;		
			});	
		};

		// add new todo list 
		$scope.addList = function () {
			if ($scope.newList != "") {
				var list = {
        			"parentList": $scope.newList,
        			"timeStamp": new Date().getTime()
      			};
				DAL.writeList(list);
				DAL.readLists(fetchLists);
			};	
		};

		// delete indicated todo list and all own tasks
		$scope.deleteList = function(list) {
			DAL.deleteList(list);
			DAL.readLists(fetchLists);

		};

	}]);

})();