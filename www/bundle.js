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

},{"./components/issues/issues.module.js":5,"./components/main/main.module":7,"./components/map/map.module":13,"./components/settings/settings.module":16}],2:[function(require,module,exports){
module.exports = function ($scope, $state, $stateParams, IssuesFactory) {

    $scope.issue = IssuesFactory.getIssue($stateParams.issueId);

    /*ReportsFactory.getReport($stateParams.reportId).then(function (report) {
        $scope.report = report;
    });*/

    $scope.addPhoto = function () {
        $scope.showPhoto = true;
    };

    $scope.removePhoto = function () {
        $scope.showPhoto = false;
    };
};

},{}],3:[function(require,module,exports){
module.exports = function ($scope, IssuesFactory) {

  $scope.issues = IssuesFactory.getIssues();

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};

},{}],4:[function(require,module,exports){
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
            latitude: 51.689298,
            longitude: 5.287756
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
            latitude: 51.685944,
            longitude: 5.290808
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

},{}],5:[function(require,module,exports){
var issuesModule = angular.module('zonnebloem.issues', []);

issuesModule.controller("IssuesController", require("./controllers/issues.controller.js"));
issuesModule.controller("IssueController", require("./controllers/issue.controller.js"));

issuesModule.factory("IssuesFactory", require("./factories/issues.factory.js"));

issuesModule.config(require("./issues.routes.js"));

module.exports = issuesModule;
},{"./controllers/issue.controller.js":2,"./controllers/issues.controller.js":3,"./factories/issues.factory.js":4,"./issues.routes.js":6}],6:[function(require,module,exports){
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
                    controller: 'IssueController'
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

},{}],7:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;
},{"./main.routes":8,"./main.translation":9}],8:[function(require,module,exports){
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'main.html'
        });

    $urlRouterProvider.otherwise('/app/issues');
};

},{}],9:[function(require,module,exports){
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
},{}],10:[function(require,module,exports){
module.exports = function ($scope, $cordovaGeolocation, $ionicPopup) {

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
            zoom: 15,
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
};
},{}],11:[function(require,module,exports){
module.exports = function ($scope, $cordovaGeolocation, $ionicPopup, IssuesFactory, RoutesWalkedFactory) {

    var issues = IssuesFactory.getIssues();
    var routesWalked = RoutesWalkedFactory.getRoutesWalked();
    var gpsEnabled = false;
    var timer = undefined;
    var routeWalked = [];
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
                                '<br><a href="/#/app/issues/' + issues[i].id + '">Melding</a> '
                google.maps.event.addListener(marker,'click', (function(marker,content,infoWindow){
                    return function() {
                        infoWindow.setContent(content);
                        infoWindow.open(map,marker);
                    };
                })(marker,content,infoWindow));

                google.maps.event.addListener($scope.map, 'click', function(event){
                    console.log('latLng: ' + event.latLng.lat() + ', ' + event.latLng.lng());

                    testLat = event.latLng.lat();
                    testLng = event.latLng.lng();
                });
            }

            //Add routes walked
            for(var j = 0; j < routesWalked.length; j++){
                for(var i = 0; i < routesWalked[j].waypoints.length; i++){
                    if(i > 0){
                        var origin = new google.maps.LatLng(routesWalked[j].waypoints[i-1].latitude, routesWalked[j].waypoints[i-1].longitude);
                        var destination = new google.maps.LatLng(routesWalked[j].waypoints[i].latitude, routesWalked[j].waypoints[i].longitude);
                        renderRoute(origin, destination, 'green');
                    }
                }
            }

        });
    }

    $scope.walkRoute = function(){
        if(typeof timer == 'undefined'){
            if(gpsEnabled){
                if(typeof timer == 'undefined'){
                    console.log('start route');
                    timer = setInterval(updateRoute, 3000);
                    document.getElementById("route-button").innerHTML = "Stop route";
                }
            }
            else{
                var alertPopup = $ionicPopup.alert({
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

                    routesWalked.push(routeWalked);
                }
                else{

                }
            })
        }
    };

    function updateRoute(){
        if(test){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].lat(), routeWalked[routeWalked.length-1].lng(), testLat, testLng) > 20){
                    routeWalked.push(
                        new google.maps.LatLng(testLat, testLng)
                    );
                }
            }
            else{
                routeWalked.push(
                    new google.maps.LatLng(testLat, testLng)
                );
            }
            var pos = new google.maps.LatLng(testLat, testLng);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                renderRoute(routeWalked[routeWalked.length-2], routeWalked[routeWalked.length-1], 'blue');
            }
            console.log(routeWalked);

            return;
        }

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].lat(), routeWalked[routeWalked.length-1].lng(), position.coords.latitude, position.coords.longitude) > 20){
                    routeWalked.push(
                        new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    );
                }
            }
            else{
                routeWalked.push(
                    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                );
            }
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                renderRoute(routeWalked[routeWalked.length-2], routeWalked[routeWalked.length-1], 'blue');
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
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }

    function renderRoute(origin, destination, color){
        if(typeof color == 'undefined'){ color = 'green'; }

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
            if(status == google.maps.DirectionsStatus.OK){
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
},{}],12:[function(require,module,exports){
module.exports = function () {
    var routesWalked = [
        {
            userId: "1",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.688513,
                    longitude: 5.287445
                },
                {
                    latitude: 51.689298,
                    longitude: 5.287756
                },
                {
                    latitude: 51.689604,
                    longitude: 5.286731
                },
                {
                    latitude: 51.690953,
                    longitude: 5.287195
                }
            ]
        },
        {
            userId: "2",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.686144,
                    longitude: 5.289735
                },
                {
                    latitude: 51.685944,
                    longitude: 5.290808
                },
                {
                    latitude: 51.688418,
                    longitude: 5.291827
                },
                {
                    latitude: 51.688591,
                    longitude: 5.290808
                },
                {
                    latitude: 51.689249,
                    longitude: 5.291001
                }
            ]
        }
    ];

    function getRoutesWalked() {
        return routesWalked;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (routesWalked) {
         return routesWalked;
         });*/
    }

    return {
        getRoutesWalked: getRoutesWalked
    };
};

},{}],13:[function(require,module,exports){
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));
mapModule.factory("RoutesWalkedFactory", require("./factories/routesWalked.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;
},{"./../issues/factories/issues.factory.js":4,"./controllers/issue.map.controller.js":10,"./controllers/map.controller.js":11,"./factories/routesWalked.factory.js":12,"./map.routes.js":14}],14:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2ZhY3Rvcmllcy9yb3V0ZXNXYWxrZWQuZmFjdG9yeS5qcyIsInd3dy9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3Mucm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluL21haW4ubW9kdWxlJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9tYXAvbWFwLm1vZHVsZScpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXHJcbiAgICAnaW9uaWMnLFxyXG4gICAgJ25nQ29yZG92YScsXHJcbiAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXHJcbiAgICAnem9ubmVibG9lbS5tYWluJyxcclxuICAgICd6b25uZWJsb2VtLm1hcCcsXHJcbiAgICAnem9ubmVibG9lbS5pc3N1ZXMnLFxyXG4gICAgJ3pvbm5lYmxvZW0uc2V0dGluZ3MnXHJcbl0pXHJcblxyXG4gICAgLnJ1bihmdW5jdGlvbiAoJGlvbmljUGxhdGZvcm0pIHtcclxuICAgICAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcclxuICAgICAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgICAgICBpZiAod2luZG93LktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5oaWRlRm9ybUFjY2Vzc29yeUJhcih0cnVlKTtcclxuICAgICAgICAgICAgICAgIEtleWJvYXJkLnNocmlua1ZpZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5kaXNhYmxlU2Nyb2xsaW5nSW5TaHJpbmtWaWV3KHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xyXG4gICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICAgJHNjb3BlLmlzc3VlID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZSgkc3RhdGVQYXJhbXMuaXNzdWVJZCk7XHJcblxyXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcclxuICAgICAgICAkc2NvcGUucmVwb3J0ID0gcmVwb3J0O1xyXG4gICAgfSk7Ki9cclxuXHJcbiAgICAkc2NvcGUuYWRkUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dQaG90byA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVQaG90byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIElzc3Vlc0ZhY3RvcnkpIHtcclxuXHJcbiAgJHNjb3BlLmlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcblxyXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gIH0pKi9cclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlzc3VlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBzdHJhYXQ6IFwiWm9yZ3ZsaWV0c3RyYWF0XCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IDQ5MSxcclxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxyXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcclxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiVGUgaG9nZSBzdG9lcHJhbmRcIixcclxuICAgICAgICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcclxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDItMjBcIixcclxuICAgICAgICAgICAgZGF0dW1fb3BnZWxvc3Q6IG51bGwsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODkyOTgsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yODc3NTZcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIHN0cmFhdDogXCJDaGFzc2V2ZWxkXCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IG51bGwsXHJcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcclxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXHJcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIkhlayBvcCBkZSBzdG9lcFwiLFxyXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxyXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMS0wNFwiLFxyXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogXCIyMDE3LTAyLTE1XCIsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODU5NDQsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yOTA4MDhcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlcygpIHtcclxuICAgICAgICByZXR1cm4gaXNzdWVzO1xyXG5cclxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcclxuICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlKGlzc3VlSWQpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzc3Vlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxyXG4gICAgICAgIGdldElzc3VlOiBnZXRJc3N1ZVxyXG4gICAgfTtcclxufTtcclxuIiwidmFyIGlzc3Vlc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLmlzc3VlcycsIFtdKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanNcIikpO1xyXG5cclxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL2lzc3Vlcy5yb3V0ZXMuanNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc3N1ZXNNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvaXNzdWVzJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZXNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzLmFkZCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwQGFwcC5pc3N1ZXMuYWRkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL2lzc3VlLm1hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvOmlzc3VlSWQnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59O1xyXG4iLCJ2YXIgbWFpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1haW4nLCBbXSk7XHJcblxyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XHJcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9pc3N1ZXMnKTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxyXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcclxuICAgICAgICAgICAgJ25sJyA6ICdubCcsXHJcbiAgICAgICAgICAgICdubF9OTCc6ICdubCcsXHJcbiAgICAgICAgICAgICdlbic6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VSyc6ICdlbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC5mYWxsYmFja0xhbmd1YWdlKCdubCcpXHJcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcclxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwKSB7XHJcblxyXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cclxuICAgICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xyXG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXHJcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuXHJcbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcclxuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgem9vbTogMTUsXHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcclxuICAgICAgICAkc2NvcGUubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxyXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxhdExuZ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEaXQgaXMgZWVuIG1lbGRpbmchXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3Blbigkc2NvcGUubWFwLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCwgSXNzdWVzRmFjdG9yeSwgUm91dGVzV2Fsa2VkRmFjdG9yeSkge1xyXG5cclxuICAgIHZhciBpc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xyXG4gICAgdmFyIHJvdXRlc1dhbGtlZCA9IFJvdXRlc1dhbGtlZEZhY3RvcnkuZ2V0Um91dGVzV2Fsa2VkKCk7XHJcbiAgICB2YXIgZ3BzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgdmFyIHRpbWVyID0gdW5kZWZpbmVkO1xyXG4gICAgdmFyIHJvdXRlV2Fsa2VkID0gW107XHJcbiAgICB2YXIgZGlyU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xyXG5cclxuICAgIHZhciB0ZXN0ID0gdHJ1ZTtcclxuICAgIHZhciB0ZXN0TGF0O1xyXG4gICAgdmFyIHRlc3RMbmc7XHJcblxyXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXHJcbiAgICB9O1xyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgZ3BzRW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgdGVzdExhdCA9IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZTtcclxuICAgICAgICB0ZXN0TG5nID0gcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZTtcclxuICAgICAgICBzaG93TWFwKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcbiAgICB9LCBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xyXG4gICAgICAgIGdwc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGVzdExhdCA9IDUxLjY4ODQyMDtcclxuICAgICAgICB0ZXN0TG5nID0gNS4yODczOTI7XHJcbiAgICAgICAgc2hvd01hcCg1MS42ODg0MjAsIDUuMjg3MzkyKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG5cclxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xyXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiAxMixcclxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNYXAgZWxlbWVudFxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAkc2NvcGUuaGlkZVNwaW5uZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjb29yZGluYXRlcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoaXNzdWVzW2ldLmxhdGl0dWRlLCBpc3N1ZXNbaV0ubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gICAnPGltZyBzcmM9XCInICsgaXNzdWVzW2ldLmZvdG8gKyAnXCIgd2lkdGg9XCIxMDBcIi8+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj4nICsgaXNzdWVzW2ldLnRvZWxpY2h0aW5nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPjxhIGhyZWY9XCIvIy9hcHAvaXNzdWVzLycgKyBpc3N1ZXNbaV0uaWQgKyAnXCI+TWVsZGluZzwvYT4gJ1xyXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCdjbGljaycsIChmdW5jdGlvbihtYXJrZXIsY29udGVudCxpbmZvV2luZG93KXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChjb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCxtYXJrZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KShtYXJrZXIsY29udGVudCxpbmZvV2luZG93KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoJHNjb3BlLm1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsYXRMbmc6ICcgKyBldmVudC5sYXRMbmcubGF0KCkgKyAnLCAnICsgZXZlbnQubGF0TG5nLmxuZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGVzdExhdCA9IGV2ZW50LmxhdExuZy5sYXQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0ZXN0TG5nID0gZXZlbnQubGF0TG5nLmxuZygpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vQWRkIHJvdXRlcyB3YWxrZWRcclxuICAgICAgICAgICAgZm9yKHZhciBqID0gMDsgaiA8IHJvdXRlc1dhbGtlZC5sZW5ndGg7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgcm91dGVzV2Fsa2VkW2pdLndheXBvaW50cy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaSA+IDApe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhyb3V0ZXNXYWxrZWRbal0ud2F5cG9pbnRzW2ktMV0ubGF0aXR1ZGUsIHJvdXRlc1dhbGtlZFtqXS53YXlwb2ludHNbaS0xXS5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdGluYXRpb24gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHJvdXRlc1dhbGtlZFtqXS53YXlwb2ludHNbaV0ubGF0aXR1ZGUsIHJvdXRlc1dhbGtlZFtqXS53YXlwb2ludHNbaV0ubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVuZGVyUm91dGUob3JpZ2luLCBkZXN0aW5hdGlvbiwgJ2dyZWVuJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgICRzY29wZS53YWxrUm91dGUgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGlmKHR5cGVvZiB0aW1lciA9PSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgIGlmKGdwc0VuYWJsZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIHRpbWVyID09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhcnQgcm91dGUnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IHNldEludGVydmFsKHVwZGF0ZVJvdXRlLCAzMDAwKTtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWJ1dHRvblwiKS5pbm5lckhUTUwgPSBcIlN0b3Agcm91dGVcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgIHZhciBwb3B1cCA9ICRpb25pY1BvcHVwLmNvbmZpcm0oe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiUm91dGUgc3RvcHBlblwiLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwiV2lsdCB1IGRlemUgcm91dGUgb3BzbGFhbj9cIlxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcG9wdXAudGhlbihmdW5jdGlvbiAocmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZihyZXMpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlbmQgcm91dGUnKTtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lciA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvdXRlLWJ1dHRvblwiKS5pbm5lckhUTUwgPSBcIlN0YXJ0IHJvdXRlXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlc1dhbGtlZC5wdXNoKHJvdXRlV2Fsa2VkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlUm91dGUoKXtcclxuICAgICAgICBpZih0ZXN0KXtcclxuICAgICAgICAgICAgaWYocm91dGVXYWxrZWQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBpZihtZWFzdXJlKHJvdXRlV2Fsa2VkW3JvdXRlV2Fsa2VkLmxlbmd0aC0xXS5sYXQoKSwgcm91dGVXYWxrZWRbcm91dGVXYWxrZWQubGVuZ3RoLTFdLmxuZygpLCB0ZXN0TGF0LCB0ZXN0TG5nKSA+IDIwKXtcclxuICAgICAgICAgICAgICAgICAgICByb3V0ZVdhbGtlZC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHRlc3RMYXQsIHRlc3RMbmcpXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgcm91dGVXYWxrZWQucHVzaChcclxuICAgICAgICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHRlc3RMYXQsIHRlc3RMbmcpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHRlc3RMYXQsIHRlc3RMbmcpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5zZXRDZW50ZXIocG9zKTtcclxuXHJcbiAgICAgICAgICAgIC8vdXBkYXRlIHJvdXRlXHJcbiAgICAgICAgICAgIGlmKHJvdXRlV2Fsa2VkLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUm91dGUocm91dGVXYWxrZWRbcm91dGVXYWxrZWQubGVuZ3RoLTJdLCByb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMV0sICdibHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocm91dGVXYWxrZWQpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgICAgIGlmKHJvdXRlV2Fsa2VkLmxlbmd0aCA+IDApe1xyXG4gICAgICAgICAgICAgICAgaWYobWVhc3VyZShyb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMV0ubGF0KCksIHJvdXRlV2Fsa2VkW3JvdXRlV2Fsa2VkLmxlbmd0aC0xXS5sbmcoKSwgcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKSA+IDIwKXtcclxuICAgICAgICAgICAgICAgICAgICByb3V0ZVdhbGtlZC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSlcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICByb3V0ZVdhbGtlZC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcG9zID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm1hcC5zZXRDZW50ZXIocG9zKTtcclxuXHJcbiAgICAgICAgICAgIC8vdXBkYXRlIHJvdXRlXHJcbiAgICAgICAgICAgIGlmKHJvdXRlV2Fsa2VkLmxlbmd0aCA+IDEpe1xyXG4gICAgICAgICAgICAgICAgcmVuZGVyUm91dGUocm91dGVXYWxrZWRbcm91dGVXYWxrZWQubGVuZ3RoLTJdLCByb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMV0sICdibHVlJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc29sZS5sb2cocm91dGVXYWxrZWQpO1xyXG5cclxuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICAgICAgZ3BzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG1lYXN1cmUobGF0MSwgbG9uMSwgbGF0MiwgbG9uMil7XHJcbiAgICAgICAgdmFyIFIgPSA2Mzc4LjEzNzsgLy8gUmFkaXVzIG9mIGVhcnRoIGluIEtNXHJcbiAgICAgICAgdmFyIGRMYXQgPSBsYXQyICogTWF0aC5QSSAvIDE4MCAtIGxhdDEgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgIHZhciBkTG9uID0gbG9uMiAqIE1hdGguUEkgLyAxODAgLSBsb24xICogTWF0aC5QSSAvIDE4MDtcclxuICAgICAgICB2YXIgYSA9IE1hdGguc2luKGRMYXQvMikgKiBNYXRoLnNpbihkTGF0LzIpICtcclxuICAgICAgICAgICAgTWF0aC5jb3MobGF0MSAqIE1hdGguUEkgLyAxODApICogTWF0aC5jb3MobGF0MiAqIE1hdGguUEkgLyAxODApICpcclxuICAgICAgICAgICAgTWF0aC5zaW4oZExvbi8yKSAqIE1hdGguc2luKGRMb24vMik7XHJcbiAgICAgICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxLWEpKTtcclxuICAgICAgICB2YXIgZCA9IFIgKiBjO1xyXG4gICAgICAgIHJldHVybiBkICogMTAwMDsgLy8gbWV0ZXJzXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gcmVuZGVyUm91dGUob3JpZ2luLCBkZXN0aW5hdGlvbiwgY29sb3Ipe1xyXG4gICAgICAgIGlmKHR5cGVvZiBjb2xvciA9PSAndW5kZWZpbmVkJyl7IGNvbG9yID0gJ2dyZWVuJzsgfVxyXG5cclxuICAgICAgICB2YXIgcG9seWxpbmVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICBzdHJva2VDb2xvcjogY29sb3IsXHJcbiAgICAgICAgICAgIHN0cm9rZU9wYWNpdHk6IDEsXHJcbiAgICAgICAgICAgIHN0cm9rZVdlaWdodDogNFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xyXG4gICAgICAgICAgICBvcmlnaW46IG9yaWdpbixcclxuICAgICAgICAgICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uLFxyXG4gICAgICAgICAgICB0cmF2ZWxNb2RlOiBnb29nbGUubWFwcy5UcmF2ZWxNb2RlLldBTEtJTkdcclxuICAgICAgICB9O1xyXG4gICAgICAgIGRpclNlcnZpY2Uucm91dGUocmVxdWVzdCwgZnVuY3Rpb24ocmVzcG9uc2UsIHN0YXR1cyl7XHJcbiAgICAgICAgICAgIGlmKHN0YXR1cyA9PSBnb29nbGUubWFwcy5EaXJlY3Rpb25zU3RhdHVzLk9LKXtcclxuICAgICAgICAgICAgICAgIHZhciBsZWdzID0gcmVzcG9uc2Uucm91dGVzWzBdLmxlZ3M7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVncy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXBzID0gbGVnc1tpXS5zdGVwcztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgc3RlcHMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5leHRTZWdtZW50ID0gc3RlcHNbal0ucGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHN0ZXBQb2x5bGluZSA9IG5ldyBnb29nbGUubWFwcy5Qb2x5bGluZShwb2x5bGluZU9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbmV4dFNlZ21lbnQubGVuZ3RoOyBrKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZXBQb2x5bGluZS5nZXRQYXRoKCkucHVzaChuZXh0U2VnbWVudFtrXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlcFBvbHlsaW5lLnNldE1hcCgkc2NvcGUubWFwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByb3V0ZXNXYWxrZWQgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB1c2VySWQ6IFwiMVwiLFxyXG4gICAgICAgICAgICByZWdpb25JZDogXCIxXCIsXHJcbiAgICAgICAgICAgIHdheXBvaW50czpbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY4ODUxMyxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjg3NDQ1XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODkyOTgsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI4Nzc1NlxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjg5NjA0LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yODY3MzFcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY5MDk1MyxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjg3MTk1XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgdXNlcklkOiBcIjJcIixcclxuICAgICAgICAgICAgcmVnaW9uSWQ6IFwiMVwiLFxyXG4gICAgICAgICAgICB3YXlwb2ludHM6W1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODYxNDQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI4OTczNVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjg1OTQ0LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yOTA4MDhcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY4ODQxOCxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjkxODI3XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODg1OTEsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI5MDgwOFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjg5MjQ5LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yOTEwMDFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Um91dGVzV2Fsa2VkKCkge1xyXG4gICAgICAgIHJldHVybiByb3V0ZXNXYWxrZWQ7XHJcblxyXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKHJvdXRlc1dhbGtlZCkge1xyXG4gICAgICAgICByZXR1cm4gcm91dGVzV2Fsa2VkO1xyXG4gICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0Um91dGVzV2Fsa2VkOiBnZXRSb3V0ZXNXYWxrZWRcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBtYXBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYXAnLCBbXSk7XHJcblxyXG5tYXBNb2R1bGUuY29udHJvbGxlcihcIklzc3VlTWFwQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5tYXAuY29udHJvbGxlci5qc1wiKSk7XHJcbm1hcE1vZHVsZS5jb250cm9sbGVyKCdNYXBDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9tYXAuY29udHJvbGxlci5qcycpKTtcclxubWFwTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuLy4uL2lzc3Vlcy9mYWN0b3JpZXMvaXNzdWVzLmZhY3RvcnkuanNcIikpO1xyXG5tYXBNb2R1bGUuZmFjdG9yeShcIlJvdXRlc1dhbGtlZEZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL3JvdXRlc1dhbGtlZC5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbm1hcE1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFwLnJvdXRlcy5qc1wiKSk7XHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL21hcCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL21hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFwQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSkge1xyXG5cclxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xyXG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmd1YWdlKTtcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XHJcblxyXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAkc3RhdGVQcm92aWRlclxyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XHJcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ3NldHRpbmdzJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuIl19
