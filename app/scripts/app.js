var app = angular.module('ngTweet',['ui.router']);


app.config(function($stateProvider, $urlRouterProvider){	

	$urlRouterProvider.otherwise("home");

	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'hello.html',
        controller: 'HomeCtrl'
	})
	.state('about', {
		url: '/about',
		templateUrl: 'about.html'
	})
	.state('nothing', {
		url: '/nothing',
		templateUrl: 'about.html'
	})
});