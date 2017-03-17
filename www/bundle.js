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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4udHJhbnNsYXRpb24uanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2NvbnRyb2xsZXJzL3JlcG9ydC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluL21haW4ubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbScsIFtcbiAgICAgICAgJ2lvbmljJyxcbiAgICAgICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxuICAgICAgICAnem9ubmVibG9lbS5tYWluJyxcbiAgICAgICAgJ3pvbm5lYmxvZW0ucmVwb3J0cycsXG4gICAgICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xuICAgIF0pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKGZhbHNlKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICB9XG4gIH0pO1xufSk7XG4iLCJ2YXIgbWFpbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1haW4nLCBbXSk7XG5cbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4ucm91dGVzXCIpKTtcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5Nb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbWFpbi5odG1sJ1xuICAgICAgICB9KTtcblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvcmVwb3J0cycpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xuXG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XG4gICAgICAgICAgICBwcmVmaXg6ICdsb2NhbGVzLycsXG4gICAgICAgICAgICBzdWZmaXg6ICcuanNvbidcbiAgICAgICAgfSlcbiAgICAgICAgLnJlZ2lzdGVyQXZhaWxhYmxlTGFuZ3VhZ2VLZXlzKFsnbmwnLCAnZW4nXSwge1xuICAgICAgICAgICAgJ25sJyA6ICdubCcsXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxuICAgICAgICAgICAgJ2VuJzogJ2VuJyxcbiAgICAgICAgICAgICdlbl9VUyc6ICdlbicsXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXG4gICAgICAgIH0pXG4gICAgICAgIC5wcmVmZXJyZWRMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxuICAgICAgICAuZGV0ZXJtaW5lUHJlZmVycmVkTGFuZ3VhZ2UoKVxuICAgICAgICAudXNlU2FuaXRpemVWYWx1ZVN0cmF0ZWd5KCdlc2NhcGVQYXJhbWV0ZXJzJylcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlcG9ydHNGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLnJlcG9ydCA9IFJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpO1xuXG4gICRzY29wZS5hZGRQaG90byA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcbiAgfTtcblxuICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnNob3dQaG90byA9IGZhbHNlO1xuICB9O1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCBSZXBvcnRzRmFjdG9yeSkge1xuXG4gICRzY29wZS5yZXBvcnRzID0gUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZXBvcnRzID0gW1xuICAgIHtcbiAgICAgIGlkOiAwLFxuICAgICAgc3RyYWF0OiBcIlpvcmd2bGlldHN0cmFhdFwiLFxuICAgICAgaHVpc251bW1lcjogNDkxLFxuICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxuICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXG4gICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxuICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcbiAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAyLTIwXCIsXG4gICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDEsXG4gICAgICBzdHJhYXQ6IFwiQ2hhc3NldmVsZFwiLFxuICAgICAgaHVpc251bW1lcjogbnVsbCxcbiAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcbiAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXG4gICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxuICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDEtMDRcIixcbiAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIlxuICAgIH1cbiAgXTtcblxuICBmdW5jdGlvbiBnZXRSZXBvcnRzKCkge1xuICAgIHJldHVybiByZXBvcnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVwb3J0KHJlcG9ydElkKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXBvcnRzW2ldLmlkID09PSBwYXJzZUludChyZXBvcnRJZCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcG9ydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRSZXBvcnRzOiBnZXRSZXBvcnRzLFxuICAgIGdldFJlcG9ydDogZ2V0UmVwb3J0XG4gIH07XG59O1xuIiwidmFyIHJlcG9ydHNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5yZXBvcnRzJywgW10pO1xuXG5yZXBvcnRzTW9kdWxlLmNvbnRyb2xsZXIoXCJSZXBvcnRzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXJcIikpO1xucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0Q29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9yZXBvcnQuY29udHJvbGxlclwiKSk7XG5cbnJlcG9ydHNNb2R1bGUuZmFjdG9yeShcIlJlcG9ydHNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnlcIikpO1xuXG5yZXBvcnRzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9yZXBvcnRzLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwb3J0c01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvcmVwb3J0cycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnRzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydHNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmRldGFpbHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvOnJlcG9ydElkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3JlcG9ydHNAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0LWFkZCcsIHtcbiAgICAgICAgICAgIHVybDogJy9yZXBvcnQvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3JlcG9ydC1hZGQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZXBvcnRzL3RlbXBsYXRlcy9yZXBvcnRzLmFkZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICR0cmFuc2xhdGUpIHtcblxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xuICAgICAgICAkdHJhbnNsYXRlLnVzZShsYW5ndWFnZSk7XG4gICAgfTtcblxufTtcbiIsInZhciBzZXR0aW5nc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLnNldHRpbmdzJywgW10pO1xuXG5zZXR0aW5nc01vZHVsZS5jb250cm9sbGVyKFwiU2V0dGluZ3NDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXJcIikpO1xuXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcblxuc2V0dGluZ3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3NldHRpbmdzLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLnNldHRpbmdzJywge1xuICAgICAgdXJsOiAnL3NldHRpbmdzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvc2V0dGluZ3MvdGVtcGxhdGVzL3NldHRpbmdzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn07XG4iXX0=
