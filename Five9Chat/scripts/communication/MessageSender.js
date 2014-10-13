var gMessageSender = null;

function MessageSender() {
	var MAX_NBTRIES = 10;
	var nbrTries = 0;
	
    function getTenantId(tenantName) {
    	Console.log("MessageSender - getTenantId for " + tenantName);
        
        var lvPathname  = "/tenants/" + tenantName + "/id";
        
        gSession.setTenantId(-1);
        
        gHTTPCommunication.GET(lvPathname, null, gSession.getAdminUrl());
    };
    
    
	this.sendKeepAlive = function() {
	    Console.log("MessageSender - sendKeepAlive");
	    
		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_KEEP_ALIVE, null, null);
	};
	
	
	this.sendChatRequest = function(chatRequest) {
	    Console.log("MessageSender - sendChatRequest", chatRequest);
	    
		if (gSession.getTenantId() == null || gSession.getTenantId() == -1) {
			if (gSession.getTenantId() == null) {
				getTenantId(chatRequest.tenantName);
			}
			
			if (nbrTries++ < MAX_NBTRIES) {
				setTimeout(function () { gMessageSender.sendChatRequest(chatRequest); }, 1000);
				
				return; 
			}

			// gLoginEventHandler.setErrorMessage("Can't get the tenantId, please contact the administrator");

			return; 
		}
		
	    gSession.setChatRequest(chatRequest);

		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_REQUEST, null, chatRequest);
	};
	

    this.sendRenewSession = function() {
	    Console.log("MessageSender - sendRenewChatSession", gSession.getChatRequest());

		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_RENEW, null, gSession.getChatRequest());
	};
	
	
	this.sendAgentMessageReceived = function(id, messageId, usernames) {
	    var lvBody = { "id": id };
	    lvBody.tenantId = gSession.getTenantId();
	    lvBody.messageId = messageId;
	    lvBody.usernames = usernames;
	    
	    Console.log("MessageSender - sendMessageReceived", lvBody);
	    
		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_MESSAGE_RECEIVED, null, lvBody);
	};
	

	this.sendMessageToAgent = function(id, message, usernames) {
	    var lvBody = { "id": id };
	    lvBody.tenantId = gSession.getTenantId();
	    lvBody.messageId = message.getMessageId();
	    lvBody.displayName = message.getOriginatorName();
	    lvBody.type = message.getFormatType();
	    lvBody.content = message.getMessageContent();
	    lvBody.usernames = usernames;
		
	    Console.log("MessageSender - sendMessageToAgent", lvBody);
	    
		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_MESSAGE, null, lvBody);
	};
	
	
	this.sendTyping = function(id, typing, usernames) {
	    var lvBody = { "id": id };
	    lvBody.typing = typing ? 1 : 0;
	    lvBody.tenantId = gSession.getTenantId();
	    lvBody.usernames = usernames;
	    
	    Console.log("MessageSender - sendTyping", lvBody);
	    
		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_TYPING, null, lvBody);
	};
	
	
	this.sendClientTerminateChat = function(id, usernames) {
	    var lvBody = { "id": id };
	    lvBody.tenantId = gSession.getTenantId();
	    lvBody.usernames = usernames;
	    
	    Console.log("MessageSender - sendAgentTerminateChat", lvBody);
	    
		gSocketCommunication.sendMessage(MessageTypes.MSG_CHAT_CLIENT_TERMINATE, null, lvBody);
	};
	
	
    this.getSessionInformation = function(sessionId) {
        Console.debug("MessageSender - getSessionInformation ", sessionId);
        
        var lvPathname  = "/text/session/" + sessionId;

        gHTTPCommunication.GET(lvPathname, null, gSession.getChatUrl());
    };
    
    
    this.getProfileSurvey = function(tenant, profile) {
        Console.debug("MessageSender - getProfileSurvey ", tenant, profile);
        
        var lvPathname  = "/tenants/" + tenant + "/profiles/" + profile + "/profilesurvey";

        gHTTPCommunication.GET(lvPathname, null, gSession.getChatUrl());
    };


	this.log = function(severity, msg) {
		if (gSession.getTenant() == null || gSession.getAgent() == null) {
			return ;
		}
		
        var lvPathname  = "/tenants/" + gSession.getTenant().getId() + "/logs/" + gSession.getAgent().getId();  

        var object = new Object();
        object.date = (new Date()).toString(); 
        object.severity = severity; 
        object.msg = msg; 
        
        console.log(object);
        
        gHTTPCommunication.POSTEx(lvPathname, object, gSession.getAdminUrl(), null);
	};
}