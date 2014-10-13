var gChatMessageHandler = null;

function ChatMessageHandler() {
	
	this.handleMessage = function(jsonMessage) {
		switch (jsonMessage.msgType) {
	    	case MessageTypes.MSG_CHAT_KEEP_ALIVE: 
	    	case MessageTypes.MSG_CHAT_CLIENT_MESSAGE:
	    	case MessageTypes.MSG_CHAT_CLIENT_MESSAGE_RECEIVED:
	        case MessageTypes.MSG_CHAT_CLIENT_TYPING:
	        	handleConfirmationMessageFromServer(jsonMessage);
				return ;
				
	        case MessageTypes.MSG_CHAT_AGENT_TRANSFER:
				handleAgentChatTransferMessage(jsonMessage);
	        	return;
	        	
	    	case MessageTypes.MSG_CHAT_CLIENT_REQUEST:
				handleClientChatRequestMessage(jsonMessage);
				return ;
				
	    	case MessageTypes.MSG_CHAT_CLIENT_RENEW:
				handleClientRenewChatRequestMessage(jsonMessage);
				return ;

	    	case MessageTypes.MSG_CHAT_CLIENT_TERMINATE:
				handleChatTerminatedByClient(jsonMessage);
				return ;
				
	    	case MessageTypes.MSG_CHAT_AGENT_ACCEPT:
				handleChatAcceptedByAgent(jsonMessage);
				return;
	
	    	case MessageTypes.MSG_CHAT_AGENT_MESSAGE:
				handleChatMessageFromAgent(jsonMessage);
				return;
				
	    	case MessageTypes.MSG_CHAT_AGENT_TERMINATE:
				handleChatTerminatedByAgent(jsonMessage);
				return;
				
	        case MessageTypes.MSG_CHAT_AGENT_TYPING:
				handleAgentTypingMessage(jsonMessage);
				return;
				
	        case MessageTypes.MSG_CHAT_AGENT_MESSAGE_RECEIVED:
				handleChatMessageAcknowledgement(jsonMessage);
				return;
				
	        case MessageTypes.MSG_CHAT_AGENT_ADD_AGENT_TO_CHAT:
		    	handleAddAgentToChat(jsonMessage);
	        	return ;
	        	
		    case MessageTypes.MSG_CHAT_AGENT_REMOVE_AGENT_FROM_CHAT:
		    	handleRemoveAgentFromChat(jsonMessage);
				return ;
				
		    case MessageTypes.MSG_CHAT_CLIENT_TRANSFER_TO_GROUP:
		    	handleTransferToGroupMessage(jsonMessage);
		    	return ;
		    	
		    case MessageTypes.MSG_GET_SESSION_INFORMATION:
		    	handleGetSessionInformation(jsonMessage);
		    	return ;
		    	
		    case MessageTypes.MSG_GET_PROFILE_SURVEY:
		    	handleGetProfileSurvey(jsonMessage);
		    	return ;
		    	
		    case MessageTypes.MSG_NO_SERVICE:
		    	handleNoServiceMessage(jsonMessage);
		    	return ;
		}		
	};
	
	function handleConfirmationMessageFromServer(jsonMessage) {
		Console.log( "handleConfirmationMessageFromServer", jsonMessage);
	};
	
	
	function handleClientChatRequestMessage(jsonMessage) {
		Console.log( "handleClientChatRequestMessage", jsonMessage);

		if (jsonMessage.status == MessageTypes.RESULT_SUCCESS) {
			gSession.setIsSessionAlive(true);
			
			var chatResponse = jsonMessage.body;
			gSession.setId(chatResponse.id);
			// gSession.setTenantId(chatResponse.tenantId);
			
			var waitMessage = JSON.parse(chatResponse.waitMessage);
			
			gChatEventHandler.handleClientChatRequest(new ChatMessage(chatResponse.id, 0, jsonMessage.msgType, MessageTypes.IN, waitMessage.content, MessageTypes.FROM_SERVER, null, waitMessage.displayName, new Array(), MessageTypes.MSG_TEXT));
			
			return ;
		}

		handleMessageError(jsonMessage);
	};


	function handleClientRenewChatRequestMessage(jsonMessage) {
		Console.log( "handleClientRenewChatRequestMessage", jsonMessage);

		if (jsonMessage.status == MessageTypes.RESULT_SUCCESS) {
			/**
			 * Nothing to do...
			 */
			return ;
		}

		handleMessageError(jsonMessage);
	};
	
	
	function handleChatTerminatedByClient(jsonMessage) {
		Console.log( "handleChatTerminatedByClient", jsonMessage);
		
		var chatMessage = JSON.parse(jsonMessage.body.terminateMessage);
		gChatEventHandler.handleTerminateChatMessage(new ChatMessage(jsonMessage.id, chatMessage.messageId, jsonMessage.msgType, MessageTypes.IN, chatMessage.content, MessageTypes.FROM_CLIENT, gSession.getEmail(), gSession.getName(), new Array(), MessageTypes.MSG_TEXT));
	};
	
	
	function handleChatTerminatedByAgent(jsonMessage) {
		Console.log( "handleChatTerminatedByAgent", jsonMessage);

		gChatEventHandler.handleTerminateChatMessage();
	};

	
	function handleChatAcceptedByAgent(jsonMessage) {
		Console.log( "handleChatAcceptedByAgent", jsonMessage);
		
		var agentName = jsonMessage.body.displayName;
		var agentEmail = jsonMessage.body.username;
		
		gChatEventHandler.addAgent(new Agent(agentEmail, agentName), null);
		
		gChatEventHandler.handleChatAcceptedByAgent();
	};

	
	function handleChatMessageFromAgent(jsonMessage) {
		Console.log( "handleChatMessageFromAgent", jsonMessage);
		
		var chatMessage = JSON.parse(jsonMessage.body);
		gChatEventHandler.handleNewChatMessage(new ChatMessage(chatMessage.id, chatMessage.messageId, jsonMessage.msgType, MessageTypes.IN, chatMessage.content, MessageTypes.FROM_AGENT, jsonMessage.from, chatMessage.displayName, new Array(), MessageTypes.MSG_TEXT));
	};

	
	function handleAgentTypingMessage(jsonMessage) {
		Console.log( "handleAgentTypingMessage", jsonMessage);
		
		gChatEventHandler.handleTypingMessage();
	};
	
	
	function handleChatMessageAcknowledgement(jsonMessage) {
		Console.log( "handleChatMessageAcknowledgement", jsonMessage);
		
		gChatEventHandler.handleChatMessageAcknowledgement(parseInt(jsonMessage.messageId), jsonMessage.from);
	};


	function handleAddAgentToChat(jsonMessage) {
		Console.log( "handleAddAgentToChat", jsonMessage);
		
		var agentAdding = new Agent(jsonMessage.agent.username, jsonMessage.agent.fname); 
		var agentAdded = new Agent(jsonMessage.username, jsonMessage.username); 
		
		gChatEventHandler.addAgent(agentAdded, new ChatMessage(jsonMessage.id, (new Date()).getTime(), jsonMessage.msgType, MessageTypes.IN, "Agent " + agentAdded.getName() + " added to the conference", MessageTypes.FROM_AGENT, agentAdding.getUsername(), agentAdding.getName(), new Array(), MessageTypes.MSG_TEXT));
	};

	
	function handleRemoveAgentFromChat(jsonMessage) {
		Console.log( "handleRemoveAgentFromChat", jsonMessage);
		
		var agent = gChatEventHandler.getAgent(jsonMessage.username);
		
		var agentEmail = jsonMessage.username;
		var agentName = agent.getName();
		
		gChatEventHandler.removeAgent(new Agent(agentEmail, agentName), new ChatMessage(jsonMessage.id, (new Date()).getTime(), jsonMessage.msgType, MessageTypes.IN, null, MessageTypes.FROM_AGENT, agentEmail, agentName, new Array(), MessageTypes.MSG_TEXT));
	};
	
	
	function handleTransferToGroupMessage(jsonMessage) {
		Console.log( "handleRemoveAgentFromChat", jsonMessage);

		var chatId = jsonMessage.itemId;
		var groupId = jsonMessage.groupId;
		var groupName = jsonMessage.groupName;
		
		gChatEventHandler.handleNewChatMessage(new ChatMessage(chatId, -10, jsonMessage.msgType, MessageTypes.IN, "You have been transfered to the group " + groupName, MessageTypes.FROM_SERVER, null, "Server", new Array(), MessageTypes.MSG_TEXT));
	};

	
	function handleAgentChatTransferMessage(jsonMessage) {
		Console.log( "handleAgentChatTransferMessage", jsonMessage);
	
		var agentFromJSon = jsonMessage.agentFrom;
		var agentToJSon = jsonMessage.agentTo;
		
		var agentFrom = new Agent(agentFromJSon.username, agentFromJSon.fname);
		var agentTo = new Agent(agentToJSon.username, agentToJSon.fname);
		
		var msgFrom = "Agent " + agentFrom.getName() + " transfered the chat to " + agentTo.getName();
		gChatEventHandler.removeAgent(agentFrom, new ChatMessage(jsonMessage.id, (new Date()).getTime(), jsonMessage.msgType, MessageTypes.IN, msgFrom, MessageTypes.FROM_AGENT, agentFrom.getUsername(), agentFrom.getName(), new Array(), MessageTypes.MSG_TEXT));

		var msgTo = "Agent " + agentTo.getName() + " is now chatting with you!";
		gChatEventHandler.addAgent(agentTo, new ChatMessage(jsonMessage.id, (new Date()).getTime(), jsonMessage.msgType, MessageTypes.IN, msgTo, MessageTypes.FROM_AGENT, agentTo.getUsername(), agentTo.getName(), new Array(), MessageTypes.MSG_TEXT));
	};
	
	
	function handleGetSessionInformation(jsonMessage) {
		Console.log( "handleGetSessionInformation", jsonMessage);

		var tenant = jsonMessage.tenant; 
		var profileName = jsonMessage.profileName; 
		var groupId = jsonMessage.groupId; 
		
		var firstName = null; 
		var lastName = null; 
		var email = null; 
		var question = null;
		
		var parameters = JSON.parse(jsonMessage.parameters);
		for (var i=0; i<parameters.length; i++) {
			if (parameters[i].key == "firstName") {
				firstName = parameters[i].value; 
			}
			
			if (parameters[i].key == "lastName") {
				lastName = parameters[i].value; 
			}

			if (parameters[i].key == "email") {
				email = parameters[i].value; 
			}

			if (parameters[i].key == "firstQuestion") {
				question = parameters[i].value; 
			}
		}

		gChatEventHandler.handleSessionInformaiton(tenant, profileName, groupId, firstName + " " + lastName, email, question);
	};
	
	
	function handleGetProfileSurvey(jsonMessage) {
		Console.log( "handleGetProfileSurvey", jsonMessage);
		
		if (jsonMessage.status == MessageTypes.RESULT_SUCCESS) {
			gSession.setProfileSurvey(jsonMessage.survey);
		}		
	};
	
	
	
	function handleNoServiceMessage(jsonMessage) {
		Console.log("handleNoServiceMessage", jsonMessage);
		
		var noServiceMessage = jsonMessage.noService;
		var emailProfile = jsonMessage.emailProfile;
		
		
	};
	
	
	function handleMessageError(jsonMessage) {
		Console.log( "handleMessageError", jsonMessage);
		
		$.mobile.changePage("#error-page");

//		gChatEventHandler.hideInformationPanel();
//		gChatEventHandler.hideConnectingPanel();
//		gChatEventHandler.hideConversationPanel();
//		gChatEventHandler.showErrorPanel();
	};
}