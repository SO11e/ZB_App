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
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
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
  }

  function getReport(reportId) {
    for(var i = 0; i < reports.length; i++) {
      if (reports[i].id === parseInt(reportId)) {
        return reports[i];
      }
    }
    return null;
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

        .state('app.report-add', {
            url: '/report/add',
            views: {
                'report-add': {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4udHJhbnNsYXRpb24uanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2NvbnRyb2xsZXJzL3JlcG9ydC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluL21haW4ubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbScsIFtcbiAgICAgICAgJ2lvbmljJyxcbiAgICAgICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxuICAgICAgICAnem9ubmVibG9lbS5tYWluJyxcbiAgICAgICAgJ3pvbm5lYmxvZW0ucmVwb3J0cycsXG4gICAgICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xuICAgIF0pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKGZhbHNlKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBtYWluTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcCcsIHtcbiAgICAgICAgICAgIHVybDogJy9hcHAnLFxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ21haW4uaHRtbCdcbiAgICAgICAgfSk7XG5cbiAgICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvYXBwL3JlcG9ydHMnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcblxuICAgICR0cmFuc2xhdGVQcm92aWRlclxuICAgICAgICAudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXG4gICAgICAgIH0pXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxuICAgICAgICAgICAgJ25sX05MJzogJ25sJyxcbiAgICAgICAgICAgICdlbic6ICdlbicsXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxuICAgICAgICAgICAgJ2VuX1VLJzogJ2VuJ1xuICAgICAgICB9KVxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmZhbGxiYWNrTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcbiAgICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlUGFyYW1ldGVycycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlUGFyYW1zLCBSZXBvcnRzRmFjdG9yeSkge1xuXG4gICRzY29wZS5yZXBvcnQgPSBSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKTtcblxuICAkc2NvcGUuYWRkUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnNob3dQaG90byA9IHRydWU7XG4gIH07XG5cbiAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcbiAgfTtcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgUmVwb3J0c0ZhY3RvcnkpIHtcblxuICAkc2NvcGUucmVwb3J0cyA9IFJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKTtcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcmVwb3J0cyA9IFtcbiAgICB7XG4gICAgICBpZDogMCxcbiAgICAgIHN0cmFhdDogXCJab3JndmxpZXRzdHJhYXRcIixcbiAgICAgIGh1aXNudW1tZXI6IDQ5MSxcbiAgICAgIHBvc3Rjb2RlOiBcIjQ4MzQgTkhcIixcbiAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgdG9lbGljaHRpbmc6IFwiVGUgaG9nZSBzdG9lcHJhbmRcIixcbiAgICAgIGZvdG86IFwiaW1nL2xvY2F0aWUucG5nXCIsXG4gICAgICBkYXR1bV9nZW1lbGQ6IFwiMjAxNy0wMi0yMFwiLFxuICAgICAgZGF0dW1fb3BnZWxvc3Q6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIGlkOiAxLFxuICAgICAgc3RyYWF0OiBcIkNoYXNzZXZlbGRcIixcbiAgICAgIGh1aXNudW1tZXI6IG51bGwsXG4gICAgICBwb3N0Y29kZTogXCI0ODExIERIXCIsXG4gICAgICBwbGFhdHM6IFwiQnJlZGFcIixcbiAgICAgIHRvZWxpY2h0aW5nOiBcIkhlayBvcCBkZSBzdG9lcFwiLFxuICAgICAgZm90bzogXCJpbWcvY2hhc3NldmVsZC5wbmdcIixcbiAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAxLTA0XCIsXG4gICAgICBkYXR1bV9vcGdlbG9zdDogXCIyMDE3LTAyLTE1XCJcbiAgICB9XG4gIF07XG5cbiAgZnVuY3Rpb24gZ2V0UmVwb3J0cygpIHtcbiAgICByZXR1cm4gcmVwb3J0cztcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFJlcG9ydChyZXBvcnRJZCkge1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCByZXBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVwb3J0c1tpXS5pZCA9PT0gcGFyc2VJbnQocmVwb3J0SWQpKSB7XG4gICAgICAgIHJldHVybiByZXBvcnRzW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZ2V0UmVwb3J0czogZ2V0UmVwb3J0cyxcbiAgICBnZXRSZXBvcnQ6IGdldFJlcG9ydFxuICB9O1xufTtcbiIsInZhciByZXBvcnRzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ucmVwb3J0cycsIFtdKTtcblxucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0c0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvcmVwb3J0cy5jb250cm9sbGVyXCIpKTtcbnJlcG9ydHNNb2R1bGUuY29udHJvbGxlcihcIlJlcG9ydENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvcmVwb3J0LmNvbnRyb2xsZXJcIikpO1xuXG5yZXBvcnRzTW9kdWxlLmZhY3RvcnkoXCJSZXBvcnRzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvcmVwb3J0cy5mYWN0b3J5XCIpKTtcblxucmVwb3J0c01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vcmVwb3J0cy5yb3V0ZXNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcG9ydHNNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzJywge1xuICAgICAgICAgICAgdXJsOiAnL3JlcG9ydHMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAncmVwb3J0cyc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRzQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0cy5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnLzpyZXBvcnRJZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnRzQGFwcCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3JlcG9ydHMvdGVtcGxhdGVzL3JlcG9ydHMuZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydC1hZGQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvcmVwb3J0L2FkZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnQtYWRkJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5hZGQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXBvcnRDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdHJhbnNsYXRlKSB7XG5cbiAgICAkc2NvcGUuc3dpdGNoTGFuZ3VhZ2UgPSBmdW5jdGlvbiAobGFuZ3VhZ2UpIHtcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xuICAgIH07XG5cbn07XG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcblxuc2V0dGluZ3NNb2R1bGUuY29udHJvbGxlcihcIlNldHRpbmdzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyXCIpKTtcblxuLy8gc2V0dGluZ3NNb2R1bGUuZmFjdG9yeShcIlNldHRpbmdzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvc2V0dGluZ3MuZmFjdG9yeVwiKSk7XG5cbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzTW9kdWxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnc2V0dGluZ3MnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3NDb250cm9sbGVyJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59O1xuIl19
