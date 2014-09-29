aethernauts.directive('uiAuth', [function()                                      {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-auth.html',
        controller:     ['$scope', 'server', 'session', 'alerts', 'errors',
            function($scope, server, session, alerts, errors)                   {
                $scope.profile          = null;
                
                $scope.showRegister     = false;
                
                $scope.username         = 'admin';
                $scope.password         = 'test';
                $scope.password2        = '';
                $scope.nameFirst        = '';
                $scope.nameLast         = '';
                $scope.email            = '';
                $scope.email2           = '';
                
                $scope.register         = function ()                           {
                    if ($scope.profile) return;
                    // TODO: validate fields!
                    server.register($scope.username, $scope.password, $scope.nameFirst, $scope.nameLast, $scope.email, function(message){
                        if (!message.error && message.result)                   {
                            var profile             = message.result;
                            var defaultEmail        = getDefault(profile.identity.emails);
                            $scope.password         = '';
                            $scope.username         = profile.credentials.username;
                            $scope.nameFirst        = profile.identity.name.first;
                            $scope.nameLast         = profile.identity.name.last;
                            $scope.email            = defaultEmail?defaultEmail.address:'';
                            $scope.showRegister     = false;
                            session.setProfile(profile);
                        } else if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message), function(choice) {
                            $scope.password         = '';
                        });
                    });
                };
                
                $scope.login            = function ()                           {
                    if ($scope.profile) return;
                    server.login($scope.username, $scope.password, function(message){
                        console.log(message);
                        if (!message.error && message.result)                   {
                            var profile             = message.result;
                            // var defaultEmail        = getDefault(profile.identity.emails);
                            $scope.password         = '';
                            $scope.username         = profile.username;
                            $scope.nameFirst        = profile.firstName;
                            $scope.nameLast         = profile.lastName;
                            $scope.email            = profile.email;
                            session.setProfile(profile);
                        } else if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message), function(choice) {
                            $scope.password         = '';
                        });
                    });
                };

                $scope.logout           = function ()                           {
                    $scope.showRegister     = false;
                    server.logout(function(message)                             {
                        if (message.error) alerts.add('simple', message.error.code, errors.getServerError(message.error.code, message.error.message));
                        else session.setProfile();
                    });
                };

                $scope.$watch(function(){ return session.getProfile(); }, function(nv, ov){
                    if (nv === ov) return;
                    if (!nv) reset();
                    $scope.profile          = nv;
                    $scope.showRegister     = false;
                    console.log('Profile:', $scope.profile);
                });

                $scope.$watch('showRegister', function(nv, ov)                  {
                    if (nv === ov) return;
                    if (nv) reset();
                });
                
                function getDefault(list)                                       {
                    if (list && list.length) for (var i in list) if (list[i].default) return list[i];
                    return null;
                }
                
                function reset()                                                {
                    $scope.password         = '';
                    $scope.password2        = '';
                    $scope.nameFirst        = '';
                    $scope.nameLast         = '';
                    $scope.email            = '';
                    $scope.email2           = '';
                }
            }
        ]
    };
}]);
