aethernauts.directive('popupAlerts', [function()                                {
    return {
        scope:      {
            
        },
        transcode:      true,
        replace:        true,
        templateUrl:    'html/templates/popupAlerts.html',
        controller:     ['$scope', 'alerts', function($scope, alerts)           {
            $scope.visible  = false;
            $scope.type     = '';
            $scope.title    = '';
            $scope.message  = '';
            $scope.count    = 0;
            
            var active      = null;
            $scope.$watch(function(){ return alerts.getNext(); }, function(nv, ov){
                if (nv === ov) return;
                active         = nv;
                $scope.type     = active?active.type:'';
                $scope.title    = active?chooseTitle(active.code):'';
                $scope.message  = active?active.message:'';
            });
            
            $scope.$watch(function(){ return alerts.getCount(); }, function(nv, ov){
                if (nv === ov) return;
                $scope.count    = nv;
                $scope.visible  = nv?true:false;
            });
            
            function chooseTitle(code)                                          {
                switch (code)                                                   {
                    case 'AuthError':   return 'Authentication!';
                    default:            return 'Warning!';
                }
            }
            
            $scope.ok   = function()                                            {
                if (!active) return;
                if (active.callback) active.callback(true);
                alerts.remove(active);
            };
        }]
    };
}]);
