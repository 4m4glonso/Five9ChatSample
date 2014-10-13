var gSocketCommunication = null;

function SocketCommunication() {
    var readyToSend = false;
    var socket = null;
    var closing = false;
    
    var networkIndicator = new NetworkIndicator();

    var messageId  = 0;
    
    var deferred = $.Deferred();
    
    
    this.init = function() {
    	wait();
    	
    	return deferred;
    };
    
    
    this.reset = function() {
    	Console.log("***** Closing the socket");
    	
    	readyToSend = false;
    	
    	closing = true;
    	
    	socket.close();
    	socket = null;
    	
        messageId  = 0;
    };
    
    
    function wait() {
    	if (!readyToSend) {
    		return setTimeout(wait, 100);
    	}
    	
    	deferred.resolve();
    	
    	return ;
    };
    
    
    function initializeSocket() {
        Console.log( "Initialize Socket", gSession.getSocketUrl());
    	
        readyToSend = false;
        
        if ("WebSocket" in window) {
            socket = new WebSocket(gSession.getSocketUrl());
            
            socket.onopen = function() {
                OnSocketOpen();
            };
            
            socket.onerror = function() {
                OnSocketError();
            };

            socket.onmessage = function (event) {
                OnSocketMessage(event);
            };
            
            socket.onclose = function() {
                OnSocketClose();
            };
            
            Console.log("***** socket === ", socket);
            
            return;
        }
        
        gMessageHandler.handleMessage(new getError(MessageTypes.MSG_BROWSER_NOT_SUPPORTED));
    };
    
    
    function OnSocketOpen() {
    	Console.log( "OnSocketOpen");
    	
    	networkIndicator.setState(true);
    	
        readyToSend = true;
        
        if (typeof(gSession.getIsSessionAlive) == "function") {
            if (!gSession.getIsSessionAlive()) {
                return ;
            }
        } else {
            if (!gSession.isLoggedIn() && !gSession.getForceLogin()) {
    	        if (gLoginEventHandler != null) {
            		gLoginEventHandler.setErrorMessage("");
            	}
    	        
                return;
            }
        }

        gMessageSender.sendRenewSession();
    };
    
    
    function OnSocketError() {
    	Console.log( "OnSocketError");
    	
    	networkIndicator.setState(false);
    }
    
    
    function OnSocketMessage(event) {
    	// Console.log( "OnSocketMessage", event);
    	
    	networkIndicator.setState(true);
    	
        var lvMsg = JSON.parse(event.data);
        
        if (lvMsg != null) {
            gMessageHandler.handleMessage(lvMsg);
        }
    };
    
    
    function OnSocketClose() {
    	Console.log( "OnSocketClose");
    	
    	networkIndicator.setState(false);

    	readyToSend = false;
        socket = null;
        
        if (closing) {
        	return ;
        }
        
        if (typeof(gSession.getIsSessionAlive) == "function") {
            if (!gSession.getIsSessionAlive()) {
            	Console.info("Connection not available!");
        	}
        } else {
	        if (!gSession.isLoggedIn()) {
    	        Console.info("Connection not available!");
        	}
        }

        setTimeout(initializeSocket, 5000);
    };
    
    
    function getError(_errorCode) {
        this.msgType = _errorCode;
        this.status = _errorCode;
    };
    
    
    function getMessageId() {
    	return messageId++;
    };

    
    function getHeader(from, to, msgType) {
        this.id = getMessageId();
        this.from = from;
        this.to = to;
        this.msgType = msgType;
        this.tenantId = gSession.getTenantId() == null ? -1 : gSession.getTenantId();
    };
	
	
	function getMessage(_msgType, _username, _body) {
		if (_username == null) {
	        this.messageId = getMessageId();
	        this.msgType = _msgType;
	        this.tenantId = gSession.getTenantId() == null ? -1 : gSession.getTenantId();
	        this.chatId = gSession.getId();
		} else {
	        this.header = new getHeader(_username, "server", _msgType);
		}
        
        if (_body != null) {
            this.body = _body;
        }
    };
    
    
    this.getIsReadyToSend = function() {
        return readyToSend;
    };

    
    this.sendMessage = function(_msgType, _username, _body) {
        if (readyToSend == false) {
          return;
        }

        if (socket == null) {
           return;
        }
        
        var message = new getMessage(_msgType, _username, _body);
        
        Console.debug( "Communication sendMessage", message);
        
        // Console.debug( "Communication json send", JSON.stringify(message));
        
        socket.send(JSON.stringify(message));
    };
    
    
    initializeSocket();
}
