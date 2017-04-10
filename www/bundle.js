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

},{"./components/issues/issues.module.js":5,"./components/main/main.module":7,"./components/map/map.module":12,"./components/settings/settings.module":15}],2:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;
},{"./../issues/factories/issues.factory.js":4,"./controllers/issue.map.controller.js":10,"./controllers/map.controller.js":11,"./map.routes.js":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = function ($scope, $translate) {

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],15:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":14,"./settings.routes":16}],16:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXG4gICAgJ2lvbmljJyxcbiAgICAnbmdDb3Jkb3ZhJyxcbiAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXG4gICAgJ3pvbm5lYmxvZW0ubWFpbicsXG4gICAgJ3pvbm5lYmxvZW0ubWFwJyxcbiAgICAnem9ubmVibG9lbS5pc3N1ZXMnLFxuICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xuXSlcblxuICAgIC5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtKSB7XG4gICAgICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAgICAgICAgIGlmICh3aW5kb3cuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5oaWRlRm9ybUFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5zaHJpbmtWaWV3KHRydWUpO1xuICAgICAgICAgICAgICAgIEtleWJvYXJkLmRpc2FibGVTY3JvbGxpbmdJblNocmlua1ZpZXcodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgSXNzdWVzRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLmlzc3VlID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZSgkc3RhdGVQYXJhbXMuaXNzdWVJZCk7XG5cbiAgICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xuICAgICAgICAkc2NvcGUucmVwb3J0ID0gcmVwb3J0O1xuICAgIH0pOyovXG5cbiAgICAkc2NvcGUuYWRkUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSB0cnVlO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgSXNzdWVzRmFjdG9yeSkge1xuXG4gICRzY29wZS5pc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xuXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xuICAgICAgJHNjb3BlLmlzc3VlcyA9IGlzc3VlcztcbiAgfSkqL1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzc3VlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICBzdHJhYXQ6IFwiWm9yZ3ZsaWV0c3RyYWF0XCIsXG4gICAgICAgICAgICBodWlzbnVtbWVyOiA0OTEsXG4gICAgICAgICAgICBwb3N0Y29kZTogXCI0ODM0IE5IXCIsXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIlRlIGhvZ2Ugc3RvZXByYW5kXCIsXG4gICAgICAgICAgICBmb3RvOiBcImltZy9sb2NhdGllLnBuZ1wiLFxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDItMjBcIixcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBudWxsLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjU3MzQzOCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC44MTI3NzNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICBzdHJhYXQ6IFwiQ2hhc3NldmVsZFwiLFxuICAgICAgICAgICAgaHVpc251bW1lcjogbnVsbCxcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDEtMDRcIixcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIixcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41ODg4NzUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IDQuNzg1NjYzXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gaXNzdWVzO1xuXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcbiAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJc3N1ZShpc3N1ZUlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc3N1ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0O1xuICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWVcbiAgICB9O1xufTtcbiIsInZhciBpc3N1ZXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5pc3N1ZXMnLCBbXSk7XG5cbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5jb250cm9sbGVyLmpzXCIpKTtcblxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XG5cbmlzc3Vlc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vaXNzdWVzLnJvdXRlcy5qc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNzdWVzTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xuICAgICAgICAgICAgdXJsOiAnL2lzc3VlcycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3Vlc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5hZGQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ21hcEBhcHAuaXNzdWVzLmFkZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvaXNzdWUubWFwLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZUNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnLzppc3N1ZUlkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59O1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21haW4uaHRtbCdcbiAgICAgICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2lzc3VlcycpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XG4gICAgICAgICAgICBwcmVmaXg6ICdsb2NhbGVzLycsXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcbiAgICAgICAgfSlcbiAgICAgICAgLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnbmwnLCAnZW4nXSwge1xuICAgICAgICAgICAgJ25sJyA6ICdubCcsXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxuICAgICAgICAgICAgJ2VuJzogJ2VuJyxcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXG4gICAgICAgIH0pXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKVxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCkge1xuXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgfTtcblxuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XG5cbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcblxuICAgICAgICAvLyBHb29nbGUgTWFwc1xuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEaXQgaXMgZWVuIG1lbGRpbmchXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4oJHNjb3BlLm1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCwgSXNzdWVzRmFjdG9yeSkge1xuXG4gICAgdmFyIGlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XG5cbiAgICAvLyBHb29nbGUgTWFwcyBvcHRpb25zXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICB9O1xuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XG5cbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB6b29tOiAxMixcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcblxuICAgICAgICAvLyBHb29nbGUgTWFwc1xuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRpbmF0ZXMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGlzc3Vlc1tpXS5sYXRpdHVkZSwgaXNzdWVzW2ldLmxvbmdpdHVkZSk7XG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gICAnPGltZyBzcmM9XCInICsgaXNzdWVzW2ldLmZvdG8gKyAnXCIgd2lkdGg9XCIxMDBcIi8+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+JyArIGlzc3Vlc1tpXS50b2VsaWNodGluZyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+PGEgaHJlZj1cIi8jL2FwcC9pc3N1ZXMvJyArIGlzc3Vlc1tpXS5pZCArICdcIj5NZWxkaW5nPC9hPiAnXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCdjbGljaycsIChmdW5jdGlvbihtYXJrZXIsY29udGVudCxpbmZvV2luZG93KXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGNvbnRlbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCxtYXJrZXIpO1xuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH0pKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpKTtcblxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCRzY29wZS5tYXAsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xhdExuZzogJyArIGV2ZW50LmxhdExuZy5sYXQoKSArICcsICcgKyBldmVudC5sYXRMbmcubG5nKCkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwidmFyIG1hcE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1hcCcsIFtdKTtcblxubWFwTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZU1hcENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUubWFwLmNvbnRyb2xsZXIuanNcIikpO1xubWFwTW9kdWxlLmNvbnRyb2xsZXIoJ01hcENvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzJykpO1xubWFwTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuLy4uL2lzc3Vlcy9mYWN0b3JpZXMvaXNzdWVzLmZhY3RvcnkuanNcIikpO1xuXG5tYXBNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21hcC5yb3V0ZXMuanNcIikpO1xubW9kdWxlLmV4cG9ydHMgPSBtYXBNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcC5tYXAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvbWFwJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ21hcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvbWFwLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFwQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdHJhbnNsYXRlKSB7XG5cbiAgICAkc2NvcGUuc3dpdGNoTGFuZ3VhZ2UgPSBmdW5jdGlvbiAobGFuZ3VhZ2UpIHtcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xuICAgIH07XG5cbn07XG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcblxuc2V0dGluZ3NNb2R1bGUuY29udHJvbGxlcihcIlNldHRpbmdzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyXCIpKTtcblxuLy8gc2V0dGluZ3NNb2R1bGUuZmFjdG9yeShcIlNldHRpbmdzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvc2V0dGluZ3MuZmFjdG9yeVwiKSk7XG5cbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzTW9kdWxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnc2V0dGluZ3MnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3NDb250cm9sbGVyJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59O1xuIl19
