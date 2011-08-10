var express     = require('express');
var app         = express.createServer();
var io          = require('socket.io').listen(app);
var TwitterNode = require('twitter-node').TwitterNode;
var sys         = require('sys');
var port        = process.env.PORT || 3001;

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

var twit = new TwitterNode({
  user:     process.env.TWITTER_USERNAME,
  password: process.env.TWITTER_PASSWORD,
  track:    ['baseball','ruby']
});


twit.addListener('error', function(error) {
  console.log(error.message);
});

io.sockets.on('connection', function (socket) {
  twit.addListener('tweet', function(tweet) {
    socket.emit('tweet', "@" + tweet.user.screen_name + ": " + tweet.text);
    sys.puts("@" + tweet.user.screen_name + ": " + tweet.text);
  });
});


twit.stream();
