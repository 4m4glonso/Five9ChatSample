function ChatTyping(_component) {
	var TYPINGMESSAGE = new ChatMessage(-1, 1, -1, MessageTypes.IN, null,  MessageTypes.FROM_TYPING, null, null, null, MessageTypes.MSG_TEXT);
	
	var component = _component;
	
	var lastTimeCharTyped = -1;
	var timerTyping = null;
	var timerClientTyping = null;


	this.getTypingMessage = function() {
		return TYPINGMESSAGE;		
	};

	
	this.startTimerToRemoveTyping = function() { 
		timerClientTyping = setTimeout(function() { clearClientTyping(); }, 4000);
	};
	
	
	this.clearTypingTimeout = function() {
		if (timerClientTyping != null) {
			clearTimeout(timerClientTyping);
		}
	};
	
	
	this.setTyping = function(id, usernames, mediaType) {
		lastTimeCharTyped = (new Date()).getTime();

		/**
		 * If already a timer no need to do anything more
		 */
		if (timerTyping != null) {
			return ;
		}
		
		sendTyping(id, usernames, mediaType);
		
		timerTyping = setInterval(function() { sendTyping(id, usernames, mediaType); }, 3000);
	};
	
	
	this.stopTimerTyping = function() {
		stopTimerTyping();
	};
	
	
	function stopTimerTyping() {
		lastTimeCharTyped = -1;
		
		if (timerTyping != null) {
			clearInterval(timerTyping);
		}
		
		timerTyping = null;
	};

	
	function clearClientTyping() {
		component.find("#" + TYPINGMESSAGE.getReferenceId()).remove();
	};
	
	
	function sendTyping(id, usernames, mediaType) {
		if (lastTimeCharTyped == -1) {
			return ;
		}
		
		var lvDeltaLastTimeTyping = ((new Date()).getTime() - lastTimeCharTyped);
		if (lvDeltaLastTimeTyping >= 6000) {
			/**
			 * It has been at least 4 seconds without typing, stop the thread
			 */
			return stopTimerTyping();
		}
		
		gMessageSender.sendTyping(id, true, usernames, mediaType);
	};
}