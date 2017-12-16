	var socket = io.connect(); 
	socket.on('pingStatus', function(availabilty){
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
		// Always start at the bottom 
		 setTimeout(()=> {
			$("#allMessagesWindow").scrollTop($('#allMessagesWindow').prop('scrollHeight'))				 	
		 }, 1)

	 	let scrolled = 0
	 	let offset = 1
		$("#allMessagesWindow").scroll(()=>{
			scrolled++
			if(scrolled > 1 && $('#allMessagesWindow').scrollTop() == 0) {
				console.log("requeset")
				$.get("/moremessages", {offset: offset}, (result)=> {
					offset++
					for(let i = 0; i < result.messages.length; i++) {
						$("#allMessages").prepend(`<li> ${result.messages[0].username}: ${result.messages[0].message} </li>`)
					}
				})
			}
		})				 	
 
		// To enable sending messages on enter AND click
		$("#username").keyup(function(e){
			if(event.keyCode === 13) {
				document.getElementById("submitUserName").click()
			}
		})
	
	
		$("#submitUserName").click(function() {
			let username= $("#username").val()
			$("#submitUserName").remove()
			$("#username").remove()
			$("#chatwindow").append(`
				<input class='inputChat' id='message' placeholder='message'>
				<button class='submitChat' id='submitMessage'> Post </button>
				`)
			// To enable sending messages on enter AND click
			$("#message").keyup(function(e){
				if(event.keyCode === 13) {
					document.getElementById("submitMessage").click()
				}
			})
			socket.emit("username", username)
			$("#submitMessage").click(function() {
				console.log("Message send")
				var theMessage = $("#message").val()
				$("#message").val("")
				socket.emit("chat message", theMessage)
			})			
		})

		
		socket.on("chat message", function(data) {
			$("#allMessages").append(`<li> ${data.username}: ${data.message}</li>`)
			var element = document.getElementById("allMessagesWindow");
			    element.scrollTop = element.scrollHeight;
		})

		var wHeight = $(window).height()
		$("#occupied").css("height", (wHeight * 0.4))
		$("#chatwindow").css("height", (wHeight * 0.4))

	})
