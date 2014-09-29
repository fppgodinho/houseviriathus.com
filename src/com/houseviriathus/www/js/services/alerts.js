aethernauts.service('alerts', ['renderer', function(renderer)                   {
    var messages        = [];
    
    var alerts          = {};
    alerts.add          = function(type, code, message, callback)                 {
        messages.push({type: type, code: code, message: message, callback: callback});
        renderer.render();
        //
        console.log(messages.length, messages[messages.length-1]);
    };
    
    alerts.remove       = function(message)                                     {
        var index = messages.indexOf(message); if (index < 0) return;
        messages.splice(index, 1);
        renderer.render();
    };
    
    alerts.getNext      = function()                                            {
        return messages.length?messages[messages.length-1]:null;
    };
    alerts.getCount     = function() { return messages.length;                  };
    
    return alerts;
}]);
