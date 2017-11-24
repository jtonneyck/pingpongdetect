const express = require('express')
const app = express()
let free = false
app.get("/pingpong", (req, res) => {
	console.log(req.query)
	if(req.query.free == "true") {
		free = true
	}
	else if (req.query.free == "false") {
		free = false
	}
	res.status(200).end()
})

app.get("/", (req, res) => {
     if(free) res.status(200).send("The ping pong table is free!")
     else if(!free) res.status(200).send("The ping pong table is occupied!")
})
app.listen(3000 , function() {
	console.log('Node app is running on port', 3000);
});

