aethernauts.directive('uiServer', [function()                                    {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/ui-server.html',
        controller:     ['$scope', 'server', function($scope, server)           {
            $scope.address      = '';
            $scope.port         = 42000;
            $scope.connected    = server.isConnected();
            $scope.name         = server.getName();
            
            $scope.connect          = function ()                               {
                server.connect($scope.address, $scope.port,
                function()                                                      {
                    console.log('Server connection opened');
                },
                function()                                                      {
                    console.log('Server connection closed');
                });
            };
            
            $scope.disconnect       = function ()                               {
                server.disconnect();
            };
            
            $scope.$watch(function(){ return server.isConnected(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.connected    = nv;
                console.log('Server connected?', $scope.connected);
            });
            
            $scope.$watch(function(){ return server.getName(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.name         = nv;
                console.log('Server name:', $scope.name);
            });
        }]
    };
}]);
