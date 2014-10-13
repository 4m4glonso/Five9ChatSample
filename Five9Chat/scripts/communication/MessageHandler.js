var gMessageHandler = null;

function MessageHandler() {
    this.handleMessage = function(lvMsg) {
    	
//    	if (typeof lvMsg.msgType === "undefined") {
//    		lvMsg.msgType = MessageTypes.MSG_GET_SESSION_INFORMATION;
//    	}
    	
    	lvMsg.desc = MessageTypes.getDescription(lvMsg.msgType); 
        
        if (Utility.isValidObject(lvMsg.MsgType, null) != null) {
        	lvMsg.msgType = lvMsg.MsgType;
        	lvMsg.status = lvMsg.Status;
        }
        
        switch (lvMsg.msgType) {
	    	case MessageTypes.MSG_GET_TENANT_ID:
	    		if (lvMsg.status == 1) {
	    			gSession.setTenantId(lvMsg.id);
	    		}

	    		return ;
	    		
	        case MessageTypes.MSG_CHAT_KEEP_ALIVE:
	        case MessageTypes.MSG_CHAT_CLIENT_REQUEST:
	        case MessageTypes.MSG_CHAT_CLIENT_MESSAGE: 
	        case MessageTypes.MSG_CHAT_CLIENT_TERMINATE:
	        case MessageTypes.MSG_CHAT_CLIENT_MESSAGE_RECEIVED:
	        case MessageTypes.MSG_CHAT_CLIENT_TYPING:
	        case MessageTypes.MSG_CHAT_AGENT_ACCEPT:
	        case MessageTypes.MSG_CHAT_AGENT_MESSAGE:
	        case MessageTypes.MSG_CHAT_AGENT_TERMINATE:
	        case MessageTypes.MSG_CHAT_AGENT_TRANSFER:
	        case MessageTypes.MSG_CHAT_AGENT_MESSAGE_TO_AGENT:
	        case MessageTypes.MSG_CHAT_AGENT_TYPING:
	        case MessageTypes.MSG_CHAT_AGENT_MESSAGE_RECEIVED:
	        case MessageTypes.MSG_CHAT_AGENT_REMOVE_AGENT_FROM_CHAT:
	        case MessageTypes.MSG_CHAT_AGENT_ADD_AGENT_TO_CHAT:
	        case MessageTypes.MSG_CHAT_CLIENT_RENEW:
		    case MessageTypes.MSG_CHAT_CLIENT_TRANSFER_TO_GROUP:
		    case MessageTypes.MSG_GET_SESSION_INFORMATION:
		    case MessageTypes.MSG_GET_PROFILE_SURVEY:
		    case MessageTypes.MSG_NO_SERVICE:
        		gChatMessageHandler.handleMessage(lvMsg);
        		return;
        		
            case MessageTypes.MSG_GET_TENANT:
                if (lvMsg.Status == MessageTypes.RESULT_SUCCESS )  {
                	gSession.setTenantId(jsonMessage.array[0].id);
                }
                
            	return;
        		
	        case MessageTypes.MSG_BROWSER_NOT_SUPPORTED:
	        	Console.error("Need to handle error!");
	        	return ;

        	/**
             * Problem...
             */
            default:
                Console.error("Unknown message type " + lvMsg.msgType);
                return;
        }
    };
}