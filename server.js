var twitter = require('node-tweet-stream');
var transformer = require('twitter-text');
var express = require('express');
var app = express();
//app.use(express.json());
//app.use(express.urlencoded());
//app.use(express.logger());

app.all('*', function(req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
});

var server = app.listen(3000, function() {
    console.log("Server ready and listening on port 3000");
});


var io = require('socket.io').listen(server);
var client = twitter({
    consumer_key: 'CmjCzs26u6s3eIOw0rVtA',
    consumer_secret: 'aBz5zBUG4dwzbYHmX7YsqWKko2YFbDz5lscLZPY',
    token: '84508838-U0KOAeYPx5BSVCoABds49NojOBKtqb1DNoC7uGSIk',
    token_secret:'1b3GEVXDEMQp7ur5ZczVaSu1qU70h1J5ZQsvDM1GU'
});

var TWEETS_BUFFER_SIZE = 3;
var tweetsBuffer = [];
var SOCKETIO_TWEETS_EVENT = 'tweet-io:tweets';
var SOCKETIO_START_EVENT = 'tweet-io:start';
var SOCKETIO_STOP_EVENT = 'tweet-io:stop';


client.on('tweet', function (tweet) {
    var msg = {};
    msg.txt = transformer.autoLink(transformer.htmlEscape(tweet.text));
    msg.user = tweet.user.name;
    msg.handle = tweet.user.screen_name;
    msg.picture = tweet.user.profile_image_url;
    tweetsBuffer.push(msg);
    broadcastTweets();
    console.log(msg.txt);
});

client.on('error', function (err) {
    console.log('Oh no')
});

client.track('bangalore');
client.track('mumbai');

var discardClient = function() {
    console.log("Client disconnected");
};

var handleClient = function() {
    if(data) {
        console.log("Client connected");
    }
};

var broadcastTweets = function() {
    if(tweetsBuffer.length >= TWEETS_BUFFER_SIZE) {
        io.sockets.emit(SOCKETIO_TWEETS_EVENT, tweetsBuffer);
        tweetsBuffer = [];
    }
};

io.sockets.on('connect', function(socket){
    console.log("Client connected");
    socket.on(SOCKETIO_START_EVENT, function(data){
       handleClient(data, socket);
    });

    socket.on(SOCKETIO_STOP_EVENT, discardClient);

    socket.on('disconnect', discardClient);
});




