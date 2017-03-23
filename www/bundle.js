(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./components/main/main.module');
require('./components/reports/reports.module');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
        'ionic',
        'pascalprecht.translate',
        'zonnebloem.main',
        'zonnebloem.reports',
        'zonnebloem.settings'
    ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      StatusBar.styleLightContent();
    }
  });
});

},{"./components/main/main.module":2,"./components/reports/reports.module":8,"./components/settings/settings.module":11}],2:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;
},{"./main.routes":3,"./main.translation":4}],3:[function(require,module,exports){
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'main.html'
        });

    $urlRouterProvider.otherwise('/app/reports');
};

},{}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
module.exports = function ($scope, $state, $stateParams, ReportsFactory, $cordovaGeolocation, $ionicPopup, $timeout) {

    $scope.report = ReportsFactory.getReport($stateParams.reportId);

    /*ReportsFactory.getReport($stateParams.reportId).then(function (report) {
        $scope.report = report;
    });*/

    $scope.addPhoto = function () {
        $scope.showPhoto = true;
    };

    $scope.removePhoto = function () {
        $scope.showPhoto = false;
    };


    // Google Maps
    var options = {timeout: 10000, enableHighAccuracy: true};

    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);





    }, function(error){
        // Show Could not get location alert dialog
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
        });
        $timeout(function() {
            alertPopup.close(); //close the popup after 3 seconds
        }, 3000);

        console.log("Kan locatie niet ophalen");

        var latLng = new google.maps.LatLng(51.72512, 5.30323);

        var mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);


        // Google Maps
        //Wait until the map is loaded
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                position: latLng
            });

        });

        // Google Maps
        //Wait until the map is loaded
        //Sets a popup window when the user taps a marker
        google.maps.event.addListenerOnce($scope.map, 'idle', function(){

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



    });






};

},{}],6:[function(require,module,exports){
module.exports = function ($scope, ReportsFactory) {

  $scope.reports = ReportsFactory.getReports();

  /*ReportsFactory.getReports().then(function (reports) {
      $scope.reports = reports;
  })*/

};

},{}],7:[function(require,module,exports){
module.exports = function () {
    var reports = [
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

    function getReports() {
        return reports;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (reports) {
            return reports;
        });*/
    }

    function getReport(reportId) {
        for (var i = 0; i < reports.length; i++) {
            if (reports[i].id === parseInt(reportId)) {
                return reports[i];
            }
        }
        return null;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (report) {
            return report;
        });*/
    }

    return {
        getReports: getReports,
        getReport: getReport
    };
};

},{}],8:[function(require,module,exports){
var reportsModule = angular.module('zonnebloem.reports', ['ionic', 'ngCordova']);

reportsModule.controller("ReportsController", require("./controllers/reports.controller"));
reportsModule.controller("ReportController", require("./controllers/report.controller"));

reportsModule.factory("ReportsFactory", require("./factories/reports.factory"));

reportsModule.config(require("./reports.routes"));

module.exports = reportsModule;
},{"./controllers/report.controller":5,"./controllers/reports.controller":6,"./factories/reports.factory":7,"./reports.routes":9}],9:[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.reports', {
            url: '/reports',
            views: {
                'reports': {
                    templateUrl: 'components/reports/templates/reports.html',
                    controller: 'ReportsController'
                }
            }
        })

        .state('app.reports.details', {
            url: '/:reportId',
            views: {
                'reports@app': {
                    templateUrl: 'components/reports/templates/reports.details.html',
                    controller: 'ReportController'
                }
            }
        })

        .state('app.reports.add', {
            url: '/add',
            views: {
                'reports@app': {
                    templateUrl: 'components/reports/templates/reports.add.html',
                    controller: 'ReportController'
                }
            }
        });
};

},{}],10:[function(require,module,exports){
module.exports = function ($scope, $translate) {

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],11:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":10,"./settings.routes":12}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4udHJhbnNsYXRpb24uanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2NvbnRyb2xsZXJzL3JlcG9ydC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3JlcG9ydHMvcmVwb3J0cy5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXHJcbiAgICAgICAgJ2lvbmljJyxcclxuICAgICAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXHJcbiAgICAgICAgJ3pvbm5lYmxvZW0ubWFpbicsXHJcbiAgICAgICAgJ3pvbm5lYmxvZW0ucmVwb3J0cycsXHJcbiAgICAgICAgJ3pvbm5lYmxvZW0uc2V0dGluZ3MnXHJcbiAgICBdKVxyXG5cclxuLnJ1bihmdW5jdGlvbigkaW9uaWNQbGF0Zm9ybSkge1xyXG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxyXG4gICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxyXG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xyXG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKGZhbHNlKTtcclxuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmRpc2FibGVTY3JvbGwodHJ1ZSk7XHJcblxyXG4gICAgfVxyXG4gICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0pO1xyXG4iLCJ2YXIgbWFpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1haW4nLCBbXSk7XHJcblxyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XHJcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxyXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9yZXBvcnRzJyk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xyXG5cclxuICAgICR0cmFuc2xhdGVQcm92aWRlclxyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ2xvY2FsZXMvJyxcclxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucmVnaXN0ZXJBdmFpbGFibGVMYW5ndWFnZUtleXMoWydubCcsICdlbiddLCB7XHJcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxyXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxyXG4gICAgICAgICAgICAnZW4nOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcclxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC5kZXRlcm1pbmVQcmVmZXJyZWRMYW5ndWFnZSgpXHJcbiAgICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlUGFyYW1ldGVycycpXHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgUmVwb3J0c0ZhY3RvcnksICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwLCAkdGltZW91dCkge1xyXG5cclxuICAgICRzY29wZS5yZXBvcnQgPSBSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKTtcclxuXHJcbiAgICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xyXG4gICAgICAgICRzY29wZS5yZXBvcnQgPSByZXBvcnQ7XHJcbiAgICB9KTsqL1xyXG5cclxuICAgICRzY29wZS5hZGRQaG90byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcclxuICAgIH07XHJcblxyXG4gICAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICB2YXIgb3B0aW9ucyA9IHt0aW1lb3V0OiAxMDAwMCwgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlfTtcclxuXHJcbiAgICAvLyBTZXRzIG1hcCB0byBjdXJyZW50IGxvY2F0aW9uXHJcbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuXHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICB6b29tOiAxNSxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgYWxlcnRQb3B1cC5jbG9zZSgpOyAvL2Nsb3NlIHRoZSBwb3B1cCBhZnRlciAzIHNlY29uZHNcclxuICAgICAgICB9LCAzMDAwKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coXCJLYW4gbG9jYXRpZSBuaWV0IG9waGFsZW5cIik7XHJcblxyXG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDUxLjcyNTEyLCA1LjMwMzIzKTtcclxuXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICB6b29tOiAxNSxcclxuICAgICAgICAgICAgbWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcblxyXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXHJcbiAgICAgICAgLy9XYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvL1dhaXQgdW50aWwgdGhlIG1hcCBpcyBsb2FkZWRcclxuICAgICAgICAvL1NldHMgYSBwb3B1cCB3aW5kb3cgd2hlbiB0aGUgdXNlciB0YXBzIGEgbWFya2VyXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkRpdCBpcyBlZW4gbWVsZGluZyFcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIH0pO1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIFJlcG9ydHNGYWN0b3J5KSB7XHJcblxyXG4gICRzY29wZS5yZXBvcnRzID0gUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpO1xyXG5cclxuICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKS50aGVuKGZ1bmN0aW9uIChyZXBvcnRzKSB7XHJcbiAgICAgICRzY29wZS5yZXBvcnRzID0gcmVwb3J0cztcclxuICB9KSovXHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciByZXBvcnRzID0gW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgaWQ6IDAsXHJcbiAgICAgICAgICAgIHN0cmFhdDogXCJab3JndmxpZXRzdHJhYXRcIixcclxuICAgICAgICAgICAgaHVpc251bW1lcjogNDkxLFxyXG4gICAgICAgICAgICBwb3N0Y29kZTogXCI0ODM0IE5IXCIsXHJcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxyXG4gICAgICAgICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxyXG4gICAgICAgICAgICBmb3RvOiBcImltZy9sb2NhdGllLnBuZ1wiLFxyXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMi0yMFwiLFxyXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogMSxcclxuICAgICAgICAgICAgc3RyYWF0OiBcIkNoYXNzZXZlbGRcIixcclxuICAgICAgICAgICAgaHVpc251bW1lcjogbnVsbCxcclxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgxMSBESFwiLFxyXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcclxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXHJcbiAgICAgICAgICAgIGZvdG86IFwiaW1nL2NoYXNzZXZlbGQucG5nXCIsXHJcbiAgICAgICAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAxLTA0XCIsXHJcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIlxyXG4gICAgICAgIH1cclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVwb3J0cygpIHtcclxuICAgICAgICByZXR1cm4gcmVwb3J0cztcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0cykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0cztcclxuICAgICAgICB9KTsqL1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlcG9ydChyZXBvcnRJZCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVwb3J0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAocmVwb3J0c1tpXS5pZCA9PT0gcGFyc2VJbnQocmVwb3J0SWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0c1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlcG9ydHM6IGdldFJlcG9ydHMsXHJcbiAgICAgICAgZ2V0UmVwb3J0OiBnZXRSZXBvcnRcclxuICAgIH07XHJcbn07XHJcbiIsInZhciByZXBvcnRzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ucmVwb3J0cycsIFsnaW9uaWMnLCAnbmdDb3Jkb3ZhJ10pO1xyXG5cclxucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0c0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvcmVwb3J0cy5jb250cm9sbGVyXCIpKTtcclxucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0Q29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9yZXBvcnQuY29udHJvbGxlclwiKSk7XHJcblxyXG5yZXBvcnRzTW9kdWxlLmZhY3RvcnkoXCJSZXBvcnRzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvcmVwb3J0cy5mYWN0b3J5XCIpKTtcclxuXHJcbnJlcG9ydHNNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3JlcG9ydHMucm91dGVzXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVwb3J0c01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvcmVwb3J0cycsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAncmVwb3J0cyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0c0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmRldGFpbHMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy86cmVwb3J0SWQnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ3JlcG9ydHNAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZXBvcnRzL3RlbXBsYXRlcy9yZXBvcnRzLmRldGFpbHMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmFkZCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAncmVwb3J0c0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSkge1xyXG5cclxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xyXG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmd1YWdlKTtcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XHJcblxyXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAkc3RhdGVQcm92aWRlclxyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XHJcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ3NldHRpbmdzJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuIl19
