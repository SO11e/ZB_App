module.exports = function (hostname, $http, AuthorizationFactory) {
    var token = AuthorizationFactory.getAuthToken();

    function getRoutesWalked() {
        return $http.get(hostname + '/routeswalked?perPage=1000', { headers: { 'bearer': token } } ).then(function (routesWalked) {
            return routesWalked.data.data;
        }, function(error){
            console.error(error);
        });
    }

    function addRouteWalked(waypoints){
        var user = AuthorizationFactory.getUser();

        var routeWalked = {
            userId: user._id,
            regionId: user.region._id,
            waypoints: waypoints
        };

        return $http.post(hostname + '/routeswalked?page=2', JSON.stringify(routeWalked), {headers: {'bearer': token}}).then(function(response){
            return response.data;
        }, function(error){
            console.error(error);
        });
    }

    // function getRoutesWalkedRegion(regionId){
    //     return $http.get(hostname + '/routeswalked/' + regionId + '?perPage=100').then(function (routesWalked) {
    //         return routesWalked;
    //     });
    // }

    return {
        getRoutesWalked: getRoutesWalked,
        addRouteWalked: addRouteWalked
        //getRoutesWalkedRegion: getRoutesWalkedRegion()
    };
};
