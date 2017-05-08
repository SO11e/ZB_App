module.exports = function ($scope, $rootScope, $cordovaGeolocation, $ionicPopup) {

     // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };



    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        showMap(position.coords.latitude, position.coords.longitude);
    }, function(error){
        // Show Could not get location alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen. Zet uw locatie service aan.'
        });
        //TODO promt voor het aanzetten van locatie service
    });


    function showMap(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);

        // Map options
        var mapOptions = {
            zoom: 15,
            center: latLng,
            disableDefaultUI: true
        };

        // Map element
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;

        // Variables needed to get the address
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        getCurrentAddress(geocoder, map, infowindow, latLng);

        // Google Maps
        // Wait until the map is loaded
        // Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            $scope.hideSpinner = true;

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

            var infoWindow = new google.maps.InfoWindow({
                content: "Dit is een melding!"
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open($scope.map, marker);
            });

        });



    }

    function getCurrentAddress(geocoder, map, infowindow, latLng) {
        console.log("Getting current address with latLng");
        console.log(latLng)



        geocoder.geocode({'location': latLng}, function (results, status) {
            console.log(status);
            console.log(results);
            if (status === 'OK') {
                if (results[0]) {
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);

                    // Broadcast address loaded
                    $rootScope.$broadcast('addressLoadedEvent', {
                        address: results[0].address_components[1].long_name + ' ' + results[0].address_components[0].long_name,
                        city: results[0].address_components[2].long_name
                    });


                } else {
                    window.alert('Geen adres gevonden.');
                    console.log('No results found');
                }
            } else {
                window.alert('Fout bij het ophalen van het adres: Raadpleeg de beheerder.');
                console.log('Geocoder failed due to: ' + status);
            }
        });
    }
};