module.exports = function ($scope, $rootScope, $cordovaGeolocation, $ionicPopup, MapFactory) {

     // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

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
            zoom: 9,
            center: latLng,
            disableDefaultUI: true
        };

        // Map element
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;

        // Variables needed to get the address
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        getCurrentAddress(geocoder, map, infowindow, latLng, lat, lng);

        // Google Maps
        // Wait until the map is loaded
        // Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            $scope.hideSpinner = true;
        });
    };

    function getCurrentAddress(geocoder, map, infowindow, latLng, lat, lng) {
        console.log("Getting current address");

        geocoder.geocode({'location': latLng}, function (results, status) {
            console.log("GEOCODER RESPONSE: " + status);
            console.log("RESULTS");
            console.log(results);
            if (status === 'OK') {
                if (results[0]) {
                    map.setZoom(17);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);

                    // variables for forLoops
                    var i = 0;
                    var o = 0;

                    // Getting street
                    var street = "";
                    var streetFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "route") {
                                streetFound = true;
                                street = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!streetFound){
                        street = "Niet gevonden";
                    } 

                    // Getting city
                    var city = "";
                    var cityFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "locality") {
                                cityFound = true;
                                city = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!cityFound){
                        city = "Niet gevonden";
                    }

                    // Getting postal code
                    var postalCode = "";
                    var postalCodeFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "postal_code" || results[0].address_components[o].types[i] === "postal_code_prefix") {
                                postalCodeFound = true;
                                postalCode = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!postalCodeFound){
                        postalCode = "Niet gevonden";
                    }

         
                    console.log('Broadcasting: addressLoadedEvent');
                    // Broadcast address loaded
                    $rootScope.$broadcast('addressLoadedEvent', {
                        street: street,
                        city: city,
                        postalCode: postalCode,
                        lng: lng,
                        lat: lat
                    });


                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Geen adres gevonden.',
                        template: 'We kunnen helaas uw huidige adres niet vinden. Raadpleeg a.u.b. de beeherder.'
                    });
                }
            } else {
                var errorPopup = $ionicPopup.alert({
                    title: 'Fout bij het ophalen van het adres.',
                    template: 'We kunnen helaas uw huidige adres niet vinden. Raadpleeg a.u.b. de beeherder.'
                });
            }
        });
    }
};