aethernauts.service('server', ['renderer', 'session', function(renderer, session) {
    var ws              = null;
    var server          = {};
    
    var name            = '';
    var connected       = false;
    
    server.isConnected  = function() { return connected;                        }
    server.getName      = function() { return name;                             }
    server.connect      = function (address, port, onConnect, onDisconnect)     {
        address         = address || 'localhost';
        port            = port || 80;
        
        if (connected) server.disconnect();
        ws              = new WebSocket("ws://" + address + ':' + port);
        ws.onopen       = function()                                            {
            connected   = true;
            if (onConnect) onConnect();
            renderer.render();
        };
        ws.onclose      = function()                                            {
            connected   = false;
            session.reset();
            if (onDisconnect) onDisconnect();
            renderer.render();
        };

        ws.onmessage    = function(message)                                     {
            handleMessage(message.data);
            renderer.render();
        };
    };
    
    server.disconnect   = function ()                                           {
        if (!connected) return;
        ws.close();
    };
    
    server.register     = function (username, password, firstname, lastname, email, callback) {
        if (!connected) return;
        password        = CryptoJS.MD5(password + '_' + session.getSalt()).toString();
        ws.send(JSON.stringify({type: 'auth', action:'register', username:username, password:password, firstname:firstname, lastname: lastname, email: email, callbackID:addCallback(callback)}));
    };
    
    server.login    = function (username, password, callback)                   {
        if (!connected) return;
        password    = CryptoJS.MD5(CryptoJS.MD5(password + '_' + session.getSalt()).toString() + session.getToken()).toString();
        ws.send(JSON.stringify({type: 'auth', action:'login', username:username, password:password, callbackID:addCallback(callback)}));
    };
    
    server.logout    = function (callback)                                      {
        if (!connected) return;
        ws.send(JSON.stringify({type: 'auth', action:'logout', callbackID:addCallback(callback)}));
    };
    
    
    server.getCharacters    = function (callback)                               {
        if (!connected) return;
        ws.send(JSON.stringify({type: 'characters', action:'list', callbackID:addCallback(callback)}));
    };
    
    server.createCharacter  = function (firstname, lastname, callback)          {
        if (!connected) return;
        ws.send(JSON.stringify({type: 'characters', action:'create', firstname: firstname, lastname:lastname, callbackID:addCallback(callback)}));
    };
    
    server.deleteCharacter  = function (character, callback)                    {
        if (!connected) return;
        ws.send(JSON.stringify({type: 'characters', action:'delete', character: character, callbackID:addCallback(callback)}));
    };
    
    
    function handleMessage(message)                                             {
        message     = JSON.parse(message);
        switch(message.type)                                                    {
            case 'session':
                if (message.state == 'start')                                   {
                    name        = message.name;
                    session.set(message.salt, message.token);
                }
                break;
            case 'response':
                message.callbackID = +message.callbackID;
                if (message.callbackID < callbacks.length && callbacks[message.callbackID]){
                    var callback    = callbacks[message.callbackID];
                    callbacks[message.callbackID]   = null;
                    callback(message);
                }
                break;
            default: break;
        }
    }
    
    var callbacks = [];
    function addCallback(callback)                                              {
        callbacks.push(callback);
        return callbacks.length - 1;
    }
    
    return server;
}]);
