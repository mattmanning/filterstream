var express     = require('express');
var app         = express.createServer();
var io          = require('socket.io').listen(app);
var TwitterNode = require('twitter-node').TwitterNode;
var sys         = require('sys');

app.configure(function(){
  app.use(express.static(__dirname + '/public'));
});

app.listen(3001);

var twit = new TwitterNode({
  user:     'annoy_bot',
  password: 'atlrugrocks',
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
