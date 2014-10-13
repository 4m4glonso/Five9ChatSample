var gPopupEmoticons = null;

function PopupEmoticons() {
	var lockedScreen = null;
    var layout = null;
    var isOpen = false;
    var callback = null;
    
//	$.get("./popupCallback.html?seconds=" + (new Date()).getMilliseconds(), function(data) {
//		layout = data;
//    });
	
	
    layout = "<div id='popupOverview' class='popupOverview'></div>";

    
	this.init = function() {
    };
    
    
    this.reset = function() {
		// $("body").off("click", "span.emoticon");
		$("body").off("click", "img.emoticon");
		
    	layout = null;
    };
    
    
    function open(event) {
    	if (layout == null) {
    		return setTimeout(function() { open(event); }, 100);
    	}

    	lockedScreen = Utility.lockScreenEx();
    	lockedScreen.append(layout);
    	
    	lockedScreen.find('#popupOverview').html($.emoticons.toString());
    	
		// lockedScreen.on("click", "span.emoticon", function() { handleOnEmoticonClicked(this); });
		lockedScreen.on("click", "img.emoticon", function() { handleOnEmoticonClicked(this); });
		lockedScreen.on("click", function() { close(); });
		
        var x = event.pageX + 10;
        var y = event.pageY - lockedScreen.find("#popupOverview").height();

    	lockedScreen.find("#popupOverview").css("top", y);
    	lockedScreen.find("#popupOverview").css("left", x);
    	
    	lockedScreen.find("#popupOverview").show();
    	// lockedScreen.find("#popupOverview").show("scale", {}, 250, function() { });
    };

    
    this.open = function(event, _callback) {
    	if (isOpen) {
    		Console.warn("Already opened, don't open a second one");
    		return ;
    	}
    	
    	isOpen = true;
    	
    	callback = _callback;
    	
    	open(event);
    };
    
    
    function handleOnEmoticonClicked(source) {
    	Console.log(source);
    	
    	callback($(source).attr("ref"));
    	
    	close();
    };
    
    
    function close() {
        Utility.unlockScreenEx(lockedScreen);
        
        lockedScreen = null;
        
        isOpen = false;
	};

    
    this.init();
}        