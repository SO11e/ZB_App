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
module.exports = function ($scope, $stateParams, ReportsFactory) {

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
var reportsModule = angular.module('zonnebloem.reports', []);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4udHJhbnNsYXRpb24uanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2NvbnRyb2xsZXJzL3JlcG9ydC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3JlcG9ydHMvcmVwb3J0cy5tb2R1bGUnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXG4gICAgICAgICdpb25pYycsXG4gICAgICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcbiAgICAgICAgJ3pvbm5lYmxvZW0ubWFpbicsXG4gICAgICAgICd6b25uZWJsb2VtLnJlcG9ydHMnLFxuICAgICAgICAnem9ubmVibG9lbS5zZXR0aW5ncydcbiAgICBdKVxuXG4ucnVuKGZ1bmN0aW9uKCRpb25pY1BsYXRmb3JtKSB7XG4gICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAvLyBmb3IgZm9ybSBpbnB1dHMpXG4gICAgaWYgKHdpbmRvdy5jb3Jkb3ZhICYmIHdpbmRvdy5jb3Jkb3ZhLnBsdWdpbnMgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucy5LZXlib2FyZCkge1xuICAgICAgY29yZG92YS5wbHVnaW5zLktleWJvYXJkLmhpZGVLZXlib2FyZEFjY2Vzc29yeUJhcihmYWxzZSk7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbCh0cnVlKTtcblxuICAgIH1cbiAgICBpZiAod2luZG93LlN0YXR1c0Jhcikge1xuICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21haW4uaHRtbCdcbiAgICAgICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL3JlcG9ydHMnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcblxuICAgICR0cmFuc2xhdGVQcm92aWRlclxuICAgICAgICAudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXG4gICAgICAgIH0pXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxuICAgICAgICAgICAgJ25sX05MJzogJ25sJyxcbiAgICAgICAgICAgICdlbic6ICdlbicsXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxuICAgICAgICAgICAgJ2VuX1VLJzogJ2VuJ1xuICAgICAgICB9KVxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmZhbGxiYWNrTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcbiAgICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlUGFyYW1ldGVycycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBSZXBvcnRzRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLnJlcG9ydCA9IFJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpO1xuXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcbiAgICAgICAgJHNjb3BlLnJlcG9ydCA9IHJlcG9ydDtcbiAgICB9KTsqL1xuXG4gICAgJHNjb3BlLmFkZFBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XG4gICAgfTtcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgUmVwb3J0c0ZhY3RvcnkpIHtcblxuICAkc2NvcGUucmVwb3J0cyA9IFJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKTtcblxuICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKS50aGVuKGZ1bmN0aW9uIChyZXBvcnRzKSB7XG4gICAgICAkc2NvcGUucmVwb3J0cyA9IHJlcG9ydHM7XG4gIH0pKi9cblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXBvcnRzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBpZDogMCxcbiAgICAgICAgICAgIHN0cmFhdDogXCJab3JndmxpZXRzdHJhYXRcIixcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IDQ5MSxcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MzQgTkhcIixcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiVGUgaG9nZSBzdG9lcHJhbmRcIixcbiAgICAgICAgICAgIGZvdG86IFwiaW1nL2xvY2F0aWUucG5nXCIsXG4gICAgICAgICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMi0yMFwiLFxuICAgICAgICAgICAgZGF0dW1fb3BnZWxvc3Q6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICBzdHJhYXQ6IFwiQ2hhc3NldmVsZFwiLFxuICAgICAgICAgICAgaHVpc251bW1lcjogbnVsbCxcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDEtMDRcIixcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIlxuICAgICAgICB9XG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGdldFJlcG9ydHMoKSB7XG4gICAgICAgIHJldHVybiByZXBvcnRzO1xuXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydHMpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBvcnRzO1xuICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFJlcG9ydChyZXBvcnRJZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChyZXBvcnRzW2ldLmlkID09PSBwYXJzZUludChyZXBvcnRJZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwb3J0c1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XG4gICAgICAgIH0pOyovXG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0UmVwb3J0czogZ2V0UmVwb3J0cyxcbiAgICAgICAgZ2V0UmVwb3J0OiBnZXRSZXBvcnRcbiAgICB9O1xufTtcbiIsInZhciByZXBvcnRzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ucmVwb3J0cycsIFtdKTtcblxucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0c0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvcmVwb3J0cy5jb250cm9sbGVyXCIpKTtcbnJlcG9ydHNNb2R1bGUuY29udHJvbGxlcihcIlJlcG9ydENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvcmVwb3J0LmNvbnRyb2xsZXJcIikpO1xuXG5yZXBvcnRzTW9kdWxlLmZhY3RvcnkoXCJSZXBvcnRzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvcmVwb3J0cy5mYWN0b3J5XCIpKTtcblxucmVwb3J0c01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vcmVwb3J0cy5yb3V0ZXNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcG9ydHNNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xuICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAncmVwb3J0cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnLzpyZXBvcnRJZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnRzQGFwcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMuYWRkJywge1xuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnRzQGFwcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuYWRkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSkge1xuXG4gICAgJHNjb3BlLnN3aXRjaExhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlKSB7XG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmd1YWdlKTtcbiAgICB9O1xuXG59O1xuIiwidmFyIHNldHRpbmdzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uc2V0dGluZ3MnLCBbXSk7XG5cbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XG5cbi8vIHNldHRpbmdzTW9kdWxlLmZhY3RvcnkoXCJTZXR0aW5nc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL3NldHRpbmdzLmZhY3RvcnlcIikpO1xuXG5zZXR0aW5nc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vc2V0dGluZ3Mucm91dGVzXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XG4gICAgICB1cmw6ICcvc2V0dGluZ3MnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ3NldHRpbmdzJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9zZXR0aW5ncy90ZW1wbGF0ZXMvc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ29udHJvbGxlcidcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufTtcbiJdfQ==
