module.exports = function ($scope, $state, $cordovaGeolocation, $ionicPopup, IssuesFactory, RoutesWalkedFactory, $window) {

    var issues = IssuesFactory.getIssues();
    var routesWalked;
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
        showMap(position.coords.latitude, position.coords.longitude);
    }, function(error){
        // Show Could not get location alert dialog
        gpsEnabled = false;
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
        });

        testLat = 51.688420;
        testLng = 5.287392;
        showMap(51.688420, 5.287392);
    });


    function showMap(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);

        // Map options
        var mapOptions = {
            zoom: 12,
            center: latLng,
            disableDefaultUI: true
        };
        // Map element
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Google Maps
        // Wait until the map is loaded
        // Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){
            $scope.hideSpinner = true;
            for(var i = 0; i < issues.length; i++){
                var coordinates = new google.maps.LatLng(issues[i].latitude, issues[i].longitude);
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: coordinates
                });

                var infoWindow = new google.maps.InfoWindow();
                var content =   '<img src="' + issues[i].foto + '" width="100"/>' +
                    '<br>' + issues[i].toelichting +
                    '<br><a href="/#/app/issues/' + issues[i].id + '">Melding</a> ';
                google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow){
                    return function() {
                        infoWindow.setContent(content);
                        infoWindow.open(map,marker);
                    };
                })(marker,content,infoWindow));
            }

            google.maps.event.addListener($scope.map, 'click', function(event){
                console.log('latLng: ' + event.latLng.lat() + ', ' + event.latLng.lng());

                testLat = event.latLng.lat();
                testLng = event.latLng.lng();
            });

            //Add routes walked
            var peter = 0;
            RoutesWalkedFactory.getRoutesWalked().then(function(rw){
                for(var j = 0; j < rw.length; j++){
                    console.log("Route: " + j);
                    for(var i = 0; i < rw[j].waypoints.length; i++){
                        console.log("w: " + i);
                        if(i > 0){
                            var origin = new google.maps.LatLng(rw[j].waypoints[i-1].latitude, rw[j].waypoints[i-1].longitude);
                            var destination = new google.maps.LatLng(rw[j].waypoints[i].latitude, rw[j].waypoints[i].longitude);
                            peter++;
                            renderRoute(origin, destination, 'green');
                        }
                    }
                }
            });

        });
    }

    $scope.createIssue = function() {
        $state.go("app.map.addIssue");
    };

    $scope.walkRoute = function(){
        if(typeof timer === 'undefined'){
            if(gpsEnabled){
                if(typeof timer === 'undefined'){
                    console.log('start route');

                    routeWalked = [];

                    timer = setInterval(updateRoute, 3000);
                    document.getElementById("route-button").innerHTML = "Stop route";
                }
            }
            else{
                $ionicPopup.alert({
                    title: 'Geen locatie',
                    template: 'We kunnen helaas uw huidige locatie niet ophalen'
                });
            }
        }
        else{

            var popup = $ionicPopup.confirm({
                title: "Route stoppen",
                template: "Wilt u deze route opslaan?"
            })

            popup.then(function (res) {
                if(res){
                    console.log('end route');
                    clearInterval(timer);
                    timer = undefined;
                    document.getElementById("route-button").innerHTML = "Start route";
                    RoutesWalkedFactory.addRouteWalked(routeWalked).then(function(res){
                        //$window.location.reload(true);
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
                renderRoute(origin, destination, 'blue');
            }
            console.log(routeWalked);

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
                renderRoute(origin, destination, 'blue');
            }
            console.log(routeWalked);

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

    function renderRoute(origin, destination, color){
        if(typeof color === 'undefined'){ color = 'green'; }

        var polylineOptions = {
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 4
        };

        var request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
        };
        dirService.route(request, function(response, status){
            if(status === google.maps.DirectionsStatus.OK){
                var legs = response.routes[0].legs;
                for (i = 0; i < legs.length; i++){
                    var steps = legs[i].steps;
                    for (j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        var stepPolyline = new google.maps.Polyline(polylineOptions);
                        for (k = 0; k < nextSegment.length; k++) {
                            stepPolyline.getPath().push(nextSegment[k]);
                        }
                        stepPolyline.setMap($scope.map);
                    }
                }
            }
        });
    }
};