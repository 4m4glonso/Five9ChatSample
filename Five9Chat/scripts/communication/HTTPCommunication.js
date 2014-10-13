var gHTTPCommunication = null;

function HTTPCommunication() {
    var CONNECTION_TIMEOUT = 120000;
    var printMessages = false;
    
    this.POST = function(_pathname, _params, _url, _callbackError) {
        sendRequest("POST", _pathname, getParamString(_params), _url, _callbackError);
    };

    this.GET = function(_pathname, _params, _url, _callbackError) {
        sendRequest("GET", _pathname, getParamString(_params), _url, _callbackError);
    };

    
    this.POSTEx = function(_pathname, jsonObject, _url, _callbackError) {
        sendRequestEx("POST", _pathname, jsonObject, _url, _callbackError);
    };
    
    this.GETEx = function(_pathname, jsonObject, _url, _callbackError) {
        sendRequestEx("GET", _pathname, jsonObject, _url, _callbackError);
    };
    
    
    
    this.DELETE = function(_pathname, _params, _url, _callbackError) {
        sendRequest("DELETE", _pathname, getParamString(_params), _url, _callbackError);
    };

    
    this.setPrintMessage = function(_printMessages) {
    	printMessages = _printMessages;
    };
    
    
    this.uploadFile = function(_file, _url, _source, _functionToCall) {      
        var fd = new FormData();
        fd.append("fileToUpload", _file);
        
        var lvXMLHttpRequest = createXMLHttpRequest();

        if (Utility.isValidObject(_source.handleOnAbort, null) != null) {
        	lvXMLHttpRequest.onabort = function() { _source.handleOnAbort(lvXMLHttpRequest, _file); };
        }
        
        if (Utility.isValidObject(_source.handleOnError, null) != null) {
        	lvXMLHttpRequest.onerror = function() { _source.handleOnError(lvXMLHttpRequest, _file); };
        }
        
        if (Utility.isValidObject(_source.handleOnLoad, null) != null) {
        	lvXMLHttpRequest.onload = function() { _source.handleOnLoad(lvXMLHttpRequest, _file); };
        }
        
        if (Utility.isValidObject(_source.handleOnLoadEnd, null) != null) {
        	lvXMLHttpRequest.onloadend = function() { _source.handleOnLoadEnd(lvXMLHttpRequest, _file); };
        }
        
        if (Utility.isValidObject(_source.handleOnLoadStart, null) != null) {
        	lvXMLHttpRequest.onloadstart = function() { _source.handleOnLoadStart(lvXMLHttpRequest, _file); };
        }
        
        if (Utility.isValidObject(_source.handleOnProgress, null) != null) {
        	lvXMLHttpRequest.onprogress = function() { _source.handleOnProgress(lvXMLHttpRequest, _file); };
        }
        
       	lvXMLHttpRequest.onreadystatechange = function() { handleOnReadyStateChange(_source, lvXMLHttpRequest, _file, _functionToCall); };
        
       	try {
	        lvXMLHttpRequest.open("POST", _url);
	        
            if (typeof(gSession.getAuthenticationHeader) == "function") {
            	lvXMLHttpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(gSession.getAuthenticationHeader()));
            }
            
	        lvXMLHttpRequest.send(fd);
       	} catch (err) {
       		Console.error( err.message);
       	}
    };
    
    
    function handleOnReadyStateChange(_source, _xmlHttpRequest, _file, _functionToCall) {
    	Console.info( "handleOnReadyStateChange", _xmlHttpRequest, _file);
    	
    	if (_xmlHttpRequest.readyState == 4) {
    		if (_xmlHttpRequest.status == 200) {
    			if (_functionToCall == null) {
    				_source.handleOnUploadSuccess(_xmlHttpRequest, _file);
    			} else {
    				setTimeout(_functionToCall, 1, true, _xmlHttpRequest, _file);
    			}
    			return ;
    		}
    		
            if (Utility.isValidObject(_source.handleOnError, null) != null) {
    			if (_functionToCall == null) {
    				_source.handleOnError(_xmlHttpRequest, _file);
    			} else {
    				setTimeout(_functionToCall, 1, false, _xmlHttpRequest, _file);
    			}
            }
            
            return ;
    	}
    };

    
    function handleResponse(lvXMLHttpRequest, lvRequestTimer, _callbackError) {
        if (lvXMLHttpRequest.readyState == 4) {
        	if (lvRequestTimer != null) {
        		clearTimeout(lvRequestTimer);
        	}
        	
            if (lvXMLHttpRequest.status == 200) {
                try {
                	if (printMessages) {
                		Console.log( "HTTPCommunication - HandleResponse ", lvXMLHttpRequest);
                	}
                    
                    gMessageHandler.handleMessage(JSON.parse(lvXMLHttpRequest.responseText));
                } catch (err) { 
                    Console.error( err.message); 
                }
    
                return;
            }

            if (lvXMLHttpRequest.status == 401) {
                handleError();
            }
            
            if (_callbackError) {
            	var object = new Object();
            	object.Status = lvXMLHttpRequest.status;
            	object.MsgType = -1;
            	object.error = lvXMLHttpRequest.statusText;
            	
            	_callbackError(object);
            }
        }
    };

    
    function handleError() {
    	if ((typeof gLoginEventHandler === "undefined") || (gLoginEventHandler == "undefined") || (gLoginEventHandler == "null") || (gLoginEventHandler == null)) {
    		gLoginEventHandler.showLoginError();
    	}
    };
    
    
    function handleCommunicationError(lvXMLHttpRequest, lvRequestTimer) {
    	Console.error( "Communication Error", lvXMLHttpRequest);
    };

    
    function getParamString(_params) {
    	if (_params == null) {
    		return "";
    	}
    	
        var lvParameterString = "";
        
        for (var i in _params) {
            lvParameterString += (lvParameterString.length > 0 ? "&" : "") + _params[i][0] + "=" + encodeURI(_params[i][1]);
        }

        return lvParameterString;
    };

    
    function sendRequest(_type, _pathname, _paramtext, _url, _callbackError) {
        Console.log( "HTTPCommunication - sendRequest - type == " + _type + ", url == " + _url + ",  pathname == " + _pathname + " paramtext == " + _paramtext);

        var lvUrl = encodeURI(_url + _pathname);
        
        var lvXMLHttpRequest = createXMLHttpRequest();
	
        if (lvXMLHttpRequest == null) {
            return ;
        }
		
        try {
            lvXMLHttpRequest.open(_type, lvUrl, true);
            
            if (typeof(gSession.getAuthenticationHeader) == "function") {
            	lvXMLHttpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(gSession.getAuthenticationHeader()));
            }
            
            lvXMLHttpRequest.setRequestHeader("Content-type", "application/json");
            
            var lvRequestTimer = setTimeout(function() { HandleRequestTimeout(lvXMLHttpRequest, lvUrl); }, CONNECTION_TIMEOUT);

            lvXMLHttpRequest.onreadystatechange = function() { handleResponse(lvXMLHttpRequest, lvRequestTimer, _callbackError); };
            lvXMLHttpRequest.onerror = function() { handleCommunicationError(lvXMLHttpRequest, lvRequestTimer); };

            if (_paramtext == null) {
                lvXMLHttpRequest.send();
            } else {
                lvXMLHttpRequest.send(_paramtext);
            }
        } catch (err) { 
            Console.error( err.message);
            
        	if ((typeof gLoginEventHandler === "undefined") || (gLoginEventHandler == "undefined") || (gLoginEventHandler == "null") || (gLoginEventHandler == null)) {
        		gLoginEventHandler.showLoginError("Error, please try again in a few minutes");
        	}
        }
        
        return;
    };

    
    function sendRequestEx(_type, _pathname, jsonObject, _url, _callbackError) {
        Console.log( "HTTPCommunication - sendRequest", _type, _pathname, jsonObject);

        var lvUrl = encodeURI(_url + _pathname);
        
        var lvXMLHttpRequest = createXMLHttpRequest();
	
        if (lvXMLHttpRequest == null) {
            return ;
        }
		
        try {
            lvXMLHttpRequest.open(_type, lvUrl, true);
            
            if (typeof(gSession.getAuthenticationHeader) == "function") {
            	lvXMLHttpRequest.setRequestHeader('Authorization', 'Basic ' + btoa(gSession.getAuthenticationHeader()));
            }
            
            lvXMLHttpRequest.setRequestHeader("Content-type", "application/json");
            
            var lvRequestTimer = setTimeout(function() { HandleRequestTimeout(lvXMLHttpRequest, lvUrl); }, CONNECTION_TIMEOUT);

            lvXMLHttpRequest.onreadystatechange = function() { handleResponse(lvXMLHttpRequest, lvRequestTimer, _callbackError); };
            lvXMLHttpRequest.onerror = function() { handleCommunicationError(lvXMLHttpRequest, lvRequestTimer); };

            
            Console.log("lvXMLHttpRequest", lvXMLHttpRequest);
            
            if (jsonObject == null) {
                lvXMLHttpRequest.send();
            } else {
            	Console.log( JSON.stringify(jsonObject));
                lvXMLHttpRequest.send(encodeURIComponent(JSON.stringify(jsonObject)));
            }
        } catch (err) { 
            Console.error( err.message); 
            
        	if ((typeof gLoginEventHandler === "undefined") || (gLoginEventHandler == "undefined") || (gLoginEventHandler == "null") || (gLoginEventHandler == null)) {
        		gLoginEventHandler.showLoginError("Error, please try again in a few minutes");
        	}
        }
        
        return;
    };

    function HandleRequestTimeout(lvXMLHttpRequest, _param) {
//    	//Console.log( _param);
        lvXMLHttpRequest.abort();
    };

    
    function createXMLHttpRequest() {
        if (window.XMLHttpRequest) {
            try {
                return new XMLHttpRequest();
            } catch (err) { 
                Console.error( err.message); 
            }
        }
	
        if (window.createRequest) {
            try {
                return window.createRequest();
            } catch (err) { 
                Console.error( err.message); 
            }
        }
	
        try {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } catch (err) { 
            Console.error( err.message); 
        }

        return null;
    };
}