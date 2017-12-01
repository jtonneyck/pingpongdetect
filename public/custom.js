var socket = io.connect(); 
socket.on('pingStatus', function(availabilty){
	console.log("availability", availabilty)
	if(availabilty) {
		$("#pingStatus").html("The ping pong table is available")
		$(".button").css("background-color", "#4CAF50")
		} 
		else if(!availabilty) {
		$("#pingStatus").html("The ping pong table is occupied")
		$(".button").css("background-color", "red")
	}
});