var app = angular.module('ngTweet');

app.controller('HomeCtrl', function($scope, Page){
    $scope.Page = Page;
    $scope.Page.setTitle("Home");
    console.log($scope.Page.title());
    $scope.world = 'Hello Santosh';
});