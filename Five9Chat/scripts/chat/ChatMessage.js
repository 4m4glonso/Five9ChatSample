function ChatMessage(id, messageId, messageType, messageDirection, messageContent, originatorType, originatorEmail, originatorName, destinators, formatType) {
	var message = new Object();
	message.date = new Date();
	message.id = id;
	message.messageId = messageId;
	message.messageType = messageType;
	message.messageContent = Utility.isValidObject(messageContent, "");
	message.messageDirection = messageDirection;
	message.originatorType = originatorType;
	message.originatorEmail = originatorEmail;
	message.originatorName = originatorName;
	message.destinators = destinators;
	message.formatType = formatType; 
	message.confirmation = 0; 
	message.referenceId = (new Date()).getTime(); 
	
	
	this.getId = function() {
		return message.id;
	};
	this.setId = function(id) {
		message.id = id;
	}; 

	
	this.getMessageId = function() {
		return message.messageId;
	};
	
	
	this.getMessage = function() {
		return message;
	};
	
	this.getOriginatorType = function() {
		return message.originatorType; 
	};
	
	
	this.getOriginatorName = function() {
		return message.originatorName; 
	};
	
	
	this.getFormatType = function() {
		return message.formatType; 
	};
	
	
	this.getMessageDirection = function() {
		return message.messageDirection; 
	};
	
	
	this.isInboundMessage = function() {
		return (message.messageDirection == MessageTypes.IN); 
	};
	
	
	this.isOutboundMessage = function() {
		return (message.messageDirection == MessageTypes.OUT); 
	};
	
	
	this.hasToSendAcknowledgement = function() {
		return (
				((message.messageType == MessageTypes.MSG_CHAT_CLIENT_MESSAGE) || 
				 (message.messageType == MessageTypes.MSG_CHAT_AGENT_MESSAGE) || 
				 (message.messageType == MessageTypes.MSG_CHAT_AGENT_MESSAGE_TO_AGENT)) 
				&& (message.messageDirection == MessageTypes.IN));
	};
	
	
	this.getMessageContent = function() {
		switch (message.messageType) {
//			case MessageTypes.MSG_CHAT_CLIENT_REQUEST:
//				return "New request received";
				
			case MessageTypes.MSG_CHAT_CLIENT_TERMINATE:
				return "Chat terminated by the client";
				
			case MessageTypes.MSG_CHAT_AGENT_TERMINATE:
				return "Chat terminated by the agent";
				
			case MessageTypes.MSG_CHAT_AGENT_REMOVE_AGENT_FROM_CHAT:
				return "Agent " + message.originatorName + " exited the conference";
				
			case MessageTypes.MSG_CHAT_CLIENT_REQUEST:
			case MessageTypes.MSG_CHAT_AGENT_ADD_AGENT_TO_CHAT:
			case MessageTypes.MSG_CHAT_AGENT_ACCEPT:
			case MessageTypes.MSG_CHAT_AGENT_ACCEPT:
			case MessageTypes.MSG_CHAT_CLIENT_MESSAGE:
			case MessageTypes.MSG_CHAT_AGENT_MESSAGE:
			case MessageTypes.MSG_CHAT_AGENT_MESSAGE_TO_AGENT:
			case MessageTypes.MSG_CHAT_AGENT_TRANSFER:
				return message.messageContent;
		}
		
		return message.messageContent != null ? message.messageContent : ""; 
	};
	
	
	this.messageReceived = function(fromEmail) {
		message.confirmation++;
		
		Console.log("handleChatMessageReceivedByCLient id [" + message.id + "] MessageId [" + message.messageId + "] Received Confirmation Message Read From [" + fromEmail + "] Need [" + message.destinators.length+ "] confirmation Received [" + message.confirmation + "]");
	};
	
	
	this.allConfirmationReceived = function() {
		return (message.destinators.length <= message.confirmation);
	};
	
	
	this.setOriginatorType = function(originatorType) {
		message.originatorType = originatorType;
	};
	
	
	this.getMessageTime = function() {
		if ((message.messageDirection == MessageTypes.OUT)  && (message.originatorType != MessageTypes.STATE_DELIVERED)) {
			return "Pending";
		} else {
			return message.date.getHours() + ":" + (message.date.getMinutes() < 10 ? "0" : "") +  message.date.getMinutes();
		}
	};

	this.getReferenceId = function() {
		return "chat-row-" + message.referenceId;
	};
}
