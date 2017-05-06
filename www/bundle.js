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
module.exports = function ($scope, $state, $stateParams, IssuesFactory, $cordovaCamera) {

    $scope.addPhoto = function () {
        document.addEventListener("deviceready", function () {

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
        console.log('test');

        //$scope.showPhoto = true;
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
module.exports = function () {
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

    return {
        getIssues: getIssues,
        getIssue: getIssue
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
module.exports = function ($scope, $cordovaGeolocation, $ionicPopup) {

    // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    console.log("test3");

    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        showMap(position.coords.latitude, position.coords.longitude);
    }, function(error){
        // Show Could not get location alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
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

        console.log("test2");

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
        console.log("test1");
        console.log(latLng);
        geocoder.geocode({'location': latLng}, function (results, status) {
            if (status === 'OK') {
                if (results[1]) {
                    map.setZoom(11);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                    infowindow.setContent(results[1].formatted_address);
                    infowindow.open(map, marker);
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }

    // console.log("test");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmFkZC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLm1vZHVsZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlJyk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbScsIFtcclxuICAgICdpb25pYycsXHJcbiAgICAnbmdDb3Jkb3ZhJyxcclxuICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcclxuICAgICd6b25uZWJsb2VtLm1haW4nLFxyXG4gICAgJ3pvbm5lYmxvZW0ubWFwJyxcclxuICAgICd6b25uZWJsb2VtLmlzc3VlcycsXHJcbiAgICAnem9ubmVibG9lbS5zZXR0aW5ncydcclxuXSlcclxuXHJcbiAgICAucnVuKGZ1bmN0aW9uICgkaW9uaWNQbGF0Zm9ybSkge1xyXG4gICAgICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuS2V5Ym9hcmQpIHtcclxuICAgICAgICAgICAgICAgIEtleWJvYXJkLmhpZGVGb3JtQWNjZXNzb3J5QmFyKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuc2hyaW5rVmlldyh0cnVlKTtcclxuICAgICAgICAgICAgICAgIEtleWJvYXJkLmRpc2FibGVTY3JvbGxpbmdJblNocmlua1ZpZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XHJcbiAgICAgICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIElzc3Vlc0ZhY3RvcnksICRjb3Jkb3ZhQ2FtZXJhKSB7XHJcblxyXG4gICAgJHNjb3BlLmFkZFBob3RvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHF1YWxpdHk6IDUwLFxyXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMLFxyXG4gICAgICAgICAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcclxuICAgICAgICAgICAgICAgIGFsbG93RWRpdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0V2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgICAgIHRhcmdldEhlaWdodDogMTAwLFxyXG4gICAgICAgICAgICAgICAgcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0T3JpZW50YXRpb246dHJ1ZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uKGltYWdlRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215SW1hZ2UnKTtcclxuICAgICAgICAgICAgICAgIGltYWdlLnNyYyA9IFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCxcIiArIGltYWdlRGF0YTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBlcnJvclxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSwgZmFsc2UpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCd0ZXN0Jyk7XHJcblxyXG4gICAgICAgIC8vJHNjb3BlLnNob3dQaG90byA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVQaG90byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICAgJHNjb3BlLmlzc3VlID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZSgkc3RhdGVQYXJhbXMuaXNzdWVJZCk7XHJcblxyXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcclxuICAgICAgICAkc2NvcGUucmVwb3J0ID0gcmVwb3J0O1xyXG4gICAgfSk7Ki9cclxuXHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIElzc3Vlc0ZhY3RvcnkpIHtcclxuXHJcbiAgJHNjb3BlLmlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcblxyXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gIH0pKi9cclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlzc3VlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBzdHJhYXQ6IFwiWm9yZ3ZsaWV0c3RyYWF0XCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IDQ5MSxcclxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxyXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcclxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiVGUgaG9nZSBzdG9lcHJhbmRcIixcclxuICAgICAgICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcclxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDItMjBcIixcclxuICAgICAgICAgICAgZGF0dW1fb3BnZWxvc3Q6IG51bGwsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41NzM0MzgsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC44MTI3NzNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIHN0cmFhdDogXCJDaGFzc2V2ZWxkXCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IG51bGwsXHJcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcclxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXHJcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIkhlayBvcCBkZSBzdG9lcFwiLFxyXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxyXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMS0wNFwiLFxyXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogXCIyMDE3LTAyLTE1XCIsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41ODg4NzUsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC43ODU2NjNcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlcygpIHtcclxuICAgICAgICByZXR1cm4gaXNzdWVzO1xyXG5cclxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcclxuICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlKGlzc3VlSWQpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzc3Vlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxyXG4gICAgICAgIGdldElzc3VlOiBnZXRJc3N1ZVxyXG4gICAgfTtcclxufTtcclxuIiwidmFyIGlzc3Vlc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLmlzc3VlcycsIFtdKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanNcIikpO1xyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQWRkQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5hZGQuY29udHJvbGxlci5qc1wiKSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuZmFjdG9yeShcIklzc3Vlc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vaXNzdWVzLnJvdXRlcy5qc1wiKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzc3Vlc01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9pc3N1ZXMnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3Vlc0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMuYWRkJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdtYXBAYXBwLmlzc3Vlcy5hZGQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvaXNzdWUubWFwLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZU1hcENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmFkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVBZGRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzLmRldGFpbHMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy86aXNzdWVJZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnaXNzdWVzQGFwcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuZGV0YWlscy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn07XHJcbiIsInZhciBtYWluTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFpbicsIFtdKTtcclxuXHJcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4ucm91dGVzXCIpKTtcclxubWFpbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFpbi50cmFuc2xhdGlvblwiKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5Nb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FwcCcsXHJcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21haW4uaHRtbCdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2lzc3VlcycpO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcclxuXHJcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXJcclxuICAgICAgICAudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xyXG4gICAgICAgICAgICBwcmVmaXg6ICdsb2NhbGVzLycsXHJcbiAgICAgICAgICAgIHN1ZmZpeDogJy5qc29uJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnbmwnLCAnZW4nXSwge1xyXG4gICAgICAgICAgICAnbmwnIDogJ25sJyxcclxuICAgICAgICAgICAgJ25sX05MJzogJ25sJyxcclxuICAgICAgICAgICAgJ2VuJzogJ2VuJyxcclxuICAgICAgICAgICAgJ2VuX1VTJzogJ2VuJyxcclxuICAgICAgICAgICAgJ2VuX1VLJzogJ2VuJ1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnByZWZlcnJlZExhbmd1YWdlKCdubCcpXHJcbiAgICAgICAgLmZhbGxiYWNrTGFuZ3VhZ2UoJ25sJylcclxuICAgICAgICAuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKVxyXG4gICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZVBhcmFtZXRlcnMnKVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJGNvcmRvdmFHZW9sb2NhdGlvbiwgJGlvbmljUG9wdXApIHtcclxuXHJcbiAgICAvLyBHb29nbGUgTWFwcyBvcHRpb25zXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgY29uc29sZS5sb2coXCJ0ZXN0M1wiKTtcclxuXHJcbiAgICAvLyBTZXRzIG1hcCB0byBjdXJyZW50IGxvY2F0aW9uXHJcbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuICAgICAgICBzaG93TWFwKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgICB9LCBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xyXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vVE9ETyBwcm9tdCB2b29yIGhldCBhYW56ZXR0ZW4gdmFuIGxvY2F0aWUgc2VydmljZVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcblxyXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDE1LFxyXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcclxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XHJcbiAgICAgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xyXG4gICAgICAgICRzY29wZS5tYXAgPSBtYXA7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdDJcIik7XHJcblxyXG4gICAgICAgIC8vIFZhcmlhYmxlcyBuZWVkZWQgdG8gZ2V0IHRoZSBhZGRyZXNzXHJcbiAgICAgICAgdmFyIGdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyO1xyXG4gICAgICAgIHZhciBpbmZvd2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3c7XHJcbiAgICAgICAgZ2V0Q3VycmVudEFkZHJlc3MoZ2VvY29kZXIsIG1hcCwgaW5mb3dpbmRvdywgbGF0TG5nKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkRpdCBpcyBlZW4gbWVsZGluZyFcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50QWRkcmVzcyhnZW9jb2RlciwgbWFwLCBpbmZvd2luZG93LCBsYXRMbmcpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRlc3QxXCIpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGxhdExuZyk7XHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7J2xvY2F0aW9uJzogbGF0TG5nfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnT0snKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0c1sxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcC5zZXRab29tKDExKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXRMbmcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogbWFwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5zZXRDb250ZW50KHJlc3VsdHNbMV0uZm9ybWF0dGVkX2FkZHJlc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGluZm93aW5kb3cub3BlbihtYXAsIG1hcmtlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnTm8gcmVzdWx0cyBmb3VuZCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdHZW9jb2RlciBmYWlsZWQgZHVlIHRvOiAnICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKFwidGVzdFwiKTtcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICAgdmFyIGlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcblxyXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXHJcbiAgICB9O1xyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG5cclxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xyXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiAxMixcclxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNYXAgZWxlbWVudFxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRpbmF0ZXMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGlzc3Vlc1tpXS5sYXRpdHVkZSwgaXNzdWVzW2ldLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICAgJzxpbWcgc3JjPVwiJyArIGlzc3Vlc1tpXS5mb3RvICsgJ1wiIHdpZHRoPVwiMTAwXCIvPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+JyArIGlzc3Vlc1tpXS50b2VsaWNodGluZyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj48YSBocmVmPVwiLyMvYXBwL2lzc3Vlcy8nICsgaXNzdWVzW2ldLmlkICsgJ1wiPk1lbGRpbmc8L2E+ICdcclxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwnY2xpY2snLCAoZnVuY3Rpb24obWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdyl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsbWFya2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSkobWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCRzY29wZS5tYXAsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbGF0TG5nOiAnICsgZXZlbnQubGF0TG5nLmxhdCgpICsgJywgJyArIGV2ZW50LmxhdExuZy5sbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJ2YXIgbWFwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFwJywgW10pO1xyXG5cclxubWFwTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZU1hcENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUubWFwLmNvbnRyb2xsZXIuanNcIikpO1xyXG5tYXBNb2R1bGUuY29udHJvbGxlcignTWFwQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvbWFwLmNvbnRyb2xsZXIuanMnKSk7XHJcbm1hcE1vZHVsZS5mYWN0b3J5KFwiSXNzdWVzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi8uLi9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbm1hcE1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFwLnJvdXRlcy5qc1wiKSk7XHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL21hcCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL21hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFwQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSkge1xyXG5cclxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xyXG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmd1YWdlKTtcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XHJcblxyXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAkc3RhdGVQcm92aWRlclxyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XHJcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ3NldHRpbmdzJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuIl19
