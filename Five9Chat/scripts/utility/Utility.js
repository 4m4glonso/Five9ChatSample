var Utility = new Object();

var WEEKDAY = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
var MONTHS = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
var MONTHS_SHORT = new Array("Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.");

Utility.isValidObject = function(_objectToCheck, _defaultValue) {
	try {
        if ((typeof _objectToCheck === "undefined") || (_objectToCheck == "undefined") || (_objectToCheck == "null") || (_objectToCheck == null)) {
    		return _defaultValue;
    	} else {
    		return _objectToCheck;
    	}
	} catch (err) {
		return _defaultValue;
	}
};


Utility.getBoolean = function(_value, _default) {
  if (typeof _value == "boolean") {
      return _value;
  }
  
  return _default;
};


Utility.waiting = function() {
	Utility.setWaiting(Utility.lockScreen());
};


Utility.setWaiting = function(container) {
	container.html("<div class=\"loadingImage\"></div>");
};


Utility.lockScreen = function() {
    var lvLock = $("body").find("#blockAccess");
    if (lvLock.length > 0) {
    	return lvLock;
    }
    
    $("body").append("<div id=\"blockAccess\" class=\"blockAccess\"></div>");
    
    return $("body").find("#blockAccess");
};


Utility.unlockScreen = function() {
	try { $("#blockAccess").off(); } catch (err) { }
	try { $("#blockAccess").empty(); } catch (err) { }
	try { $("#blockAccess").remove(); } catch (err) { }
};


Utility.lockScreenEx = function() {
	var id = "blockAccess" + (new Date()).getTime();
	
	var blockAccess = $("<div class=\"blockAccess\"></div>");
	blockAccess.attr("id", id);
	
    $("body").append(blockAccess);
    
    return $("body").find("#" + id);
};


Utility.unlockScreenEx = function(blockAccess) {
	try { blockAccess.off(); } catch (err) { }
	try { blockAccess.empty(); } catch (err) { }
	try { blockAccess.remove(); } catch (err) { }
};


Utility.getCurrentDateInSecond = function() {
	return parseInt(((new Date()).getTime() / 1000));
};


Utility.getFormattedDate = function() {
    return Utility.getFormattedDateFromDate(new Date());
};


Utility.getUTCSec = function(dateValue) {
    var dateFrom = new Date(Date.parse(dateValue));
    return (Date.UTC(dateFrom.getUTCFullYear(), dateFrom.getUTCMonth(), dateFrom.getUTCDate(), dateFrom.getUTCHours(), dateFrom.getUTCMinutes(), dateFrom.getUTCSeconds()) / 1000);
};


Utility.getUTCFormattedDateFromSec = function(dateInSec) {
    var dateFromSec = Utility.getDateFromSec(dateInSec);
    
    return ((dateFromSec.getUTCMonth() + 1) + "/" + dateFromSec.getUTCDate() + "/" + dateFromSec.getUTCFullYear());
};


Utility.getFormattedTimer = function(numberOfSecond) {
    var lvHours = parseInt(numberOfSecond / (60 * 60));
    var lvMinutes = parseInt((numberOfSecond - (lvHours * 60 * 60)) / 60);
    var lvSeconds = parseInt(numberOfSecond - (lvHours * 60 * 60) - (lvMinutes * 60));
    
    return ((lvHours < 10 ? "0" : "") + lvHours + ":" + (lvMinutes < 10 ? "0" : "") + lvMinutes) + ":" + (lvSeconds < 10 ? "0" : "") + lvSeconds;
};


Utility.getDateFromSec = function(_dateInSec) {
	var lvMilliSeconds =  _dateInSec * 1000;
	
	return new Date(lvMilliSeconds);
};


Utility.getFormattedDateFromSec = function(_dateInSecond) {
	return Utility.getFormattedDateFromDate(Utility.getDateFromSec(_dateInSecond));
};


Utility.getFormattedDateFromDate = function(_date) {
	var curMonth = _date.getMonth() + 1;
	var curDay = _date.getDate();
	var curFullYear = _date.getFullYear();

	return ((curMonth < 10 ? "0" : "") + curMonth) + "/" + ((curDay < 10 ? "0" : "") + curDay) + "/" + (curFullYear);
};


Utility.getFormattedTimeFromSec = function(_dateInSecond) {
	return Utility.getFormattedTimeFromDate(Utility.getDateFromSec(_dateInSecond));
};


Utility.getFormattedTimeFromDate = function(_date) {
	var curHour = _date.getHours();
	var curMin = _date.getMinutes();

	return ((curHour < 10 ? "0" : "") + curHour) + ":" + ((curMin < 10 ? "0" : "") + curMin);
};


Utility.getFormattedDateAndTimeFromSec = function (_dateInSecond) {
	return Utility.getFormattedDateFromSec(_dateInSecond) + " " + Utility.getFormattedTimeFromSec(_dateInSecond);
};


Utility.getFormattedDateAndTimeFromDate = function (_date) {
	return Utility.getFormattedDateFromDate(_date) + " " + Utility.getFormattedTimeFromDate(_date);
};


Utility.getDayOfWeek = function(date) {
    return WEEKDAY[date.getDay()]; 
};


Utility.getMontOfYear = function (date) {
    return MONTHS[date.getMonth()]; 
};
    

Utility.getCurrentFullFormattedDateAndTimeFromSecond = function() {
	var lvDate = new Date();
    return Utility.getFullFormattedDateFromDate(lvDate) + " " + Utility.getFormattedTimeFromDate(lvDate);
};


Utility.getFullFormattedDateAndTimeFromSecond = function(_dateInSec) {
	var lvDate = Utility.getDateFromSec(_dateInSec);
	
    return Utility.getFullFormattedDateFromDate(lvDate) + " " + Utility.getFormattedTimeFromDate(lvDate);
};


Utility.getFullFormattedDateFromSecond = function(_dateInSec) {
    return Utility.getFullFormattedDateFromDate(Utility.getDateFromSec(_dateInSec));
};


Utility.getFullFormattedDateFromDate = function(_date) {
    return Utility.getDayOfWeek(_date) + ", " +  Utility.getMontOfYear(_date) + " " + _date.getDate() + ", " + _date.getFullYear();
};


Utility.getHistoryFormattedDateFromSec = function(_dateInSeconds) {
    return Utility.getHistoryFormattedDate(Utility.getDateFromSec(_dateInSeconds));
};


Utility.getCurrentHistoryFormattedDate = function() {
    return Utility.getHistoryFormattedDate(new Date());
};


Utility.getHistoryFormattedDate = function(date) {
	return MONTHS_SHORT[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear() + " at " + (((date.getHours() + 11) % 12) + 1) + ":" + (date.getMinutes() < 10 ? "0" : "") +  date.getMinutes() + (date.getHours() > 12 ? " PM" : " AM");
};


Utility.getHistoryFormattedDateFromSecForTimeline = function(dateInSeconds) {
    var date = this.getDateFromSec(dateInSeconds);
    return  date.getFullYear() + "," + (date.getMonth() + 1) + "," + date.getDate() + "," + date.getHours() + "," + (date.getMinutes() < 10 ? "0" : "") +  date.getMinutes() + "," + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
};


Utility.getCookie = function (_cookieName) {
    currentcookie = document.cookie;
    if (currentcookie.length > 0) {
        firstidx = currentcookie.indexOf(_cookieName + "=");
        if (firstidx != -1) {
            firstidx = firstidx + _cookieName.length + 1;
            lastidx = currentcookie.indexOf(";", firstidx);
            if (lastidx == -1) {
                lastidx = currentcookie.length;
            }
            
            var s = unescape(currentcookie.substring(firstidx, lastidx)).split(";");
            
            for (var i=0; i<s.length; i++) {
                try {
                    var t = s[i].split("=");
                    if ($.trim(t[0]) == "expires") {
                        if (new Date() > new Date($.trim(t[1]))) {
                            return undefined;
                        }
                    }
                } catch (err) {
                    Console.error("Error parsing the cookie");
                }
            }
            
            return unescape(currentcookie.substring(firstidx, lastidx));
        }
    }
    
    return undefined;
};


Utility.setCookie = function (_cookieName, _value) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 365);
    
    var c_value = escape(_value) + "; expires=" + expireDate.toGMTString();  
    
    document.cookie = _cookieName + "=" + c_value;
};


Utility.checkCookie = function (_cookieName) {
    var lvCookie = Utility.getCookie(_cookieName);
    if (lvCookie != undefined && lvCookie != null && lvCookie != "") {
        gLoginEventHandler.setRememberMe(true);
        gLoginEventHandler.setUsername(lvCookie);
    }
};


Utility.getUsernameFromCookie = function () {
    var lvCookie = Utility.getCookie(COOKIE_NAME);
    if (lvCookie != undefined && lvCookie != null && lvCookie != "") {
        return lvCookie;
    }
    
    return "";
};


Utility.deleteCookie = function (_cookieName) {
	Utility.setCookie(_cookieName + '=; expires=Thu, 01-Jan-70 00:00:01 GMT;');
};


Utility.callbackFunc = function (a, b) {
	if (a.getName().toLowerCase() == b.getName().toLowerCase()) {
		return 0;
	}

	return (a.getName().toLowerCase() < b.getName().toLowerCase()) ? -1 : 1;
};


Utility.dateSort = function (a, b) {
	if (a.getDateInSec() == b.getDateInSec()) {
		return 0;
	}

	return (a.getDateInSec() < b.getDateInSec()) ? -1 : 1;
};


Utility.center = function(_container) {
    var x = ($("html").width() - $("#" + _container).width()) / 2;
    var y = ($("html").height() - $("#" + _container).height()) / 2;        
    
    $("#" + _container).css("top", y);
    $("#" + _container).css("left", x);
};


Utility.showModalDialog = function(_title, _msg, _buttons) {
	$("#dialogMessage").html(_msg);
    
    $("#dialog-modal").dialog({ 
        height: 200, 
        width: 450, 
        modal: true, 
        resizable: false, 
        closeText: 'hide',
        title: _title,
        dialogClass: "textSize12px",
        buttons: _buttons
    });
    
    $(".ui-dialog-buttonpane button").button("enable");
    $(".ui-dialog-titlebar-close").button("enable");
};


Utility.validateEmail = function(email) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return (!regex.test(email));
};


Utility.resetFileField = function(_container, _fileToUploadField) {
	var lvInput = _container.find("#" + _fileToUploadField);
	
	lvInput.wrap("<form>").closest("form").get(0).reset();
	lvInput.unwrap();
};


Utility.linkify = function(inputText) {
	if (Utility.isValidObject(inputText, null) == null) {
		return "";
	}
	
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z0-9\-\_\.]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
    
    //Change email addresses to mailto:: links.
    replacePattern4 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z0-9\-\_\.]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern4, '<a href="mailto:$1">$1</a>');
    
    var lvData = $("<div>" + replacedText + "</div>");

    lvData.find("a").each(function() {
    	var value = $(this).html();
    	if (value.length > 35) {
        	$(this).html(value.substr(0, 35) + "...");
    	}
    });
    
    return lvData.html();
};


Utility.loadScript = function(name) {
    try {
        return $.getScript(name + "?cmp=" + (new Date()).getMilliseconds()).done(function(script, textStatus) {
            Console.log( name, textStatus);
        });
    } catch (err) {
        Console.error( name, "can't load script [" + script + "]");
    }
};


Utility.loadScripts = function(scripts, readyCallback) {
	var deferred = new $.Deferred();
	var promise = deferred.promise();
	
	for (var i=0; i<scripts.length; i++) {
		(function(script) {
        	promise = promise.then(function() {
	            return Utility.loadScript(script);
        	});
		}(scripts[i]));
	}

	promise.done(function() {
		if (readyCallback != null) {
			readyCallback.apply();
		}
	});

	// Resolve the deferred object and trigger the callbacks
	deferred.resolve();    	
};


Utility.getBrowserType = function() {
	var browser = {
			chrome: false,
			mozilla: false,
			opera: false,
			msie: false,
			safari: false
	};
	
	var userAgent = navigator.userAgent.toLowerCase();
	
	if(userAgent.indexOf("chrome") > -1) {
		browser.chrome = true;
	} else if (userAgent.indexOf("safari") > -1) {
		browser.userAgent = true;
	} else if (userAgent.indexOf("opera") > -1) {
		browser.opera = true;
	} else if (userAgent.indexOf("firefox") > -1) {
		browser.mozilla = true;
	} else if (userAgent.indexOf("msie") > -1) {
		browser.msie = true;
	}
	
	return browser;
};


Utility.insertTextAtCaret = function(value, selectPastedContent) {
    var range = null;
    
    var selection = window.getSelection();
    if (selection.getRangeAt && selection.rangeCount) {
        range = selection.getRangeAt(0);
        range.setEnd(selection.anchorNode, range.startOffset);
        
        var newElement = document.createElement("div");
        newElement.innerHTML = value;
        
        var fragment = document.createDocumentFragment();
        var node = null;
        var lastNode = null;
        
        while ((node = newElement.firstChild)) {
            lastNode = fragment.appendChild(node);
        }
        
        var firstNode = fragment.firstChild;
        range.insertNode(fragment);
        
        if (lastNode != null) {
            range = range.cloneRange();
            range.setStartAfter(lastNode);
            if (selectPastedContent) {
                range.setStartBefore(firstNode);
            } else {
                range.collapse(true);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }
};


Utility.createList = function(items, container, prefix, layout) {
	container.empty();
	
    for (var i=0; i<items.length; i++) {
    	if (items[i].getId() > -1) {
    		var tmp = $(layout);
    		
    		var input = tmp.find("input");
    		var label = tmp.find("label");
    		
    		var key = prefix + items[i].getId();
    		
    		input.attr("id", key);
    		input.attr("name", key);
    		label.attr("for", key);
    		
    		label.html(items[i].getName());
    		
    		container.append(tmp);
    	}
    }
};


