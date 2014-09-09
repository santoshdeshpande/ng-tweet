var app = angular.module('ngTweet');

app.controller('HomeCtrl', function($scope, Page, socket){
    $scope.Page = Page;
    $scope.Page.setTitle("Home");
    console.log($scope.Page.title());
    $scope.world = 'Hello Santosh';
    $scope.tweets = [];

    socket.on('tweet-io:tweets', function(data){
       angular.forEach(data,function(d){
           $scope.tweets.unshift(d);
       });

    });
});