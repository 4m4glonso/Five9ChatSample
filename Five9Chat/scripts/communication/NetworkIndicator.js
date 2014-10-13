function NetworkIndicator() {
	
	var STATE = "state";
	
	var state = false;
	
	var previousState = false;
	
	this.setState = function(_state) {
		previousState = state;
		
		state = _state;
		
		if (previousState != state) {
			update();
		}
	};
	
	
	this.getState = function() {
		return state;
	};
	
	
	function update() {
		
		var element = $("#" + STATE);
		
		if (previousState) {
			element.removeClass("online");
		} else {
			element.removeClass("offline");
		}

		if (state) {
			
			
			if (typeof gListeners !== 'undefined') {
	            gListeners.generateEvent(1, CONSTANT.EVENT_NETWORK_UP, null, null);
			}
            
			element.addClass("online");
			
			element.attr("title", "Connected to the server!");
		} else {
			if (typeof gListeners !== 'undefined') {
				gListeners.generateEvent(1, CONSTANT.EVENT_NETWORK_DOWN, null, null);
			}
            
			element.addClass("offline");
			
			element.attr("title", "Not connected to the server!");
		}
	}
}