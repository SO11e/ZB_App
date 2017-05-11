(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./components/main/main.module');
require('./components/map/map.module');
require('./components/issues/issues.module.js');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
    'ionic',
    'ngCordova',
    'pascalprecht.translate',
    'zonnebloem.main',
    'zonnebloem.map',
    'zonnebloem.issues',
    'zonnebloem.settings'
])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.Keyboard) {
                Keyboard.hideFormAccessoryBar(true);
                Keyboard.shrinkView(true);
                Keyboard.disableScrollingInShrinkView(true);
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
        });
    });

},{"./components/issues/issues.module.js":6,"./components/main/main.module":8,"./components/map/map.module":13,"./components/settings/settings.module":16}],2:[function(require,module,exports){
module.exports = function ($scope, $rootScope, $state, $stateParams, IssuesFactory, $cordovaCamera, $ionicPopup, $translate) {

    $scope.issue = {
        street : '',
        city : '',
        postalCode : '',
        description : '',
        lat : '',
        lng : ''
    };

    console.log('issueAddController');
    $rootScope.$on('addressLoadedEvent', function (event, data) {
        console.log('addressLoadedEvent');
        $scope.issue.street = data.street;
        $scope.issue.city = data.city;
        $scope.issue.postalCode = data.postalCode;
        $scope.issue.lat = data.lat;
        $scope.issue.lng = data.lng;
        console.log(data); // 'Data to send'
    });

    $scope.takePhoto = function () {
        document.addEventListener("deviceready", function () {
            console.log('Opening Camera');

            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false,
                correctOrientation:true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });

        }, false);
    };

    $scope.addPhotoFromGallery = function () {
        console.log('Opening Gallery');
    };

    $scope.saveIssue = function () {
        console.log('Saving issue');
        var issue = {
            street : $scope.issue.street,
            city : $scope.issue.city,
            postalCode : $scope.issue.postalCode,
            description : $scope.issue.description,
            lat : $scope.issue.lat,
            lng : $scope.issue.lng
        };
        IssuesFactory.postIssue(issue);
    };

    $scope.removePhoto = function () {
        $scope.showPhoto = false;
    };
};

},{}],3:[function(require,module,exports){
module.exports = function ($scope, $state, $stateParams, IssuesFactory) {

    $scope.issue = IssuesFactory.getIssue($stateParams.issueId);

    /*ReportsFactory.getReport($stateParams.reportId).then(function (report) {
        $scope.report = report;
    });*/


};

},{}],4:[function(require,module,exports){
module.exports = function ($scope, IssuesFactory) {

  $scope.issues = IssuesFactory.getIssues();

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};

},{}],5:[function(require,module,exports){
module.exports = function ($http, $ionicPopup, $translate) {
    var issues = [
        {
            id: 0,
            straat: "Zorgvlietstraat",
            huisnummer: 491,
            postcode: "4834 NH",
            plaats: "Breda",
            toelichting: "Te hoge stoeprand",
            foto: "img/locatie.png",
            datum_gemeld: "2017-02-20",
            datum_opgelost: null,
            latitude: 51.573438,
            longitude: 4.812773
        },
        {
            id: 1,
            straat: "Chasseveld",
            huisnummer: null,
            postcode: "4811 DH",
            plaats: "Breda",
            toelichting: "Hek op de stoep",
            foto: "img/chasseveld.png",
            datum_gemeld: "2017-01-04",
            datum_opgelost: "2017-02-15",
            latitude: 51.588875,
            longitude: 4.785663
        }
    ];

    function getIssues() {
        return issues;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (issues) {
            return issues;
        });*/
    }

    function getIssue(issueId) {
        for (var i = 0; i < issues.length; i++) {
            if (issues[i].id === parseInt(issueId)) {
                return issues[i];
            }
        }
        return null;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (report) {
            return report;
        });*/
    }

    var token = '';
    function postIssue(issue) {
        if(issue.street === '' || issue.city === '' || issue.postalCode === '' || issue.description === '' || issue.lat === '' || issue.lng === ''){
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else {
            var req = {
                method: 'POST',
                url: 'https://zb-api.herokuapp.com/issues',
                header: {
                    'Content-Type': 'application/json',
                    'bearer': token
                },
                data: {
                    'streetName': issue.street,
                    'place': issue.city,
                    'postalCode': issue.postalCode,
                    'description': issue.description,
                    'latitude': issue.lat,
                    'longitude': issue.lng
                }
            };
            console.log(req);

            return $http(req)
                .then(function (response) {
                    console.log(response);

                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                        template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                    });
                }, function (error) {
                    console.log(error);

                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                        template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
                    });
                });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};

},{}],6:[function(require,module,exports){
var issuesModule = angular.module('zonnebloem.issues', []);

issuesModule.controller("IssuesController", require("./controllers/issues.controller.js"));
issuesModule.controller("IssueController", require("./controllers/issue.controller.js"));
issuesModule.controller("IssueAddController", require("./controllers/issue.add.controller.js"));

issuesModule.factory("IssuesFactory", require("./factories/issues.factory.js"));

issuesModule.config(require("./issues.routes.js"));

module.exports = issuesModule;
},{"./controllers/issue.add.controller.js":2,"./controllers/issue.controller.js":3,"./controllers/issues.controller.js":4,"./factories/issues.factory.js":5,"./issues.routes.js":7}],7:[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.issues', {
            url: '/issues',
            views: {
                'issues': {
                    templateUrl: 'components/issues/templates/issues.html',
                    controller: 'IssuesController'
                }
            }
        })

        .state('app.issues.add', {
            url: '/add',
            views: {
                'map@app.issues.add': {
                    templateUrl: 'components/map/templates/issue.map.html',
                    controller: 'IssueMapController'
                },
                'issues@app': {
                    templateUrl: 'components/issues/templates/issues.add.html',
                    controller: 'IssueAddController'
                }
            }
        })

        .state('app.issues.details', {
            url: '/:issueId',
            views: {
                'issues@app': {
                    templateUrl: 'components/issues/templates/issues.details.html',
                    controller: 'IssueController'
                }
            }
        });
};

},{}],8:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;
},{"./main.routes":9,"./main.translation":10}],9:[function(require,module,exports){
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'main.html'
        });

    $urlRouterProvider.otherwise('/app/issues');
};

},{}],10:[function(require,module,exports){
module.exports = function ($translateProvider) {

    $translateProvider
        .useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['nl', 'en'], {
            'nl' : 'nl',
            'nl_NL': 'nl',
            'en': 'en',
            'en_US': 'en',
            'en_UK': 'en'
        })
        .preferredLanguage('nl')
        .fallbackLanguage('nl')
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('escapeParameters')
};
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
module.exports = function ($scope, $cordovaGeolocation, $ionicPopup, IssuesFactory) {

    var issues = IssuesFactory.getIssues();

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
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
        });
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
                                '<br><a href="/#/app/issues/' + issues[i].id + '">Melding</a> '
                google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow){
                    return function() {
                        infoWindow.setContent(content);
                        infoWindow.open(map,marker);
                    };
                })(marker,content,infoWindow));

                google.maps.event.addListener($scope.map, 'click', function(event){
                    console.log('latLng: ' + event.latLng.lat() + ', ' + event.latLng.lng());
                });
            }

        });
    }
};
},{}],13:[function(require,module,exports){
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;
},{"./../issues/factories/issues.factory.js":5,"./controllers/issue.map.controller.js":11,"./controllers/map.controller.js":12,"./map.routes.js":14}],14:[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.map', {
            url: '/map',
            views: {
                'map': {
                    templateUrl: 'components/map/templates/map.html',
                    controller: 'MapController'
                }
            }
        })
};

},{}],15:[function(require,module,exports){
module.exports = function ($scope, $translate) {

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],16:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":15,"./settings.routes":17}],17:[function(require,module,exports){
module.exports = function ($stateProvider) {
  $stateProvider
    .state('app.settings', {
      url: '/settings',
      views: {
        'settings': {
          templateUrl: 'components/settings/templates/settings.html',
          controller: 'SettingsController'
        }
      }
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmFkZC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZScpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL2lzc3Vlcy9pc3N1ZXMubW9kdWxlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUnKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtJywgW1xyXG4gICAgJ2lvbmljJyxcclxuICAgICduZ0NvcmRvdmEnLFxyXG4gICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxyXG4gICAgJ3pvbm5lYmxvZW0ubWFpbicsXHJcbiAgICAnem9ubmVibG9lbS5tYXAnLFxyXG4gICAgJ3pvbm5lYmxvZW0uaXNzdWVzJyxcclxuICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xyXG5dKVxyXG5cclxuICAgIC5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtKSB7XHJcbiAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuaGlkZUZvcm1BY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5zaHJpbmtWaWV3KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbGluZ0luU2hyaW5rVmlldyh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkcm9vdFNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgSXNzdWVzRmFjdG9yeSwgJGNvcmRvdmFDYW1lcmEsICRpb25pY1BvcHVwLCAkdHJhbnNsYXRlKSB7XHJcblxyXG4gICAgJHNjb3BlLmlzc3VlID0ge1xyXG4gICAgICAgIHN0cmVldCA6ICcnLFxyXG4gICAgICAgIGNpdHkgOiAnJyxcclxuICAgICAgICBwb3N0YWxDb2RlIDogJycsXHJcbiAgICAgICAgZGVzY3JpcHRpb24gOiAnJyxcclxuICAgICAgICBsYXQgOiAnJyxcclxuICAgICAgICBsbmcgOiAnJ1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zb2xlLmxvZygnaXNzdWVBZGRDb250cm9sbGVyJyk7XHJcbiAgICAkcm9vdFNjb3BlLiRvbignYWRkcmVzc0xvYWRlZEV2ZW50JywgZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2FkZHJlc3NMb2FkZWRFdmVudCcpO1xyXG4gICAgICAgICRzY29wZS5pc3N1ZS5zdHJlZXQgPSBkYXRhLnN0cmVldDtcclxuICAgICAgICAkc2NvcGUuaXNzdWUuY2l0eSA9IGRhdGEuY2l0eTtcclxuICAgICAgICAkc2NvcGUuaXNzdWUucG9zdGFsQ29kZSA9IGRhdGEucG9zdGFsQ29kZTtcclxuICAgICAgICAkc2NvcGUuaXNzdWUubGF0ID0gZGF0YS5sYXQ7XHJcbiAgICAgICAgJHNjb3BlLmlzc3VlLmxuZyA9IGRhdGEubG5nO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpOyAvLyAnRGF0YSB0byBzZW5kJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLnRha2VQaG90byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnT3BlbmluZyBDYW1lcmEnKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcXVhbGl0eTogNTAsXHJcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvblR5cGU6IENhbWVyYS5EZXN0aW5hdGlvblR5cGUuREFUQV9VUkwsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dFZGl0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZW5jb2RpbmdUeXBlOiBDYW1lcmEuRW5jb2RpbmdUeXBlLkpQRUcsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRXaWR0aDogMTAwLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0OiAxMDAsXHJcbiAgICAgICAgICAgICAgICBwb3BvdmVyT3B0aW9uczogQ2FtZXJhUG9wb3Zlck9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RPcmllbnRhdGlvbjp0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlJbWFnZScpO1xyXG4gICAgICAgICAgICAgICAgaW1hZ2Uuc3JjID0gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LFwiICsgaW1hZ2VEYXRhO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVycm9yXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZGRQaG90b0Zyb21HYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdPcGVuaW5nIEdhbGxlcnknKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnNhdmVJc3N1ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnU2F2aW5nIGlzc3VlJyk7XHJcbiAgICAgICAgdmFyIGlzc3VlID0ge1xyXG4gICAgICAgICAgICBzdHJlZXQgOiAkc2NvcGUuaXNzdWUuc3RyZWV0LFxyXG4gICAgICAgICAgICBjaXR5IDogJHNjb3BlLmlzc3VlLmNpdHksXHJcbiAgICAgICAgICAgIHBvc3RhbENvZGUgOiAkc2NvcGUuaXNzdWUucG9zdGFsQ29kZSxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb24gOiAkc2NvcGUuaXNzdWUuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgIGxhdCA6ICRzY29wZS5pc3N1ZS5sYXQsXHJcbiAgICAgICAgICAgIGxuZyA6ICRzY29wZS5pc3N1ZS5sbmdcclxuICAgICAgICB9O1xyXG4gICAgICAgIElzc3Vlc0ZhY3RvcnkucG9zdElzc3VlKGlzc3VlKTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcclxuICAgIH07XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIElzc3Vlc0ZhY3RvcnkpIHtcclxuXHJcbiAgICAkc2NvcGUuaXNzdWUgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlKCRzdGF0ZVBhcmFtcy5pc3N1ZUlkKTtcclxuXHJcbiAgICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xyXG4gICAgICAgICRzY29wZS5yZXBvcnQgPSByZXBvcnQ7XHJcbiAgICB9KTsqL1xyXG5cclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgSXNzdWVzRmFjdG9yeSkge1xyXG5cclxuICAkc2NvcGUuaXNzdWVzID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZXMoKTtcclxuXHJcbiAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnRzKCkudGhlbihmdW5jdGlvbiAoaXNzdWVzKSB7XHJcbiAgICAgICRzY29wZS5pc3N1ZXMgPSBpc3N1ZXM7XHJcbiAgfSkqL1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJGh0dHAsICRpb25pY1BvcHVwLCAkdHJhbnNsYXRlKSB7XHJcbiAgICB2YXIgaXNzdWVzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDAsXHJcbiAgICAgICAgICAgIHN0cmFhdDogXCJab3JndmxpZXRzdHJhYXRcIixcclxuICAgICAgICAgICAgaHVpc251bW1lcjogNDkxLFxyXG4gICAgICAgICAgICBwb3N0Y29kZTogXCI0ODM0IE5IXCIsXHJcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxyXG4gICAgICAgICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxyXG4gICAgICAgICAgICBmb3RvOiBcImltZy9sb2NhdGllLnBuZ1wiLFxyXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMi0yMFwiLFxyXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbCxcclxuICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjU3MzQzOCxcclxuICAgICAgICAgICAgbG9uZ2l0dWRlOiA0LjgxMjc3M1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgc3RyYWF0OiBcIkNoYXNzZXZlbGRcIixcclxuICAgICAgICAgICAgaHVpc251bW1lcjogbnVsbCxcclxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgxMSBESFwiLFxyXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcclxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXHJcbiAgICAgICAgICAgIGZvdG86IFwiaW1nL2NoYXNzZXZlbGQucG5nXCIsXHJcbiAgICAgICAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAxLTA0XCIsXHJcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIixcclxuICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjU4ODg3NSxcclxuICAgICAgICAgICAgbG9uZ2l0dWRlOiA0Ljc4NTY2M1xyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWVzKCkge1xyXG4gICAgICAgIHJldHVybiBpc3N1ZXM7XHJcblxyXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gaXNzdWVzO1xyXG4gICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWUoaXNzdWVJZCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChpc3N1ZXNbaV0uaWQgPT09IHBhcnNlSW50KGlzc3VlSWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNzdWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG5cclxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydDtcclxuICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIHZhciB0b2tlbiA9ICcnO1xyXG4gICAgZnVuY3Rpb24gcG9zdElzc3VlKGlzc3VlKSB7XHJcbiAgICAgICAgaWYoaXNzdWUuc3RyZWV0ID09PSAnJyB8fCBpc3N1ZS5jaXR5ID09PSAnJyB8fCBpc3N1ZS5wb3N0YWxDb2RlID09PSAnJyB8fCBpc3N1ZS5kZXNjcmlwdGlvbiA9PT0gJycgfHwgaXNzdWUubGF0ID09PSAnJyB8fCBpc3N1ZS5sbmcgPT09ICcnKXtcclxuICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9FUlJPUl9USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9FUlJPUl9FWFBMQU5BVElPTicpLFxyXG4gICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfRVJST1JfQUNDRVBUJylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIHJlcSA9IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgdXJsOiAnaHR0cHM6Ly96Yi1hcGkuaGVyb2t1YXBwLmNvbS9pc3N1ZXMnLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAgICAgICAgICAgICAnYmVhcmVyJzogdG9rZW5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3N0cmVldE5hbWUnOiBpc3N1ZS5zdHJlZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgJ3BsYWNlJzogaXNzdWUuY2l0eSxcclxuICAgICAgICAgICAgICAgICAgICAncG9zdGFsQ29kZSc6IGlzc3VlLnBvc3RhbENvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgJ2Rlc2NyaXB0aW9uJzogaXNzdWUuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgJ2xhdGl0dWRlJzogaXNzdWUubGF0LFxyXG4gICAgICAgICAgICAgICAgICAgICdsb25naXR1ZGUnOiBpc3N1ZS5sbmdcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVxKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkaHR0cChyZXEpXHJcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9TVUNDRVNTX1RJVExFJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfU1VDQ0VTU19FWFBMQU5BVElPTicpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9TVUNDRVNTX0FDQ0VQVCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9FUlJPUl9USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX0VSUk9SX0VYUExBTkFUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX0VSUk9SX0FDQ0VQVCcpXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRJc3N1ZXM6IGdldElzc3VlcyxcclxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWUsXHJcbiAgICAgICAgcG9zdElzc3VlOiBwb3N0SXNzdWVcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBpc3N1ZXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5pc3N1ZXMnLCBbXSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3Vlc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanNcIikpO1xyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5jb250cm9sbGVyLmpzXCIpKTtcclxuaXNzdWVzTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZUFkZENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUuYWRkLmNvbnRyb2xsZXIuanNcIikpO1xyXG5cclxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL2lzc3Vlcy5yb3V0ZXMuanNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc3N1ZXNNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvaXNzdWVzJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZXNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzLmFkZCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwQGFwcC5pc3N1ZXMuYWRkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL2lzc3VlLm1hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQWRkQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvOmlzc3VlSWQnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59O1xyXG4iLCJ2YXIgbWFpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1haW4nLCBbXSk7XHJcblxyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XHJcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9pc3N1ZXMnKTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxyXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcclxuICAgICAgICAgICAgJ25sJyA6ICdubCcsXHJcbiAgICAgICAgICAgICdubF9OTCc6ICdubCcsXHJcbiAgICAgICAgICAgICdlbic6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VSyc6ICdlbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC5mYWxsYmFja0xhbmd1YWdlKCdubCcpXHJcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcclxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwKSB7XHJcblxyXG4gICAgIC8vIEdvb2dsZSBNYXBzIG9wdGlvbnNcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxyXG4gICAgfTtcclxuXHJcblxyXG5cclxuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cclxuICAgICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xyXG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXHJcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4uIFpldCB1dyBsb2NhdGllIHNlcnZpY2UgYWFuLidcclxuICAgICAgICB9KTtcclxuICAgICAgICAvL1RPRE8gcHJvbXQgdm9vciBoZXQgYWFuemV0dGVuIHZhbiBsb2NhdGllIHNlcnZpY2VcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG5cclxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xyXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiA5LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcclxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xyXG4gICAgICAgICRzY29wZS5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgIC8vIFZhcmlhYmxlcyBuZWVkZWQgdG8gZ2V0IHRoZSBhZGRyZXNzXHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyO1xyXG4gICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3c7XHJcbiAgICAgICAgZ2V0Q3VycmVudEFkZHJlc3MoZ2VvY29kZXIsIG1hcCwgaW5mb3dpbmRvdywgbGF0TG5nLCBsYXQsIGxuZyk7XHJcblxyXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxyXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxhdExuZ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEaXQgaXMgZWVuIG1lbGRpbmchXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3Blbigkc2NvcGUubWFwLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudEFkZHJlc3MoZ2VvY29kZXIsIG1hcCwgaW5mb3dpbmRvdywgbGF0TG5nLCBsYXQsIGxuZykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiR2V0dGluZyBjdXJyZW50IGFkZHJlc3Mgd2l0aCBsYXRMbmdcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2cobGF0TG5nKTtcclxuXHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7J2xvY2F0aW9uJzogbGF0TG5nfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhzdGF0dXMpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHRzKTtcclxuICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ09LJykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXAuc2V0Wm9vbSgxNyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm93aW5kb3cuc2V0Q29udGVudChyZXN1bHRzWzBdLmZvcm1hdHRlZF9hZGRyZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXR0aW5nIHN0cmVldFxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHJlZXQgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdHJlZXRGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMF0udHlwZXMubGVuZ3RoOyBzKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzWzBdLnR5cGVzW3NdID09PSBcInJvdXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldEZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHN0cmVldEZvdW5kKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWV0ID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMF0ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldCA9IFwiTmlldCBnZXZvbmRlblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gR2V0dGluZyBob3VzZSBudW1iZXJcclxuICAgICAgICAgICAgICAgICAgICAvLyBUT0RPOjogdmVyZGVyIGhldCB0eXBlIG5hYXIgZGUgZ29lZGVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgaG91c2VOdW1iZXIgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBob3VzZU51bWJlckZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaCA9IDA7IGggPCByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50c1swXS50eXBlcy5sZW5ndGg7IGgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMF0udHlwZXNbaF0gPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdXNlTnVtYmVyRm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaG91c2VOdW1iZXJGb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXNlTnVtYmVyID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMF0ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXNlTnVtYmVyID0gXCJOaWV0IGdldm9uZGVuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBHZXR0aW5nIGNpdHlcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNpdHlGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGMgPSAwOyBjIDwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMl0udHlwZXMubGVuZ3RoOyBjKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzWzJdLnR5cGVzW2NdID09PSBcImxvY2FsaXR5XCIgfHwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMl0udHlwZXNbY10gPT09IFwicG9saXRpY2FsXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpdHlGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihjaXR5Rm91bmQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXR5ID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbMl0ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHkgPSBcIk5pZXQgZ2V2b25kZW5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldHRpbmcgcG9zdGFsIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zdGFsQ29kZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc3RhbENvZGVGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbNV0udHlwZXMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzWzVdLnR5cGVzW3BdID09PSBcInBvc3RhbF9jb2RlXCIgfHwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbNV0udHlwZXNbcF0gPT09IFwicG9zdGFsX2NvZGVfcHJlZml4XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhbENvZGVGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZihwb3N0YWxDb2RlRm91bmQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0YWxDb2RlID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbNV0ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhbENvZGUgPSBcIk5pZXQgZ2V2b25kZW5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdCcm9hZGNhc3RpbmcnKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU3RyZWV0OiAnICsgc3RyZWV0KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnSG91c2UgTnVtYmVyOiAnICsgaG91c2VOdW1iZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDaXR5OiAnICsgY2l0eSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1Bvc3RhbENvZGU6ICcgKyBwb3N0YWxDb2RlKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTG5nOiAnICsgbG5nKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTGF0OiAnICsgbGF0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQnJvYWRjYXN0IGFkZHJlc3MgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdhZGRyZXNzTG9hZGVkRXZlbnQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldDogc3RyZWV0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VzZU51bWJlcjogaG91c2VOdW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHk6IGNpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc3RhbENvZGU6IHBvc3RhbENvZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogbG5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQ6IGxhdFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnR2VlbiBhZHJlcyBnZXZvbmRlbi4nKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTm8gcmVzdWx0cyBmb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdGb3V0IGJpaiBoZXQgb3BoYWxlbiB2YW4gaGV0IGFkcmVzOiBSYWFkcGxlZWcgZGUgYmVoZWVyZGVyLicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0dlb2NvZGVyIGZhaWxlZCBkdWUgdG86ICcgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCwgSXNzdWVzRmFjdG9yeSkge1xyXG5cclxuICAgIHZhciBpc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xyXG5cclxuICAgIC8vIEdvb2dsZSBNYXBzIG9wdGlvbnNcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxyXG4gICAgfTtcclxuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cclxuICAgICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xyXG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXHJcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuXHJcbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcclxuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgem9vbTogMTIsXHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcclxuICAgICAgICAkc2NvcGUubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxyXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpc3N1ZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpc3N1ZXNbaV0ubGF0aXR1ZGUsIGlzc3Vlc1tpXS5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAgICc8aW1nIHNyYz1cIicgKyBpc3N1ZXNbaV0uZm90byArICdcIiB3aWR0aD1cIjEwMFwiLz4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPicgKyBpc3N1ZXNbaV0udG9lbGljaHRpbmcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+PGEgaHJlZj1cIi8jL2FwcC9pc3N1ZXMvJyArIGlzc3Vlc1tpXS5pZCArICdcIj5NZWxkaW5nPC9hPiAnXHJcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsJ2NsaWNrJywgKGZ1bmN0aW9uKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLG1hcmtlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcigkc2NvcGUubWFwLCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xhdExuZzogJyArIGV2ZW50LmxhdExuZy5sYXQoKSArICcsICcgKyBldmVudC5sYXRMbmcubG5nKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwidmFyIG1hcE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1hcCcsIFtdKTtcclxuXHJcbm1hcE1vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVNYXBDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzXCIpKTtcclxubWFwTW9kdWxlLmNvbnRyb2xsZXIoJ01hcENvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzJykpO1xyXG5tYXBNb2R1bGUuZmFjdG9yeShcIklzc3Vlc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vLi4vaXNzdWVzL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XHJcblxyXG5tYXBNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21hcC5yb3V0ZXMuanNcIikpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IG1hcE1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2FwcC5tYXAnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9tYXAnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ21hcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbWFwL3RlbXBsYXRlcy9tYXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hcENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICR0cmFuc2xhdGUpIHtcclxuXHJcbiAgICAkc2NvcGUuc3dpdGNoTGFuZ3VhZ2UgPSBmdW5jdGlvbiAobGFuZ3VhZ2UpIHtcclxuICAgICAgICAkdHJhbnNsYXRlLnVzZShsYW5ndWFnZSk7XHJcbiAgICB9O1xyXG5cclxufTtcclxuIiwidmFyIHNldHRpbmdzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uc2V0dGluZ3MnLCBbXSk7XHJcblxyXG5zZXR0aW5nc01vZHVsZS5jb250cm9sbGVyKFwiU2V0dGluZ3NDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXJcIikpO1xyXG5cclxuLy8gc2V0dGluZ3NNb2R1bGUuZmFjdG9yeShcIlNldHRpbmdzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvc2V0dGluZ3MuZmFjdG9yeVwiKSk7XHJcblxyXG5zZXR0aW5nc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vc2V0dGluZ3Mucm91dGVzXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NNb2R1bGU7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgJHN0YXRlUHJvdmlkZXJcclxuICAgIC5zdGF0ZSgnYXBwLnNldHRpbmdzJywge1xyXG4gICAgICB1cmw6ICcvc2V0dGluZ3MnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdzZXR0aW5ncyc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9zZXR0aW5ncy90ZW1wbGF0ZXMvc2V0dGluZ3MuaHRtbCcsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3NDb250cm9sbGVyJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbn07XHJcbiJdfQ==
