(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./components/main/main.module');
require('./components/reports/reports.module');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
        'ionic',
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

},{"./components/main/main.module":2,"./components/reports/reports.module":7,"./components/settings/settings.module":10}],2:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));

module.exports = mainModule;
},{"./main.routes":3}],3:[function(require,module,exports){
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
module.exports = function ($scope, $stateParams, ReportsFactory) {

  $scope.report = ReportsFactory.getReport($stateParams.reportId);

  $scope.addPhoto = function () {
    $scope.showPhoto = true;
  };

  $scope.removePhoto = function () {
    $scope.showPhoto = false;
  };

};

},{}],5:[function(require,module,exports){
module.exports = function ($scope, ReportsFactory) {

  $scope.reports = ReportsFactory.getReports();

};

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
var reportsModule = angular.module('zonnebloem.reports', []);

reportsModule.controller("ReportsController", require("./controllers/reports.controller"));
reportsModule.controller("ReportController", require("./controllers/report.controller"));

reportsModule.factory("ReportsFactory", require("./factories/reports.factory"));

reportsModule.config(require("./reports.routes"));

module.exports = reportsModule;
},{"./controllers/report.controller":4,"./controllers/reports.controller":5,"./factories/reports.factory":6,"./reports.routes":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
module.exports = function ($scope/*, SettingsFactory*/) {
  // Create your own controller
};

},{}],10:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":9,"./settings.routes":11}],11:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2NvbnRyb2xsZXJzL3JlcG9ydC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvcmVwb3J0cy9yZXBvcnRzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9yZXBvcnRzL3JlcG9ydHMubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlJyk7XG5cbmFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtJywgW1xuICAgICAgICAnaW9uaWMnLFxuICAgICAgICAnem9ubmVibG9lbS5tYWluJyxcbiAgICAgICAgJ3pvbm5lYmxvZW0ucmVwb3J0cycsXG4gICAgICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xuICAgIF0pXG5cbi5ydW4oZnVuY3Rpb24oJGlvbmljUGxhdGZvcm0pIHtcbiAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICBpZiAod2luZG93LmNvcmRvdmEgJiYgd2luZG93LmNvcmRvdmEucGx1Z2lucyAmJiB3aW5kb3cuY29yZG92YS5wbHVnaW5zLktleWJvYXJkKSB7XG4gICAgICBjb3Jkb3ZhLnBsdWdpbnMuS2V5Ym9hcmQuaGlkZUtleWJvYXJkQWNjZXNzb3J5QmFyKGZhbHNlKTtcbiAgICAgIGNvcmRvdmEucGx1Z2lucy5LZXlib2FyZC5kaXNhYmxlU2Nyb2xsKHRydWUpO1xuXG4gICAgfVxuICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAvLyBvcmcuYXBhY2hlLmNvcmRvdmEuc3RhdHVzYmFyIHJlcXVpcmVkXG4gICAgICBTdGF0dXNCYXIuc3R5bGVEZWZhdWx0KCk7XG4gICAgfVxuICB9KTtcbn0pO1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpbk1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYXBwJyxcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXG4gICAgICAgIH0pO1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9yZXBvcnRzJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsIFJlcG9ydHNGYWN0b3J5KSB7XG5cbiAgJHNjb3BlLnJlcG9ydCA9IFJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpO1xuXG4gICRzY29wZS5hZGRQaG90byA9IGZ1bmN0aW9uICgpIHtcbiAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcbiAgfTtcblxuICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgJHNjb3BlLnNob3dQaG90byA9IGZhbHNlO1xuICB9O1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCBSZXBvcnRzRmFjdG9yeSkge1xuXG4gICRzY29wZS5yZXBvcnRzID0gUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciByZXBvcnRzID0gW1xuICAgIHtcbiAgICAgIGlkOiAwLFxuICAgICAgc3RyYWF0OiBcIlpvcmd2bGlldHN0cmFhdFwiLFxuICAgICAgaHVpc251bW1lcjogNDkxLFxuICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxuICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXG4gICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxuICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcbiAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAyLTIwXCIsXG4gICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgaWQ6IDEsXG4gICAgICBzdHJhYXQ6IFwiQ2hhc3NldmVsZFwiLFxuICAgICAgaHVpc251bW1lcjogbnVsbCxcbiAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcbiAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXG4gICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxuICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDEtMDRcIixcbiAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIlxuICAgIH1cbiAgXTtcblxuICBmdW5jdGlvbiBnZXRSZXBvcnRzKCkge1xuICAgIHJldHVybiByZXBvcnRzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0UmVwb3J0KHJlcG9ydElkKSB7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IHJlcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZXBvcnRzW2ldLmlkID09PSBwYXJzZUludChyZXBvcnRJZCkpIHtcbiAgICAgICAgcmV0dXJuIHJlcG9ydHNbaV07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRSZXBvcnRzOiBnZXRSZXBvcnRzLFxuICAgIGdldFJlcG9ydDogZ2V0UmVwb3J0XG4gIH07XG59O1xuIiwidmFyIHJlcG9ydHNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5yZXBvcnRzJywgW10pO1xuXG5yZXBvcnRzTW9kdWxlLmNvbnRyb2xsZXIoXCJSZXBvcnRzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9yZXBvcnRzLmNvbnRyb2xsZXJcIikpO1xucmVwb3J0c01vZHVsZS5jb250cm9sbGVyKFwiUmVwb3J0Q29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9yZXBvcnQuY29udHJvbGxlclwiKSk7XG5cbnJlcG9ydHNNb2R1bGUuZmFjdG9yeShcIlJlcG9ydHNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9yZXBvcnRzLmZhY3RvcnlcIikpO1xuXG5yZXBvcnRzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9yZXBvcnRzLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVwb3J0c01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLnJlcG9ydHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvcmVwb3J0cycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdyZXBvcnRzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydHNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5yZXBvcnRzLmRldGFpbHMnLCB7XG4gICAgICAgICAgICB1cmw6ICcvOnJlcG9ydElkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3JlcG9ydHNAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvcmVwb3J0cy90ZW1wbGF0ZXMvcmVwb3J0cy5kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVwb3J0Q29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgLnN0YXRlKCdhcHAucmVwb3J0LWFkZCcsIHtcbiAgICAgICAgICAgIHVybDogJy9yZXBvcnQvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3JlcG9ydC1hZGQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9yZXBvcnRzL3RlbXBsYXRlcy9yZXBvcnRzLmFkZC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcG9ydENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUvKiwgU2V0dGluZ3NGYWN0b3J5Ki8pIHtcbiAgLy8gQ3JlYXRlIHlvdXIgb3duIGNvbnRyb2xsZXJcbn07XG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcblxuc2V0dGluZ3NNb2R1bGUuY29udHJvbGxlcihcIlNldHRpbmdzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyXCIpKTtcblxuLy8gc2V0dGluZ3NNb2R1bGUuZmFjdG9yeShcIlNldHRpbmdzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvc2V0dGluZ3MuZmFjdG9yeVwiKSk7XG5cbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzTW9kdWxlO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcbiAgJHN0YXRlUHJvdmlkZXJcbiAgICAuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXG4gICAgICB2aWV3czoge1xuICAgICAgICAnc2V0dGluZ3MnOiB7XG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcbiAgICAgICAgICBjb250cm9sbGVyOiAnU2V0dGluZ3NDb250cm9sbGVyJ1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG59O1xuIl19
