var http = require('http'),
    fs = require('fs')

// Send index.html to all requests
var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/game-example.html'));
});

// Socket.io server listens to our app
var io    = require('socket.io').listen(app);
var users = {};

function showUsers() {
    console.log('Users: ', users);
}

function playersUpdate() {
	io.emit('playersUpdate', users);
}

setInterval(showUsers, 1000);
setInterval(playersUpdate, 20);

function socketServerConnection(socket) {
	initSocket(socket);

	socket.on('welcome', (data) => {
		users[socket.id] = Object.assign(users[socket.id], data);


		console.log('hola');
	})

	socket.on('playerUpdate', (data) => {
		users[socket.id] = Object.assign(users[socket.id], data)
	});

	socket.on('disconnect', () => {
	  	delete users[socket.id];
		io.emit('playerDisconnected', socket.id);
	});

}

function initSocket(socket) {
	console.log('some one connected to server');

	users[socket.id] = {
		x: 10,
		y: 120
	}

	console.log('initialized user', socket.id, 'values', users[socket.id]);
}

// Emit welcome message on connection
io.on('connection', socketServerConnection);

app.listen(3000);