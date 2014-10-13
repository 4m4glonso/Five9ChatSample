var gButtonEventHandler = null;

function ButtonEventHandler() {

	this.init = function() {
		$("body").on("click", "[data-role=button]", function(e) { handleOnButtonClicked(this, e); });
	};	
	
	
	this.reset = function() {
		$("body").off("click", "[data-role=button]");
	};	

	
	function handleOnButtonClicked(button, event) {
		// var popup = null;
		var id = Utility.isValidObject($(button).attr("id"), null);
		
		// Console.log("Button Clicked", id, button, popup);
		
		if (id != null) {
			switch (id) {
				case "buttonEmoticons":
		        	gChatEventHandler.handleEmoticonsOnButtonClicked($(button), event);
		            return ;

				case "buttonSend":
		        	gChatEventHandler.handleSendOnButtonClicked($(button));
		            return ;
	            
				case "buttonPrint":
		        	gChatEventHandler.handlePrintOnButtonClicked($(button));
		            return ;
		            
		        case "buttonOpenSession":
		        	$(button).prop('disabled', true);
		        	
		        	gChatEventHandler.handleOpenSessionOnButtonClicked($(button));
		        	
		        	setTimeout(function() { $(button).prop('disabled', false); }, 10000);
		            return ;
		            
		        case "buttonTerminateChat":
		            var result = confirm("Terminate the chat!");
		            if (result) {
			        	gChatEventHandler.handleTerminateOnButtonClicked($(button));
			        	$(button).hide();
		            }
		            return ;
		            
		        case "buttonSendEmail":
		        	$(button).attr('disabled', true);
		        	
		        	gChatEventHandler.handleSendEmailOnButtonClicked($(button));
		        			        	
		        	return ;
			}
		}
		
        Console.error("Unknown button", button);
	};
}