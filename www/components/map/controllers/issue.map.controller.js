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

    function getCurrentAddress(geocoder, map, infowindow, latLng, lat, lng) {
        console.log("Getting current address with latLng");
        console.log(latLng);

        geocoder.geocode({'location': latLng}, function (results, status) {
            console.log(status);
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

                    // Getting street
                    var street = "";
                    var streetFound = false;
                    for (var s = 0; s < results[0].address_components[0].types.length; s++) {
                        if (results[0].address_components[0].types[s] === "route") {
                            streetFound = true;
                            break;
                        }
                    }
                    if(streetFound){
                        street = results[0].address_components[0].long_name;
                    } else {
                        street = "Niet gevonden";
                    }

                    // Getting house number
                    // TODO:: verder het type naar de goede
                    var houseNumber = "";
                    var houseNumberFound = false;
                    for (var h = 0; h < results[0].address_components[0].types.length; h++) {
                        if (results[0].address_components[0].types[h] === "number") {
                            houseNumberFound = true;
                            break;
                        }
                    }
                    if(houseNumberFound){
                        houseNumber = results[0].address_components[0].long_name;
                    } else {
                        houseNumber = "Niet gevonden";
                    }

                    // Getting city
                    var city = "";
                    var cityFound = false;
                    for (var c = 0; c < results[0].address_components[2].types.length; c++) {
                        if (results[0].address_components[2].types[c] === "locality" || results[0].address_components[2].types[c] === "political") {
                            cityFound = true;
                            break;
                        }
                    }
                    if(cityFound){
                        city = results[0].address_components[2].long_name;
                    } else {
                        city = "Niet gevonden";
                    }

                    // Getting postal code
                    var postalCode = "";
                    var postalCodeFound = false;
                    for (var p = 0; p < results[0].address_components[5].types.length; p++) {
                        if (results[0].address_components[5].types[p] === "postal_code" || results[0].address_components[5].types[p] === "postal_code_prefix") {
                            postalCodeFound = true;
                            break;
                        }
                    }
                    if(postalCodeFound){
                        postalCode = results[0].address_components[5].long_name;
                    } else {
                        postalCode = "Niet gevonden";
                    }

                    console.log('Broadcasting');
                    console.log('Street: ' + street);
                    console.log('House Number: ' + houseNumber);
                    console.log('City: ' + city);
                    console.log('PostalCode: ' + postalCode);
                    console.log('Lng: ' + lng);
                    console.log('Lat: ' + lat);

                    // Broadcast address loaded
                    $rootScope.$broadcast('addressLoadedEvent', {
                        street: street,
                        houseNumber: houseNumber,
                        city: city,
                        postalCode: postalCode,
                        lng: lng,
                        lat: lat
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