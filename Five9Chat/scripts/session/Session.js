var gSession = null;

function Session() {
    var KEEP_ALIVE = 10000;
    
    var keepAliveTimer = null;
    
	var session = new Object();
	session.tenant = null;
	session.tenantId = null;
	session.id = null;
	session.email = null;
	session.name = null;
	session.isSessionAlive = false;
	session.sessionId = null;
	session.profiles = [];
	session.css = null;
	session.theme = null;
	session.groupId = null;
	
	session.agentId = -1;
	session.agentName = null;
	
	session.profileSurvey = null;
	
	var chatRequest = null;

	this.setId = function(id) {
		session.id = id;
	};
	this.getId = function() {
		return session.id;
	};
	
    
	this.setCSS = function (css) {
    	session.css = css;
    };
    this.getCSS = function () {
    	return session.css;
    };
    
    
    this.setTheme = function(theme) {
    	session.theme = theme;
    };
    this.getTheme = function() {
    	return session.theme;
    };
	
	
    this.setSessionId = function(sessionId) {
    	if (sessionId.length > 0) {
        	session.sessionId = sessionId;	
    	}
    };
    this.getSessionId = function() {
    	return session.sessionId;	
    };
    this.hasSessionId = function() {
    	return (session.sessionId != null);	
    };
    
	this.setProfiles = function(profiles) {
    	if (profiles.length > 0) {
    		session.profiles = profiles.split(",");
    	}
	};
	this.getProfiles = function() {
		return session.profiles;
	};
	
	this.setGroupId = function(groupId) {
		session.groupId = groupId;
	};
	this.getGroupId = function() {
		return session.groupId;
	};
	
	
	this.setChatRequest = function(_chatRequest) {
		chatRequest = _chatRequest;
	};
	this.getChatRequest = function() {
		chatRequest.id = session.id;
		return chatRequest;
	};
	
	
	this.setTenant = function(tenant) {
    	if (tenant.length > 0) {
    		session.tenant = tenant;
    	}
	};
	this.getTenant = function() {
		return session.tenant;
	};
	this.getTenantId = function() {
		return session.tenantId;
	};
	this.setTenantId = function(tenantId) {
		return session.tenantId = tenantId;
	};

	
	this.setEmail = function(email) {
		session.email = email;
	};
	this.getEmail = function() {
		return session.email;
	};
	
	
	this.setName = function(name) {
		session.name = name;
	};
	this.getName = function() {
		return session.name;
	};
	
	
	this.getProfileSurvey = function() {
		Console.log("getProfileSurvey", session.profileSurvey);
		
		return session.profileSurvey;
	};
	this.setProfileSurvey = function(profileSurvey) {
		Console.log("setProfileSurvey", profileSurvey);
		
		session.profileSurvey = profileSurvey;
	};
	this.hasProfileSurvey = function() {
		Console.log("hasProfileSurvey",  (session.profileSurvey != null && session.profileSurvey.enableSurvey == 1));
		
		return (session.profileSurvey != null && session.profileSurvey.enableSurvey == 1);
	};
	
	
	this.setIsSessionAlive = function(isSessionAlive) {
		session.isSessionAlive = isSessionAlive;
		
		if (session.isSessionAlive) {
			startKeepAliveSessionMessage();
		} else {
			stopKeepAliveSessionMessage();
		}
	};
	this.getIsSessionAlive = function() {
		return session.isSessionAlive;
	};
	
	
	this.getSocketUrl = function() {
		return ACCESS.SOCKET_URL; 
	};
	this.getChatUrl = function() {
		return ACCESS.ADMIN_URL;
	};
    this.getAdminUrl = function() {
		return ACCESS.ADMIN_URL;
    };

	
	this.isLoggedIn = function() {
		return false;
	};
	
	this.getForceLogin = function() {
		return false;
	};
	
	this.getIsMobile = function() {
		return ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/Android/i)));
	};
	

//	this.setAgentId = function(agentId) {
//		session.agentId = agentId;
//	};
//	this.getAgentId = function() {
//		return session.agentId;
//	};
	
	
//	this.setAgentName = function(agentName) {
//		session.agentName = agentName;
//	};
//	this.getAgentName = function() {
//		return session.agentName;
//	};

	
	function startKeepAliveSessionMessage() {
		keepAliveTimer = setInterval(gMessageSender.sendKeepAlive, KEEP_ALIVE);
	};
	
	
	function stopKeepAliveSessionMessage() {
		clearInterval(keepAliveTimer);
		keepAliveTimer = null;
	};


	this.trace = function() {
		Console.log(session);
	};
}