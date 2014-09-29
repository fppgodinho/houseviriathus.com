aethernauts.service('errors', [function()                                       {
    var errors              = {};
    errors.getServerError   = function (id, message)                            {
        switch(id)                                                              {
            case 'AuthError':   return 'Login Failed!';
            default:            return message;
        }
    };
    return errors;
}]);
