aethernauts.service('renderer', ['$rootScope', function($rootScope)             {
    var update      = false;
    var renderer    = {};
    
    renderer.render = function(now)                                             {
       update = true; if (now) render();
    };
    
    function render()                                                           {
        if (!update) return; update = false;
        $rootScope.$apply();
    };
    
    setInterval(render, 100);
    
    return renderer;
}]);
