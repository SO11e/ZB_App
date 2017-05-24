module.exports = function (hostname, $http, AuthorizationFactory) {
    var token = AuthorizationFactory.getAuthToken();
    // var routesWalked = [
    //     {
    //         userId: "1",
    //         regionId: "1",
    //         waypoints:[
    //             {
    //                 latitude: 51.688513,
    //                 longitude: 5.287445
    //             },
    //             {
    //                 latitude: 51.689298,
    //                 longitude: 5.287756
    //             },
    //             {
    //                 latitude: 51.689604,
    //                 longitude: 5.286731
    //             },
    //             {
    //                 latitude: 51.690953,
    //                 longitude: 5.287195
    //             }
    //         ]
    //     },
    //     {
    //         userId: "2",
    //         regionId: "1",
    //         waypoints:[
    //             {
    //                 latitude: 51.686144,
    //                 longitude: 5.289735
    //             },
    //             {
    //                 latitude: 51.685944,
    //                 longitude: 5.290808
    //             },
    //             {
    //                 latitude: 51.688418,
    //                 longitude: 5.291827
    //             },
    //             {
    //                 latitude: 51.688591,
    //                 longitude: 5.290808
    //             },
    //             {
    //                 latitude: 51.689249,
    //                 longitude: 5.291001
    //             }
    //         ]
    //     }
    // ];

    function getRoutesWalked() {
        //return routesWalked;
        var user = AuthorizationFactory.getUser();
        console.log(user);
        console.log(AuthorizationFactory.getAuthToken());

        return $http.get(hostname + '/routeswalked?perPage=1000', { headers: { 'bearer': token } } ).then(function (routesWalked) {
            console.log(routesWalked.data.data);
            return routesWalked.data.data;
        }, function(error){
            console.log(error);
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
            console.log(response);
            return response.data;
        }, function(error){
            console.log(error);
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
