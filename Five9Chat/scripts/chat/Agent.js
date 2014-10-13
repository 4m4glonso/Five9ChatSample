
function Agent(email, name) {
	var agent = new Object();
	agent.email = email;
	agent.name = name;
	
	this.getName = function() {
		return agent.name;
	};
	
	this.getUsername = function() {
		return agent.email;
	};
}