

var app = angular.module('ngTweet');

app.factory('Page', function() {

    var title = "default";
    return {
        title: function() { return title; },
        setTitle: function(newTitle) { title = newTitle}
    }

});


app.factory('socket', function($rootScope) {
    var socket = io.connect('http://localhost:3000');
    return {
        on: function(eventName, callback) {
            socket.on(eventName, function(){
                var args = arguments;
                $rootScope.$apply(function(){
                   callback.apply(socket, args);
                });
            });
        }
    }
});

app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});