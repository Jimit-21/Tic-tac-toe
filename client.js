var io = require('socket.io-client');
var readcommand = require('readcommand');

if (process.argv.length == 4 && !isNaN(process.argv[3])) {
 var socket = io.connect('http://' + process.argv[2] + ':' + process.argv[3], {
  reconnect: true
 });
} else {
 console.log('Please provide a correct port number');
 process.exit(1);
}

//connecting
socket.on('connect', function() {
 console.log('connected to ' + process.argv[2] + ' ' + process.argv[3]);


 socket.on('Start', function(data) {
  console.log(data);
  if (data.includes("first player")) {
   var player = 0;
  } else {
   var player = 1;
  }
  var sigints = 0;

  readcommand.loop(function(err, args, str, next) {
   if (err && err.code !== 'SIGINT') {
    throw err;
   } else if (err) {
    if (sigints === 1) {
     process.exit(0);
    } else {
     sigints++;
     console.log('Press ^C again to exit.');
     return next();
    }
   }
   else if (args[0] === 'r') {
    console.log("You lose the Game!! Better luck next time!!")
    process.exit(0);
   }
   //sending move
   socket.emit('move', {
    player: player,
    move: args[0]
   });
   return next();
  });
 });
});

socket.on("win",function(data){
    console.log(data)
    process.exit(1);
})

socket.on('accepted', function(board) {
 printBoard(board);
});
socket.on('End', function(data) {
 if (data == 'tied') {
  console.log('Game is tied');
 } else {
  if (!data) {
   console.log('Game won by first player');
  } else {
   console.log('Game won by second player');
  }
 }
 socket.disconnect();
 process.exit(1);
});

function printBoard(board) {
 console.log('\n');
 console.log(board[0], board[1], board[2]);
 console.log('\n');
 console.log(board[3], board[4], board[5]);
 console.log('\n');
 console.log(board[6], board[7], board[8]);
}
