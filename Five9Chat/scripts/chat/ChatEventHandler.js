var gChatEventHandler = null;

function ChatEventHandler() {
	var container = null;
	var lastMessageFrom = null;
	var chatMessageIdToAgent = 1;
	var typing = null;
	var agents = new Array();
	var agentsInChat = new Array();
	
	var messages = new Array();
	
	
	var messageLayout = null;
    $.get("message.html" + "?seconds=" + (new Date()).getMilliseconds(), function(data) {
        messageLayout = data;
    });

    
    this.init = function() {
		container = $("body");
		
		typing = new ChatTyping(container.find("#messages"));
		
		container.on("keyup", "#inputMessage", function(event) { handleOnKeyUpEvent(event); } );
		
		setProfiles(gSession.getProfiles());
	};
	
	
	this.reset= function() {
		container.off("keyup");
	};
	
	
	function getAgentsInChat() {
		return agentsInChat;
	};
	
	this.getAgent = function(username) {
		return getAgent(username);
	};
	function getAgent(username) {
		for (var i=0; i<agents.length; i++) {
			if (agents[i].getUsername() == username) {
				return agents[i];
			}
		}
		
		return null;
	};
	
	
	this.addAgent = function(agent, message) {
		if (getAgent(agent) == null) {
			agents.push(agent);
			agentsInChat.push(agent.getUsername());
		}
		
		if (message != null) {
			addMessageToDisplay(message);
		}
	};
	
	
	this.removeAgent = function(agent, message) {
		var index = -1;
		
		for (var i=0; i<agents.length; i++) {
			if (agents[i].getUsername() == agent.getUsername()) {
				index = i;
				break;
			}
		}
		
		if (index > -1) {
			agents.splice(index, 1);
		}
		
		index = agentsInChat.indexOf(agent.getUsername());
		if (index > -1) {
			agentsInChat.splice(index, 1);
		}
		
		if (message != null) {
			addMessageToDisplay(message);
		}
	};
	
	
	this.handleSendEmailOnButtonClicked = function() {
		Console.log("handleSendEmailOnButtonClicked");
		
		moveToEmail();
	};
	
	
	function moveToEmail() {
//		var group = "";
//		
//		var survey = gSession.getProfileSurvey();
//		if (survey.groupId) {
//			group = "&groupId=" + survey.groupId;
//		}
//
//		var url = "?profile=" + getProfileName() + "&tenant=" + getTenantName() + "&templateId=" + survey.templateId +  "&templateThankyouMessage=" + survey.templateThankyouMessage + "&templateQuestion=" + survey.templateQuestion + "&css=" + gSession.getCSS() + "&theme=" + gSession.getTheme() + "&fromMedia=" + 2 + "&itemId=" + gSession.getId() + group;
//		
//		window.location.replace("../SurveyConsole/index.html" + url);
	};

	
	this.handlePrintOnButtonClicked = function() {
        var content = document.getElementById('messages').innerHTML;

        var pwin=window.open('','print_content','width=400,height=250');

        pwin.document.open();
        pwin.document.write("<html><head><link rel=\"Stylesheet\" title=\"Default Stylesheet\" media=\"Screen\" href=\"./css/chat.css\"></head><body style=\"margin: 10px;\" onload=\"window.print()\">" + content + "</body></html>");
        pwin.document.close();

        setTimeout(function() { pwin.close(); }, 1000);
	};
	
	
	this.handleClientChatRequest = function(message) {
		$.mobile.changePage("#connecting-page");
		
		/**
		 * Don't present the message in the chat display, present it in the message area
		 */
		setMessage(message.getMessageContent());
	};
	
	
	this.handleTerminateChatMessage = function() {
		Console.log("handleTerminateChatMessage");
		
		typing.stopTimerTyping();
		
		container.find(".chatInputMessageContainer").remove();
		container.find("#buttonTerminateChat").hide();
		
		if (gSession.hasProfileSurvey()) {
			moveToSurvey();
		}
	};
	

	function moveToSurvey() {
		var group = "";
		
		var survey = gSession.getProfileSurvey();
		if (survey.groupId) {
			group = "&groupId=" + survey.groupId;
		}

		var url = "?profile=" + getProfileName() + "&tenant=" + getTenantName() + "&templateId=" + survey.templateId +  "&templateThankyouMessage=" + survey.templateThankyouMessage + "&templateQuestion=" + survey.templateQuestion + "&css=" + gSession.getCSS() + "&theme=" + gSession.getTheme() + "&fromMedia=" + 2 + "&itemId=" + gSession.getId() + group;
		
		window.location.replace("../SurveyConsole/index.jsp" + url);
	};
	
	
	this.handleChatAcceptedByAgent = function() {
		Console.log("handleChatAcceptedByAgent");
		
		$.mobile.changePage("#conversation-page");
		
		$("#conversation-page").css("height", "100% !important");
		
		focusOnInput();
	};
	
	
	this.handleNewChatMessage = function(message) {
		addMessageToDisplay(message);
	};
	
	
	this.handleTypingMessage = function(id) {
		Console.log("handleTypingMessage");
		
		typing.clearTypingTimeout();
		
		addMessageToDisplay(typing.getTypingMessage());

		typing.startTimerToRemoveTyping();
	};
	
	
	this.handleAgentTypingMessage = function() {
		Console.log("handleAgentTypingMessage");

		typing.clearTypingTimeout();

		addMessageToDisplay(typingMessage);
		
		typing.startTimerToRemoveTyping();
	};
	
	
	function handleUpdateChatMessage(message) {
		if (message.allConfirmationReceived()) {
			var date = new Date();
			
			var item = container.find("#messages").find("#" + message.getReferenceId());
			item.find(".chatDisplayTime").html(date.getHours() + ":" + (date.getMinutes() < 10 ? "0" : "") +  date.getMinutes());
		}
	};

	
	this.handleChatMessageAcknowledgement = function(messageId, from) {
		Console.log("handleChatMessageAcknowledgement", messageId);
		
		for (var i=0; i<messages.length; i++) {
			if (messages[i].getMessageId() == messageId) {
				messages[i].messageReceived(from);
				handleUpdateChatMessage(messages[i]);
			}
		}
	};
	
	
	function validateForm() {
		return (getProfileName() != null && getName() != null && getEmail() != null && getQuestion() != null);
	};
	
	
	this.handleOpenSessionOnButtonClicked = function(button) {
		if (!validateForm()) {
			alert("Please complete the required fields!");
			
			$(button).attr('disabled', false);
			return ;
		}
		
		var customFields = new Array();
		customFields.push( { "key": "Subject:", "value": getProfileName(), "analyze": 0} );
		customFields.push( { "key": "Name:", "value": getName(), "analyze": 0 } );
		customFields.push( { "key": "Email:", "value": getEmail(), "analyze": 0 } );
		customFields.push( { "key": "Question:", "value": getQuestion(), "analyze": 1 } );
		
		var author = { "name": getName(), "email": getEmail() };
		
		gSession.setName(getName());
		
		var chatRequest = new Object();
	    chatRequest.tenantName = getTenantName();
	    chatRequest.profileName = getProfileName();
	    chatRequest.groupId = gSession.getGroupId();
	    chatRequest.customFields = customFields;
	    chatRequest.author = author;
		
		gMessageSender.sendChatRequest(chatRequest);
		
		gMessageSender.getProfileSurvey(chatRequest.tenantName, chatRequest.profileName);
		
		window.scrollTo(0,1);
		
		if (gSession.getIsMobile()) {
			var documentElement = document.documentElement;
			if (documentElement.requestFullscreen) {
				documentElement.requestFullscreen();
			} else if (documentElement.msRequestFullscreen) {
				documentElement.msRequestFullscreen();
			} else if (documentElement.mozRequestFullScreen) {
				documentElement.mozRequestFullScreen();
			} else if (documentElement.webkitRequestFullscreen) {
				documentElement.webkitRequestFullscreen();
			}		
		}
	};
	
	
	this.handleSendOnButtonClicked = function() {
		var msg = $("#inputMessage").val().trim();
		if (msg.length == 0) {
			return ;
		}
		
		return send(msg);
	};
	
	
	function handleAddEmoticonToInput(emoticon) {
		$("#inputMessage").val($("#inputMessage").val() + emoticon);
		
		focusOnInput();
	};
	
	
	this.handleTerminateOnButtonClicked = function() {
		Console.log("handleTerminateOnButtonClicked");
		
		gMessageSender.sendClientTerminateChat(gSession.getId(), agentsInChat);
		
		addMessageToDisplay(new ChatMessage(gSession.getId(), chatMessageIdToAgent++, MessageTypes.MSG_CHAT_CLIENT_TERMINATE, MessageTypes.IN, null, MessageTypes.FROM_CLIENT, gSession.getEmail(), gSession.getName(), new Array(), MessageTypes.MSG_TEXT));
		
		gChatEventHandler.handleTerminateChatMessage();
	};
	
	
	this.handleEmoticonsOnButtonClicked = function(button, event) {
		if (gPopupEmoticons == null) {
			gPopupEmoticons = new PopupEmoticons();
		}
		gPopupEmoticons.open(event, handleAddEmoticonToInput);
	    return ;
	};
	
	
	this.handleSessionInformaiton = function(tenant, profileName, groupId, name, email, question) {
		gSession.setTenant(tenant);
		gSession.setGroupId(groupId);

		setProfiles([profileName]);
		setProfileName(profileName);
		
		setName(name);
		setEmail(email);
		setQuestion(question);
	};

    
    function handleOnKeyUpEvent(event) {
    	if (gSession.getSessionId() == null & gSession.getTenant() == null) {
    		return ;
    	}
    	
		var keyCode = event.keyCode;
		Console.log("keyCode == " + keyCode);
		if (keyCode == 13) {
    		var msg = $("#inputMessage").val();
          	msg = msg.substring(0, (msg.length - 1)).trim();
    		if (msg.length == 0) {
        		$(event.srcElement).val("");
    			return ;
    		}
			
			return send(msg);
		}
		
		typing.setTyping( gSession.getId() , agentsInChat, 1000);
	};
	
	
	function send(msg) {
		var message = new ChatMessage(gSession.getId(), chatMessageIdToAgent++, MessageTypes.MSG_CHAT_CLIENT_MESSAGE, MessageTypes.OUT, msg,  MessageTypes.FROM_CLIENT, gSession.getEmail(), gSession.getName(), agents, MessageTypes.MSG_TEXT);
		
		gMessageSender.sendMessageToAgent(message.getId(), message, agentsInChat);
		addMessageToDisplay(message);
		
		Console.log("send message to agent, need confirmation message for messageId == " + message.getMessageId() + " ReferenceId == " + message.getReferenceId());
		
		$("#inputMessage").val("");
		
		typing.stopTimerTyping();
		
		return ;
	};

	
	function addMessageToDisplay(message) {
		if (message.getOriginatorType() != MessageTypes.FROM_TYPING) {
			messages.push(message);
		}
		
		setMessageToDisplay(message);
		
		if (messages.length == 1) {
			send(getQuestion());
		}
	};

	
	function setMessageToDisplay(message) {
		Console.log("setMessageToDisplay", message.getMessage());
		
		/**
		 * We indicate to the client the agent has read his message only when it's displayed
		 */
		if (message.hasToSendAcknowledgement()) {
			gMessageSender.sendAgentMessageReceived(gSession.getId(), message.getMessageId(), agentsInChat);
		}
		
		var typingMessage = typing.getTypingMessage();
		
		var messageContainer = container.find("#messages");

		var typingExist = (messageContainer.find("#" + typingMessage.getReferenceId()).length > 0);
        if ((message.getOriginatorType() == MessageTypes.FROM_TYPING) && (typingExist)) {
       		return ;
        }
        
        if (typingExist) {
        	messageContainer.find("#" + typingMessage.getReferenceId()).remove();
        }
        
        var item = $(messageLayout);
        
        if (!message.isInboundMessage()) {
        	item.first().removeClass("messageContainerAgent").addClass("messageContainerClient");
        }
        
        if (lastMessageFrom == message.getOriginatorName()) {
            item.find("#origin").hide();
        } else {
            item.find("#origin").show();
        }
        
        item.find("#origin").html(message.getOriginatorName());
        item.attr("id", message.getReferenceId());
        item.find(".chatDisplayTime").html(message.getMessageTime());
        item.find(".message").html(Utility.linkify($.emoticons.replace(message.getMessageContent())));
        
        if (message.getOriginatorType() == MessageTypes.FROM_TYPING) {
        	item.find(".message").removeClass("message").addClass("typing");
        }
        
		messageContainer.append(item);

   		if (message.getOriginatorType() != MessageTypes.FROM_TYPING) {
   			lastMessageFrom = message.getOriginatorName();
   		}

		var itemFromDiv = messageContainer.find("#" + message.getReferenceId());
		var tmp = $(itemFromDiv).parent().scrollTop() + $(itemFromDiv).offset().top - $(itemFromDiv).parent().offset().top;
		messageContainer.scrollTop(tmp);		
	};
	
	
	function focusOnInput() {
		var temp = $("#inputMessage").val();
		$("#inputMessage").val('');
		$("#inputMessage").focus();
		$("#inputMessage").val(temp);
	};
	
	
	function setMessage(msg) {
		container.find("#informationMessage").html(msg);
	};
	
	
	function getTenantName() {
		return gSession.getTenant();
	};
	
	
	function setProfiles(profiles) {
    	$("#profiles").empty();

        for (var i=0; i<profiles.length; i++) {
        	$("#profiles").append("<option>" + profiles[i] + "</option>");
        }
        
        $("#profiles").selectmenu("refresh");
	};
	
	function getProfileName() {
		var profile = container.find("#profiles").val();
		if (profile != null && profile.trim().length > 0) {
			return profile.trim();
		}
		return null;
	};
	function setProfileName(profile) {
		if (profile == null) {
			return ;
		}
		container.find("#profiles").val(profile);
	};
	
	
	function getName() {
		var name = container.find("#name").val();
		if (name != null && name.trim().length > 0) {
			return name.trim();
		}
		
		return null;
	};
	function setName(name) {
		if (name == null) {
			return ;
		}
		container.find("#name").val(name);
	};
	
	
	function getEmail() {
		var email = container.find("#email").val();
		if (email != null && email.trim().length > 0) {
			return email.trim();
		}
		
		return null;
	};
	function setEmail(email) {
		if (email == null) {
			return ;
		}
		container.find("#email").val(email);
	};
	
	
	function getQuestion() {
		var question = container.find("#question").val();
		if (question != null && question.trim().length > 0) {
			return question.trim();
		}
		
		return null;
	};
	function setQuestion(question) {
		if (question == null) {
			return ;
		}
		container.find("#question").val(question);
	};
}