require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);

let free = false
app.get("/pingpong", (req, res) => {
	console.log("query", req.query.free)
	if(req.query.free == "true") {
		console.log("test true")
		free = true
	}
	else if (req.query.free == "false") {
		console.log("test false")
		free = false
	}
	io.emit('pingStatus', free)
	res.status(200).end()
})

io.on('connection', function(socket){
  console.log('a user connected');
});

// app.get("/", (req, res) => {
//      if(free) res.status(200).send("The ping pong table is free!")
//      else if(!free) res.status(200).send("The ping pong table is occupied!")
// })

app.get("/", (req, res)=> {
	res.sendfile(__dirname + '/index.html')
})
server.listen(3000 , function() {
	console.log('Node app is running on port', 3000);
});

