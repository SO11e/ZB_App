module.exports = function ($ionicPopup, $translate, IssuesFactory, RoutesWalkedFactory, $rootScope) {

    function showIssueMap(lat, lng, callback) {
        var latLng = new google.maps.LatLng(lat, lng);

        var mapOptions = {
            zoom: 15,
            center: latLng,
            disableDefaultUI: true
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        google.maps.event.addListenerOnce(map, 'idle', function() {
            new google.maps.Marker({
                map: map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });
        });

        callback();
    }

    function getCurrentAddress(geocoder, latLng, lat, lng) {
        console.log("Getting current address");

        geocoder.geocode({'location': latLng}, function (results, status) {
            console.log("GEOCODER RESPONSE: " + status);
            console.log("RESULTS");
            console.log(results);
            if (status === 'OK') {
                if (results[0]) {
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
                        street = $translate.instant('ISSUES_ADD_LOCATION_NOT_FOUND');
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
                        city = $translate.instant('ISSUES_ADD_LOCATION_NOT_FOUND');
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
                        postalCode = $translate.instant('ISSUES_ADD_LOCATION_NOT_FOUND');
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
                    showLocationError();
                    // $ionicPopup.alert({
                    //     title: $translate.instant('ISSUES_ADD_NO_ADDRESS_FOUND'),
                    //     template: $translate.instant('ISSUES_ADD_NO_ADDRESS_FOUND_EXPLANATION')
                    // });
                }
            } else {
                showLocationError();
                // $ionicPopup.alert({
                //     title: 'Fout bij het ophalen van het adres.',
                //     template: 'We kunnen helaas uw huidige adres niet vinden. Raadpleeg a.u.b. de beeherder.'
                // });
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

    return {
        showIssueMap: showIssueMap,
        getCurrentAddress: getCurrentAddress,
        showLocationError: showLocationError
    };
};