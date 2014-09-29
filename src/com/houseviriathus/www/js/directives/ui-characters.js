aethernauts.directive('uiCharacters', [function()                               {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-characters.html',
        controller:     ['$scope', 'server', 'session', 'alerts', 'errors',
            function($scope, server, session, alerts, errors)                   {
                $scope.characters       = null;
                $scope.character        = null;
                
                $scope.list             = function ()                           {
                    server.getCharacters(function(message)                      {
                        if (!message.error)                                     {
                            $scope.characters = message.result || [];
                        } else console.log('Characters error', message.error);
                    });
                };
                
                $scope.add             = function ()                            {
                    server.createCharacter($scope.nameFirst, $scope.nameLast, function(message) {
                        if (!message.error)                                     {
                            $scope.character = message.result || [];
                        } else console.log('Characters error', message.error);
                    });
                };
                
                $scope.kill             = function ()                           {
                    server.deleteCharacter($scope.character, function(message)  {
                        if (!message.error)                                     {
                            $scope.character    = null;
                        } else console.log('Characters error', message.error);
                    });
                };
                
                $scope.$watch('character', function(nv, ov)                     {
                    if (nv === ov) return;
                    session.setCharacter(nv);
                });
                
                $scope.$watch(function(){ return session.getProfile(); }, function(nv, ov){
                    if (nv === ov) return;
                    $scope.character    = null;
                    if (nv) $scope.list();
                });
                
                $scope.$watch(function(){ return session.getCharacter(); }, function(nv, ov){
                    if (nv === ov) return;
                    $scope.character    = nv;
                    console.log('Character:', $scope.profile);
                });

            }
        ]
    };
}]);
