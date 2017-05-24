module.exports = function ($ionicPopup, $translate, IssuesFactory, RoutesWalkedFactory) {

    function showIssueMap(lat, lng, callback) {
        var latLng = new google.maps.LatLng(lat, lng);

        // Map options
        var mapOptions = {
            zoom: 15,
            center: latLng,
            disableDefaultUI: true
        };

        // Map element
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Google Maps
        // Wait until the map is loaded
        // Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce(map, 'idle', function() {
            var marker = new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Dit is een melding!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        });

        callback();
    }

    function showMap(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);

        // Map options
        var mapOptions = {
            zoom: 12,
            center: latLng,
            disableDefaultUI: true
        };
        // Map element
        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Google Maps
        // Wait until the map is loaded
        // Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce(map, 'idle', function(){
            IssuesFactory.getIssues().then(function (issues) {
                for (var i = 0; i < issues.length; i++) {
                    var coordinates = new google.maps.LatLng(issues[i].latitude, issues[i].longitude);
                    var marker = new google.maps.Marker({
                        map: map,
                        animation: google.maps.Animation.DROP,
                        position: coordinates
                    });

                    var infoWindow = new google.maps.InfoWindow();
                    var content = '<img src="' + issues[i].foto + '" width="100"/>' +
                        '<br>' + issues[i].toelichting +
                        '<br><a href="/#/app/issues/' + issues[i].id + '">Melding</a> ';
                    google.maps.event.addListener(marker, 'click', (function (marker, content, infoWindow) {
                        return function () {
                            infoWindow.setContent(content);
                            infoWindow.open(map, marker);
                        };
                    })(marker, content, infoWindow));
                }
            }, function (error) {
                console.error(error);
            });

            google.maps.event.addListener(map, 'click', function(event){
                testLat = event.latLng.lat();
                testLng = event.latLng.lng();
            });

            //Add routes walked
            var counter = 0;
            RoutesWalkedFactory.getRoutesWalked().then(function(rw){
                for(var j = 0; j < rw.length; j++){
                    for(var i = 0; i < rw[j].waypoints.length; i++){
                        if(i > 0){
                            var origin = new google.maps.LatLng(rw[j].waypoints[i-1].latitude, rw[j].waypoints[i-1].longitude);
                            var destination = new google.maps.LatLng(rw[j].waypoints[i].latitude, rw[j].waypoints[i].longitude);
                            counter++;
                            setTimeout(renderRoute, counter*400, origin, destination, 'green');
                        }
                    }
                }
            });

        });
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
        new google.maps.DirectionsService().route(request, function(response, status){
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
                        stepPolyline.setMap(map);
                    }
                }
            }
        });
    }

    function showLocationError() {
        $ionicPopup.alert({
            title: $translate.instant('MAP_UNKNOWN_LOCATION'),
            template: $translate.instant('MAP_UNKNOWN_LOCATION_EXPLANATION'),
            okText: $translate.instant('MAP_UNKNOWN_LOCATION_ERROR_ACCEPT')
        });
    }
    
    function showRouteConfirmation(callback) {
        $ionicPopup.confirm({
            title: $translate.instant('MAP_ROUTE_STOP'),
            template: $translate.instant('MAP_ROUTE_STOP_EXPLANATION'),
            okText: $translate.instant('MAP_ROUTE_STOP_YES'),
            cancelText: $translate.instant('MAP_ROUTE_STOP_NO')
        }).then(function () {
            callback();
        });
    }

    return {
        showIssueMap: showIssueMap,
        showMap: showMap,
        renderRoute: renderRoute,
        showLocationError: showLocationError,
        showRouteConfirmation: showRouteConfirmation
    };
};