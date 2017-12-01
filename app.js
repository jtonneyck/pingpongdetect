require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'))
app.set("port", process.env.port)

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

app.get("/", (req, res)=> {
	res.sendfile(__dirname + '/index.html')
})
server.listen(app.get("port"), function() {
	console.log('Node app is running on port', app.get("port"));
});

