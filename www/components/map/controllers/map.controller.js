module.exports = function ($scope, $state, $cordovaGeolocation, $ionicPopup, $window, IssuesFactory, RoutesWalkedFactory, MapFactory) {

    var gpsEnabled = false;
    var timer = undefined;
    var routeWalked = {};
    var dirService = new google.maps.DirectionsService();

    var test = true;
    var testLat;
    var testLng;

    // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };
    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        gpsEnabled = true;
        testLat = position.coords.latitude;
        testLng = position.coords.longitude;
        MapFactory.showMap(position.coords.latitude, position.coords.longitude);
    }, function(error){
        MapFactory.showLocationError();
        gpsEnabled = false;

        testLat = 51.688420;
        testLng = 5.287392;
        MapFactory.showMap(testLat, testLng);
    });

    $scope.createIssue = function() {
        $state.go("app.map.addIssue");
    };

    $scope.walkRoute = function(){
        if(typeof timer === 'undefined'){
            if(gpsEnabled){
                if(typeof timer === 'undefined'){
                    routeWalked = [];

                    timer = setInterval(updateRoute, 3000);
                    document.getElementById("route-button").innerHTML = "Stop route";
                }
            }
            else{
                MapFactory.showLocationError();
            }
        }
        else{
            var popup = $ionicPopup.confirm({
                title: "Route stoppen",
                template: "Wilt u deze route opslaan?"
            });

            popup.then(function (res) {
                if(res){
                    clearInterval(timer);
                    timer = undefined;
                    document.getElementById("route-button").innerHTML = "Start route";
                    RoutesWalkedFactory.addRouteWalked(routeWalked).then(function(res){
                        $window.location.reload(true);
                    });
                }
                else{

                }
            })
        }
    };

    function updateRoute(){
        if(test){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].latitude, routeWalked[routeWalked.length-1].longitude, testLat, testLng) > 20){
                    routeWalked.push({
                        latitude: testLat,
                        longitude: testLng
                    });
                }
            }
            else{
                routeWalked.push({
                    latitude: testLat,
                    longitude: testLng
                });
            }
            var pos = new google.maps.LatLng(testLat, testLng);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                var origin = new google.maps.LatLng(routeWalked[routeWalked.length-2].latitude, routeWalked[routeWalked.length-2].longitude);
                var destination = new google.maps.LatLng(routeWalked[routeWalked.length-1].latitude, routeWalked[routeWalked.length-1].longitude);
                MapFactory.renderRoute(origin, destination, 'blue');
            }

            return;
        }

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].latitude, routeWalked[routeWalked.length-1].longitude, position.coords.latitude, position.coords.longitude) > 20){
                    routeWalked.push({
                        latitude: testLat,
                        longitude: testLng
                    });
                }
            }
            else{
                routeWalked.push({
                    latitude: testLat,
                    longitude: testLng
                });
            }
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                var origin = new google.maps.LatLng(routeWalked[routeWalked.length-2].latitude, routeWalked[routeWalked.length-2].longitude);
                var destination = new google.maps.LatLng(routeWalked[routeWalked.length-1].latitude, routeWalked[routeWalked.length-1].longitude);
                MapFactory.renderRoute(origin, destination, 'blue');
            }

        }, function(error){
            // Show Could not get location alert dialog
            gpsEnabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Geen locatie',
                template: 'We kunnen helaas uw huidige locatie niet ophalen'
            });

            clearInterval(timer);
        });
    }

    function measure(lat1, lon1, lat2, lon2){
        var R = 6378.137;
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000;
    }
};