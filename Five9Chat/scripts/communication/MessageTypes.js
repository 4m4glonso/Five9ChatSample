var MessageTypes = new Object();

MessageTypes.MSG_BROWSER_NOT_SUPPORTED          	= -100;
MessageTypes.MSG_CONNECTION_NOT_AVAILABLE       	= -101;

MessageTypes.RESULT_SUCCESS                     	=  1;
MessageTypes.RESULT_ERROR                       	= -1;

MessageTypes.MSG_GET_TENANT_ID   					= 97;

MessageTypes.MSG_GET_PROFILE_SURVEY					= 700;

MessageTypes.MSG_CHAT_KEEP_ALIVE					= 17000;
MessageTypes.MSG_CHAT_CLIENT_REQUEST				= 17001;
MessageTypes.MSG_CHAT_CLIENT_MESSAGE				= 17002; 
MessageTypes.MSG_CHAT_CLIENT_TERMINATE				= 17003;
MessageTypes.MSG_CHAT_CLIENT_MESSAGE_RECEIVED		= 17004;
MessageTypes.MSG_CHAT_CLIENT_TYPING     			= 17005;
MessageTypes.MSG_CHAT_CLIENT_RENEW					= 17006;
MessageTypes.MSG_CHAT_CLIENT_TRANSFER_TO_GROUP  	= 17007;
MessageTypes.MSG_NO_SERVICE							= 17008;


MessageTypes.MSG_CHAT_AGENT_ACCEPT					= 18000;
MessageTypes.MSG_CHAT_AGENT_MESSAGE					= 18001;
MessageTypes.MSG_CHAT_AGENT_TERMINATE				= 18002;
MessageTypes.MSG_CHAT_AGENT_TRANSFER				= 18003;
// MessageTypes.MSG_CHAT_AGENT_MESSAGE_TO_AGENT		= 18004;
MessageTypes.MSG_CHAT_AGENT_TYPING     				= 18005;
MessageTypes.MSG_CHAT_AGENT_MESSAGE_RECEIVED		= 18007;
MessageTypes.MSG_CHAT_AGENT_ADD_AGENT_TO_CHAT		= 18008;
MessageTypes.MSG_CHAT_AGENT_REMOVE_AGENT_FROM_CHAT	= 18009;

MessageTypes.MSG_GET_SESSION_INFORMATION			= 19000;



MessageTypes.MSG_TEXT									= 1;
MessageTypes.MSG_HTML									= 2;
MessageTypes.MSG_VOICE									= 3;
MessageTypes.MSG_VIDEO									= 4;
MessageTypes.MSG_FILE									= 5;

MessageTypes.STATE_PENDING								= 1;
MessageTypes.STATE_DELIVERED							= 2;
MessageTypes.STATE_TYPING								= 3;
MessageTypes.STATE_DELETING								= 4;

MessageTypes.FROM_AGENT									= 1;
MessageTypes.FROM_CLIENT								= 2;
MessageTypes.FROM_SERVER								= 3;
MessageTypes.FROM_TYPING								= 4;

MessageTypes.CHAT_STATE_ACTIVE							= 1;
MessageTypes.CHAT_STATE_TEMINATED						= 2;

MessageTypes.IN											= 1;
MessageTypes.OUT										= 2;



MessageTypes.getDescription = function(msgType) {
	switch(msgType) {
		case MessageTypes.MSG_CHAT_KEEP_ALIVE: return "Keep Alive";
		case MessageTypes.MSG_CHAT_CLIENT_REQUEST: return "Chat Client Request";
		case MessageTypes.MSG_CHAT_CLIENT_MESSAGE:  return "Chat Client Message";
		case MessageTypes.MSG_CHAT_CLIENT_TERMINATE: return "Chat Client Terminate";
		case MessageTypes.MSG_CHAT_CLIENT_MESSAGE_RECEIVED: return "Chat Client Message Received";
		case MessageTypes.MSG_CHAT_CLIENT_TYPING: return "Chat Client Typing";
		case MessageTypes.MSG_CHAT_CLIENT_RENEW: return "Renew Chat Session Received";
		case MessageTypes.MSG_CHAT_AGENT_ACCEPT: return "Chat Agent Accept";
		case MessageTypes.MSG_CHAT_AGENT_MESSAGE: return "Chat Agent Message";
		case MessageTypes.MSG_CHAT_AGENT_TERMINATE: return "Chat Agent Terminate";
		case MessageTypes.MSG_CHAT_AGENT_TRANSFER: return "Chat Agent Transfer";
		case MessageTypes.MSG_CHAT_AGENT_MESSAGE_TO_AGENT: return "Chat Agent To Agent";
		case MessageTypes.MSG_CHAT_AGENT_TYPING: return "Chat Agent Typing";
		case MessageTypes.MSG_CHAT_AGENT_MESSAGE_RECEIVED: return "Chat Agent Message Received";
		case MessageTypes.MSG_CHAT_AGENT_ADD_AGENT_TO_CHAT: return "Add Agent To Conference";
		case MessageTypes.MSG_CHAT_AGENT_REMOVE_AGENT_FROM_CHAT: return "Remove Agent From Conference";
		default: return "Unknow Type [" + msgType+ "]";
	}
};


