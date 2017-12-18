require('dotenv').config()
const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
app.use(express.static('public'))
app.set("port", process.env.port)
app.set("view engine", "pug")
const db = require("./models/index")

console.log(db.pingpongstats.getThisWeeksStats())

let free = false
app.get("/pingpong", (req, res) => {
	console.log("query", req.query.free)
		if(req.query.free == "true") {
			if(free== true) {
			throw new Error("switched to same state")
		} else {
			free = true
			if(db.pingpongstats.find)
			db.pingpongstats.create({
				state: true
			})			
		}
	}
	else if (req.query.free == "false") {
		console.log("test false")
		if(free== false) {
			throw new Error("switched to same state")
		}else {
			free = false
			db.pingpongstats.create({
				state: false
			})			
		}
	}
	io.emit('pingStatus', free)
	res.status(200).end()
})

io.on('connection', function(socket){
	socket.on("username",function(username) {
		socket.username = username
		console.log("The username", socket.username)
	})
	socket.on('chat message', function(message) {
		debugger		
		io.emit("chat message", {message: message, username: socket.username} )
		db.chatmessages.create({
			message: message,
			username: socket.username
		})
		.catch((err)=> {
			throw err
		})
	})  
});

app.get("/moremessages", (req, res)=> {
	let offset = req.query.offset * 30
	db.chatmessages.findAll({
		limit: 30,
		offset: offset,
		order: [["createdAt", "DESC"]]
	}).then((messages)=> {
		messages = messages.reverse()
		res.json({messages: messages}).status(200).end()
	}).catch((error)=> {
		res.status(500).end()
	})
})

app.get("/", (req, res)=> {
	db.chatmessages.findAll({
		limit: 30,
		order: [["createdAt", "DESC"]]
	})
	.then((messages)=> {
		db.pingpongstats.getThisWeeksStats()
		.then((stats)=> {
			// Get the Last 30, but those have to be ascending
			messages = messages.reverse()
			res.render("index", {pingpongStats: stats, messages: messages})
		})
	})
	.catch((err)=> {
		throw err
	})	
	// res.render("index", {pingpongFree: free, thisWeeksStats: db.pingpongstats.getThisWeeksStats()})
})
server.listen(app.get("port"), function() {
	console.log('Node app is running on port', app.get("port"));
});

