aethernauts.service('session', ['renderer', function(renderer)                  {
    var salt        = '';
    var token       = '';
    var profile     = null;
    var character   = null;
    
    var session             = {};
    session.getSalt         = function() { return salt;                         };
    session.getToken        = function() { return token;                        };
    session.getProfile      = function() { return profile;                      };
    session.setProfile      = function(v)                                       {
        if (v == profile) return;
        profile = v;
        renderer.render();
    };
    session.getCharacter    = function() { return character;                    };
    session.setCharacter    = function(v)                                       {
        if (v == character) return;
        character = v;
        renderer.render();
    };
    
    session.reset = function()                                                  {
        salt        = '';
        token       = '';
        profile        = null;
        character   = null;
        renderer.render();
    };
    
    session.set    = function(newSalt, newToken, update)                        {
        salt        = newSalt;
        token       = newToken;
        profile     = update?profile:null;
        character   = update?character:null;
        renderer.render();
    };
    
    return session;
}]);
