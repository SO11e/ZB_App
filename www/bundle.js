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

},{"./components/issues/issues.module.js":5,"./components/main/main.module":7,"./components/map/map.module":11,"./components/settings/settings.module":13}],2:[function(require,module,exports){
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
            datum_opgelost: null
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
            datum_opgelost: "2017-02-15"
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
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));

module.exports = mapModule;
},{"./controllers/issue.map.controller.js":10}],12:[function(require,module,exports){
module.exports = function ($scope, $translate) {

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],13:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":12,"./settings.routes":14}],14:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3Mucm91dGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9tYXAvbWFwLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL2lzc3Vlcy9pc3N1ZXMubW9kdWxlLmpzJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtJywgW1xuICAgICdpb25pYycsXG4gICAgJ25nQ29yZG92YScsXG4gICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxuICAgICd6b25uZWJsb2VtLm1haW4nLFxuICAgICd6b25uZWJsb2VtLm1hcCcsXG4gICAgJ3pvbm5lYmxvZW0uaXNzdWVzJyxcbiAgICAnem9ubmVibG9lbS5zZXR0aW5ncydcbl0pXG5cbiAgICAucnVuKGZ1bmN0aW9uICgkaW9uaWNQbGF0Zm9ybSkge1xuICAgICAgICAkaW9uaWNQbGF0Zm9ybS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXG4gICAgICAgICAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgICAgICAgICBpZiAod2luZG93LktleWJvYXJkKSB7XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuaGlkZUZvcm1BY2Nlc3NvcnlCYXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuc2hyaW5rVmlldyh0cnVlKTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5kaXNhYmxlU2Nyb2xsaW5nSW5TaHJpbmtWaWV3KHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIElzc3Vlc0ZhY3RvcnkpIHtcblxuICAgICRzY29wZS5pc3N1ZSA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWUoJHN0YXRlUGFyYW1zLmlzc3VlSWQpO1xuXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcbiAgICAgICAgJHNjb3BlLnJlcG9ydCA9IHJlcG9ydDtcbiAgICB9KTsqL1xuXG4gICAgJHNjb3BlLmFkZFBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIElzc3Vlc0ZhY3RvcnkpIHtcblxuICAkc2NvcGUuaXNzdWVzID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZXMoKTtcblxuICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcbiAgICAgICRzY29wZS5pc3N1ZXMgPSBpc3N1ZXM7XG4gIH0pKi9cblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc3N1ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgc3RyYWF0OiBcIlpvcmd2bGlldHN0cmFhdFwiLFxuICAgICAgICAgICAgaHVpc251bW1lcjogNDkxLFxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXG4gICAgICAgICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxuICAgICAgICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcbiAgICAgICAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAyLTIwXCIsXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZDogMSxcbiAgICAgICAgICAgIHN0cmFhdDogXCJDaGFzc2V2ZWxkXCIsXG4gICAgICAgICAgICBodWlzbnVtbWVyOiBudWxsLFxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgxMSBESFwiLFxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXG4gICAgICAgICAgICB0b2VsaWNodGluZzogXCJIZWsgb3AgZGUgc3RvZXBcIixcbiAgICAgICAgICAgIGZvdG86IFwiaW1nL2NoYXNzZXZlbGQucG5nXCIsXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMS0wNFwiLFxuICAgICAgICAgICAgZGF0dW1fb3BnZWxvc3Q6IFwiMjAxNy0wMi0xNVwiXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gaXNzdWVzO1xuXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcbiAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJc3N1ZShpc3N1ZUlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc3N1ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0O1xuICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWVcbiAgICB9O1xufTtcbiIsInZhciBpc3N1ZXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5pc3N1ZXMnLCBbXSk7XG5cbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5jb250cm9sbGVyLmpzXCIpKTtcblxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XG5cbmlzc3Vlc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vaXNzdWVzLnJvdXRlcy5qc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNzdWVzTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xuICAgICAgICAgICAgdXJsOiAnL2lzc3VlcycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3Vlc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5hZGQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ21hcEBhcHAuaXNzdWVzLmFkZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvaXNzdWUubWFwLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZUNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnLzppc3N1ZUlkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59O1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21haW4uaHRtbCdcbiAgICAgICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL2lzc3VlcycpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XG4gICAgICAgICAgICBwcmVmaXg6ICdsb2NhbGVzLycsXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcbiAgICAgICAgfSlcbiAgICAgICAgLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnbmwnLCAnZW4nXSwge1xuICAgICAgICAgICAgJ25sJyA6ICdubCcsXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxuICAgICAgICAgICAgJ2VuJzogJ2VuJyxcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXG4gICAgICAgIH0pXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKVxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkY29yZG92YUdlb2xvY2F0aW9uLCAkaW9uaWNQb3B1cCkge1xuXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxuICAgICAgICBjb21wb25lbnRSZXN0cmljdGlvbnM6IHtjb3VudHJ5OiBcInVzXCJ9XG4gICAgfTtcblxuICAgIC8vIFNldHMgbWFwIHRvIGN1cnJlbnQgbG9jYXRpb25cbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAnR2VlbiBsb2NhdGllJyxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xuICAgICAgICB9KTtcblxuICAgICAgICBzaG93TWFwKDUxLjcyNTEyLCA1LjMwMzIzKTtcbiAgICB9KTtcblxuXG4gICAgZnVuY3Rpb24gc2hvd01hcChsYXQsIGxuZykge1xuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XG5cbiAgICAgICAgLy8gTWFwIG9wdGlvbnNcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XG4gICAgICAgICAgICB6b29tOiAxNSxcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcblxuICAgICAgICAvLyBHb29nbGUgTWFwc1xuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXG4gICAgICAgIC8vIFNldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XG5cbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICBtYXA6ICRzY29wZS5tYXAsXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG4gICAgICAgICAgICAgICAgY29udGVudDogXCJEaXQgaXMgZWVuIG1lbGRpbmchXCJcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4oJHNjb3BlLm1hcCwgbWFya2VyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH0pO1xuICAgIH1cbn07IiwidmFyIG1hcE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1hcCcsIFtdKTtcblxubWFwTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZU1hcENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUubWFwLmNvbnRyb2xsZXIuanNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1hcE1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICR0cmFuc2xhdGUpIHtcblxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xuICAgICAgICAkdHJhbnNsYXRlLnVzZShsYW5ndWFnZSk7XG4gICAgfTtcblxufTtcbiIsInZhciBzZXR0aW5nc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLnNldHRpbmdzJywgW10pO1xuXG5zZXR0aW5nc01vZHVsZS5jb250cm9sbGVyKFwiU2V0dGluZ3NDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXJcIikpO1xuXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcblxuc2V0dGluZ3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3NldHRpbmdzLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLnNldHRpbmdzJywge1xuICAgICAgdXJsOiAnL3NldHRpbmdzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvc2V0dGluZ3MvdGVtcGxhdGVzL3NldHRpbmdzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn07XG4iXX0=
