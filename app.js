require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'))
app.set("port", process.env.port)
app.set("view engine", "pug")
const db = require("./models/index")

let free = false
app.get("/pingpong", (req, res) => {
	console.log("query", req.query.free)
	if(req.query.free == "true") {
		console.log("test true")
		free = true
		db.pingpongstats.create({
			state: true
		})
	}
	else if (req.query.free == "false") {
		console.log("test false")
		free = false
		db.pingpongstats.create({
			state: false
		})
	}
	io.emit('pingStatus', free)
	res.status(200).end()
})

io.on('connection', function(socket){
  	console.log('a user connected');
	socket.on('chat message', function(message) {
		console.log("message received")
		io.emit("chat message", message)
	})  
});

app.get("/", (req, res)=> {
	// db.pingpongstats.getThisWeeksStats()
	// .then((stats)=> {
	// 	res.render("index2", {pingpongStats: stats})
	// })	
	res.render("index", {pingpongFree: free})
})
server.listen(app.get("port"), function() {
	console.log('Node app is running on port', app.get("port"));
});

