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
        enableHighAccuracy: true,
        componentRestrictions: {country: "us"}
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

        showMap(51.72512, 5.30323);
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
        enableHighAccuracy: true,
        componentRestrictions: {country: "us"}
    };
    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        // showMap(position.coords.latitude, position.coords.longitude);
        showMap(51.58307, 4.7769505);
    }, function(error){
        // Show Could not get location alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
        });

        showMap(51.58307, 4.7769505);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluL21haW4ubW9kdWxlJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9tYXAvbWFwLm1vZHVsZScpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXHJcbiAgICAnaW9uaWMnLFxyXG4gICAgJ25nQ29yZG92YScsXHJcbiAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXHJcbiAgICAnem9ubmVibG9lbS5tYWluJyxcclxuICAgICd6b25uZWJsb2VtLm1hcCcsXHJcbiAgICAnem9ubmVibG9lbS5pc3N1ZXMnLFxyXG4gICAgJ3pvbm5lYmxvZW0uc2V0dGluZ3MnXHJcbl0pXHJcblxyXG4gICAgLnJ1bihmdW5jdGlvbiAoJGlvbmljUGxhdGZvcm0pIHtcclxuICAgICAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcclxuICAgICAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgICAgICAgICBpZiAod2luZG93LktleWJvYXJkKSB7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5oaWRlRm9ybUFjY2Vzc29yeUJhcih0cnVlKTtcclxuICAgICAgICAgICAgICAgIEtleWJvYXJkLnNocmlua1ZpZXcodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5kaXNhYmxlU2Nyb2xsaW5nSW5TaHJpbmtWaWV3KHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xyXG4gICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICAgJHNjb3BlLmlzc3VlID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZSgkc3RhdGVQYXJhbXMuaXNzdWVJZCk7XHJcblxyXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcclxuICAgICAgICAkc2NvcGUucmVwb3J0ID0gcmVwb3J0O1xyXG4gICAgfSk7Ki9cclxuXHJcbiAgICAkc2NvcGUuYWRkUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dQaG90byA9IHRydWU7XHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5yZW1vdmVQaG90byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XHJcbiAgICB9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIElzc3Vlc0ZhY3RvcnkpIHtcclxuXHJcbiAgJHNjb3BlLmlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcblxyXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gIH0pKi9cclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGlzc3VlcyA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIGlkOiAwLFxyXG4gICAgICAgICAgICBzdHJhYXQ6IFwiWm9yZ3ZsaWV0c3RyYWF0XCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IDQ5MSxcclxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxyXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcclxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiVGUgaG9nZSBzdG9lcHJhbmRcIixcclxuICAgICAgICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcclxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDItMjBcIixcclxuICAgICAgICAgICAgZGF0dW1fb3BnZWxvc3Q6IG51bGwsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41NzM0MzgsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC44MTI3NzNcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDEsXHJcbiAgICAgICAgICAgIHN0cmFhdDogXCJDaGFzc2V2ZWxkXCIsXHJcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IG51bGwsXHJcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcclxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXHJcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIkhlayBvcCBkZSBzdG9lcFwiLFxyXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxyXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMS0wNFwiLFxyXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogXCIyMDE3LTAyLTE1XCIsXHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41ODg4NzUsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC43ODU2NjNcclxuICAgICAgICB9XHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlcygpIHtcclxuICAgICAgICByZXR1cm4gaXNzdWVzO1xyXG5cclxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcclxuICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlKGlzc3VlSWQpIHtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzc3Vlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxyXG4gICAgICAgIGdldElzc3VlOiBnZXRJc3N1ZVxyXG4gICAgfTtcclxufTtcclxuIiwidmFyIGlzc3Vlc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLmlzc3VlcycsIFtdKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanNcIikpO1xyXG5cclxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL2lzc3Vlcy5yb3V0ZXMuanNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBpc3N1ZXNNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvaXNzdWVzJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZXNDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzLmFkZCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwQGFwcC5pc3N1ZXMuYWRkJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL2lzc3VlLm1hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvOmlzc3VlSWQnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59O1xyXG4iLCJ2YXIgbWFpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1haW4nLCBbXSk7XHJcblxyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XHJcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9pc3N1ZXMnKTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XHJcblxyXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcclxuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxyXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcclxuICAgICAgICAgICAgJ25sJyA6ICdubCcsXHJcbiAgICAgICAgICAgICdubF9OTCc6ICdubCcsXHJcbiAgICAgICAgICAgICdlbic6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXHJcbiAgICAgICAgICAgICdlbl9VSyc6ICdlbidcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC5mYWxsYmFja0xhbmd1YWdlKCdubCcpXHJcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcclxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwKSB7XHJcblxyXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxyXG4gICAgICAgIGNvbXBvbmVudFJlc3RyaWN0aW9uczoge2NvdW50cnk6IFwidXNcIn1cclxuICAgIH07XHJcblxyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc2hvd01hcCg1MS43MjUxMiwgNS4zMDMyMyk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xyXG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcclxuXHJcbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcclxuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgem9vbTogMTUsXHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcclxuICAgICAgICAkc2NvcGUubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxyXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxhdExuZ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xyXG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEaXQgaXMgZWVuIG1lbGRpbmchXCJcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3Blbigkc2NvcGUubWFwLCBtYXJrZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCwgSXNzdWVzRmFjdG9yeSkge1xyXG5cclxuICAgIHZhciBpc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xyXG5cclxuICAgIC8vIEdvb2dsZSBNYXBzIG9wdGlvbnNcclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxyXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcclxuICAgICAgICBjb21wb25lbnRSZXN0cmljdGlvbnM6IHtjb3VudHJ5OiBcInVzXCJ9XHJcbiAgICB9O1xyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgLy8gc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgICAgIHNob3dNYXAoNTEuNTgzMDcsIDQuNzc2OTUwNSk7XHJcbiAgICB9LCBmdW5jdGlvbihlcnJvcil7XHJcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xyXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzaG93TWFwKDUxLjU4MzA3LCA0Ljc3Njk1MDUpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcblxyXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDEyLFxyXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcclxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XHJcbiAgICAgICAgJHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBHb29nbGUgTWFwc1xyXG4gICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIG1hcCBpcyBsb2FkZWRcclxuICAgICAgICAvLyBTZXRzIGEgcG9wdXAgd2luZG93IHdoZW4gdGhlIHVzZXIgdGFwcyBhIG1hcmtlclxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuaGlkZVNwaW5uZXIgPSB0cnVlO1xyXG4gICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIHZhciBjb29yZGluYXRlcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoaXNzdWVzW2ldLmxhdGl0dWRlLCBpc3N1ZXNbaV0ubG9uZ2l0dWRlKTtcclxuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogY29vcmRpbmF0ZXNcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb250ZW50ID0gICAnPGltZyBzcmM9XCInICsgaXNzdWVzW2ldLmZvdG8gKyAnXCIgd2lkdGg9XCIxMDBcIi8+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj4nICsgaXNzdWVzW2ldLnRvZWxpY2h0aW5nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPjxhIGhyZWY9XCIvIy9hcHAvaXNzdWVzLycgKyBpc3N1ZXNbaV0uaWQgKyAnXCI+TWVsZGluZzwvYT4gJ1xyXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCdjbGljaycsIChmdW5jdGlvbihtYXJrZXIsY29udGVudCxpbmZvV2luZG93KXtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChjb250ZW50KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCxtYXJrZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB9KShtYXJrZXIsY29udGVudCxpbmZvV2luZG93KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoJHNjb3BlLm1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsYXRMbmc6ICcgKyBldmVudC5sYXRMbmcubGF0KCkgKyAnLCAnICsgZXZlbnQubGF0TG5nLmxuZygpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59OyIsInZhciBtYXBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYXAnLCBbXSk7XHJcblxyXG5tYXBNb2R1bGUuY29udHJvbGxlcihcIklzc3VlTWFwQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5tYXAuY29udHJvbGxlci5qc1wiKSk7XHJcbm1hcE1vZHVsZS5jb250cm9sbGVyKCdNYXBDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9tYXAuY29udHJvbGxlci5qcycpKTtcclxubWFwTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuLy4uL2lzc3Vlcy9mYWN0b3JpZXMvaXNzdWVzLmZhY3RvcnkuanNcIikpO1xyXG5cclxubWFwTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYXAucm91dGVzLmpzXCIpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBtYXBNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAubWFwJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvbWFwJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdtYXAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvbWFwLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXBDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdHJhbnNsYXRlKSB7XHJcblxyXG4gICAgJHNjb3BlLnN3aXRjaExhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlKSB7XHJcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xyXG4gICAgfTtcclxuXHJcbn07XHJcbiIsInZhciBzZXR0aW5nc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLnNldHRpbmdzJywgW10pO1xyXG5cclxuc2V0dGluZ3NNb2R1bGUuY29udHJvbGxlcihcIlNldHRpbmdzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyXCIpKTtcclxuXHJcbi8vIHNldHRpbmdzTW9kdWxlLmZhY3RvcnkoXCJTZXR0aW5nc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL3NldHRpbmdzLmZhY3RvcnlcIikpO1xyXG5cclxuc2V0dGluZ3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3NldHRpbmdzLnJvdXRlc1wiKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzTW9kdWxlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcclxuICAgICAgdXJsOiAnL3NldHRpbmdzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnc2V0dGluZ3MnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvc2V0dGluZ3MvdGVtcGxhdGVzL3NldHRpbmdzLmh0bWwnLFxyXG4gICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ29udHJvbGxlcidcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG4iXX0=
