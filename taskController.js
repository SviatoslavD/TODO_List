
(function(){
	
	var app = angular.module('taskApp', ['services', 'listApp', 'uiRouting']);

	app.controller('taskController', ['$scope', '$stateParams', 'DAL', function($scope, $stateParams, DAL){ 

		
		$scope.contentTask = [];			 // contain all tasks loaded from database 	
		$scope.newTask = "";				 // contain typed new todo task
    	$scope.listID = $stateParams.listID; // fetched list ID for task ordering

		// open database on page load
		DAL.open(dbOpened);
		

		// read all and tasks from database
		function dbOpened () {
			DAL.readTasks(fetchTasks);
		};

		
		// refresh loaded tasks from database
		function fetchTasks (contentTask) {
			$scope.$apply(function (){
				$scope.contentTask = contentTask;	
			});	
		};

		// add new task to indicated todo list
		$scope.addTask = function () {
			if ($scope.newTask != "") {
				var task = {
			        "parentList": $scope.listID,
			        "text" : $scope.newTask,
			        "checkbox" : false,
			        "timeStamp": new Date().getTime()
			     };
				DAL.writeTask(task);
				DAL.readTasks(fetchTasks);
			};
		};

		// delete task
		$scope.deleteTask = function (task) {
			DAL.deleteTask(task);
			DAL.readTasks(fetchTasks);

		};

		// set checkbox value of selected task
		$scope.setBoxValue = function (task) {
			// check if checkbox value was changed
			task.checkbox = !task.checkbox;
			DAL.taskUpdate(task);

		};

	}]);

})();