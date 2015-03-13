/////////////////// UI routing /////////////////////////////

(function(){

	var app = angular.module('uiRouting',['ui.router']);

	app.config(function($stateProvider, $urlRouterProvider){

		$urlRouterProvider.otherwise('/lists');

		$stateProvider
			// load todo-lists on state
			.state('lists',{
				url: '/lists',
				templateUrl: 'todo-lists.html',
				controller: 'listController'
				
			})
			// load todo-tasks on state with listID parameter
			.state('tasks',{
				url: '/tasks/:listID/',
				templateUrl: 'todo-tasks.html',
				controller: 'listController'
			})

	});
})();

