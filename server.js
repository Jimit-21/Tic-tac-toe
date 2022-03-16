if (process.argv.length == 3 && !isNaN(process.argv[2])) {
 var io = require('socket.io')(process.argv[2]);
} else {
 console.log('Please provide a correct port number');
 process.exit(1);
}

console.log('Server started listening at the port : ' + process.argv[2]);
var players = [];

io.on('connection', function(player) {
 players.push(player);

 if (players.length == 2) {
  //board
  var board = ['_','_','_','_','_','_','_','_','_'];
  var plyerTurn = 0;
  io.to(players[0].id).emit('Start', 'Game started. You are the first player.');
  io.to(players[1].id).emit('Start', 'Game started. You are the second player.');

  players[0].on('move', function(data) {
   if (validMove(data.player, plyerTurn, data.move, board)) {
    if (data.player == 0) {
     board[data.move - 1] = 'x';
     plyerTurn = 1;
    } else {
     board[data.move - 1] = 'o';
     plyerTurn = 0;
    }
    io.sockets.emit('accepted', board);
    var status = checkWinner(board, data.player)
    if (!status) {
     io.sockets.emit('End', 'tied');
    };
    if (status == 1) {
     io.sockets.emit('End', data.player);
    };
   };
  });

  players[1].on('move', function(data) {
   if (validMove(data.player, plyerTurn, data.move, board)) {
    if (data.player == 0) {
     board[data.move - 1] = 'x';
     plyerTurn = 1;
    } else {
     board[data.move - 1] = 'o';
     plyerTurn = 0;
    }
    io.sockets.emit('accepted', board);
    var status = checkWinner(board, data.player)
    if (!status) {
     io.sockets.emit('End', 'Game Tied!, Well played!!');
    };
    if (status == 1) {
     io.sockets.emit('End', data.player);
    };
   };
  });
 }
 player.on("disconnect",()=>{
    console.log(player.id)
    io.emit("win",'Your oppenent leaves the match, You win the game! Hurrey!!')
    })
});

// validatiotn
function validMove(playerId, roleId, move, board) {
 if (playerId == roleId && move < 10 && board[move - 1] == '_') {
  return 1;
 }
 return 0;
}

// checking winner
function checkWinner(board, player) {
 if (board.toString().includes('_')) {
    // winner = 0;
    item = 'ooo';
    if (player == 0) item = 'xxx';
    var row1 = board[0] + board[1] + board[2];
    if (row1 == item) {
     return 1
    }
    var row2 = board[3] + board[4] + board[5];
    if (row2 == item) {
     return 1
    }
    var row3 = board[6] + board[7] + board[8];
    if (row3 == item) {
     return 1
    }
    var col1 = board[0] + board[3] + board[6];
    if (col1 == item) {
     return 1
    }
    var col2 = board[1] + board[4] + board[7];
    if (col2 == item) {
     return 1
    }
    var col3 = board[2] + board[5] + board[8];
    if (col3 == item) {
     return 1
    }
    var diag1 = board[0] + board[4] + board[8];
    if (diag1 == item) {
     return 1
    }
    var diag2 = board[2] + board[4] + board[6];
    if (diag2 == item) {
     return 1
    }
    return 2
 } else {
    return 0;
 }
}