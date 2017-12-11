	var socket = io.connect(); 
	socket.on('pingStatus', function(availabilty){
		console.log("availability", availabilty)
		if(availabilty) {
			$("#pingStatus").html("The ping pong table is available! :)")
			$("#occupied").css("background-color", "#4CAF50")
			$("#chatwindow").css("border-color", "#4CAF50")
			} 
			else if(!availabilty) {
			$("#pingStatus").html("The ping pong table is occupied. :(")
			$("#occupied").css("background-color", "red")
			$("#chatwindow").css("border-color", "red")
		}
	});

	$(document).ready(function() {
		$("#submitMessage").click(function() {
			console.log("Message send")
			var theMessage = $("#message").val()
			socket.emit("chat message", theMessage)
		})
		
		socket.on("chat message", function(newMessage) {

			$("#allMessages").append("<li>"+newMessage+"</li>")
			var element = document.getElementById("allMessagesWindow");
			    element.scrollTop = element.scrollHeight;
		})


		var wHeight = $(window).height()
		$("#occupied").css("height", (wHeight * 0.4))
		$("#chatwindow").css("height", (wHeight * 0.4))

	})
