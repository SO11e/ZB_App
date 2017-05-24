module.exports = function ($ionicPopup, $translate) {

    function showMap(lat, lng, callback) {
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

    function showLocationError() {
        $ionicPopup.alert({
            title: $translate.instant('MAP_UNKNOWN_LOCATION'),
            template: $translate.instant('MAP_UNKNOWN_LOCATION_EXPLANATION'),
            okText: $translate.instant('MAP_UNKNOWN_LOCATION_ERROR_ACCEPT')
        });
    }

    return {
        showMap: showMap,
        showLocationError: showLocationError
    };
};