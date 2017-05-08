(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./components/main/main.module');
require('./components/map/map.module');
require('./components/issues/issues.module.js');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
    'ionic',
    'ngCordova',
	'ngStorage',
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

},{"./components/issues/issues.module.js":5,"./components/main/main.module":7,"./components/map/map.module":12,"./components/settings/settings.module":16}],2:[function(require,module,exports){
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
  
  IssuesFactory.getIssues().then(function(issues) {
        $scope.issues = issues;
    });

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};

},{}],4:[function(require,module,exports){
module.exports = function ($http) {

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OTBlMzk4N2NjNDIyNzAwMDRlZDQ0NTAiLCJlbWFpbCI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkLjg1bHJzVUFYYS5KTGFMaVlOajFVTzVYaHZmNHBkWGRrL1dvejhRT2J1bWw5QUthOTB4MUcifQ.iVq_k4Xw6G4vPbs8arf3LfILeifglrVPKIvaHXS9uKE";

    function getIssues() {
        return $http.get("https://zb-api.herokuapp.com/issues", { headers: { 'bearer': token } } ).then(function (response) {
			//TEMP
			for (var i = 0; i < response.data.data.length; i++) {
			  response.data.data[i].photo = "img/chasseveld.png";
			}
			
			return response.data.data;
        }, function(error) {
            console.error(error);
        });
    }

    function getIssue(issueId) {
        /* for (var i = 0; i < issues.length; i++) {
            if (issues[i].id === parseInt(issueId)) {
                return issues[i];
            }
        }
        return null; */

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
module.exports = function ($scope, $translate, SettingsFactory) {

    SettingsFactory.getMe().then(function(user) {
        $scope.user = user;
    });

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],15:[function(require,module,exports){
module.exports = function ($http) {

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OTBlMzk4N2NjNDIyNzAwMDRlZDQ0NTAiLCJlbWFpbCI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkLjg1bHJzVUFYYS5KTGFMaVlOajFVTzVYaHZmNHBkWGRrL1dvejhRT2J1bWw5QUthOTB4MUcifQ.iVq_k4Xw6G4vPbs8arf3LfILeifglrVPKIvaHXS9uKE";

    function getMe() {
        return $http.get("https://zb-api.herokuapp.com/users/me", { headers: { 'bearer': token } } ).then(function (response) {
            return response.data;
        }, function(error) {
            console.error(error);
        });
    }

    return {
        getMe: getMe
    };
};

},{}],16:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":14,"./factories/settings.factory":15,"./settings.routes":17}],17:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9mYWN0b3JpZXMvc2V0dGluZ3MuZmFjdG9yeS5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLnJvdXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFpbi9tYWluLm1vZHVsZScpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL2lzc3Vlcy9pc3N1ZXMubW9kdWxlLmpzJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUnKTtcclxuXHJcbmFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtJywgW1xyXG4gICAgJ2lvbmljJyxcclxuICAgICduZ0NvcmRvdmEnLFxyXG5cdCduZ1N0b3JhZ2UnLFxyXG4gICAgJ3Bhc2NhbHByZWNodC50cmFuc2xhdGUnLFxyXG4gICAgJ3pvbm5lYmxvZW0ubWFpbicsXHJcbiAgICAnem9ubmVibG9lbS5tYXAnLFxyXG4gICAgJ3pvbm5lYmxvZW0uaXNzdWVzJyxcclxuICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xyXG5dKVxyXG5cclxuICAgIC5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtKSB7XHJcbiAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuaGlkZUZvcm1BY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5zaHJpbmtWaWV3KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbGluZ0luU2hyaW5rVmlldyh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgSXNzdWVzRmFjdG9yeSkge1xyXG5cclxuICAgICRzY29wZS5pc3N1ZSA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWUoJHN0YXRlUGFyYW1zLmlzc3VlSWQpO1xyXG5cclxuICAgIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0KCRzdGF0ZVBhcmFtcy5yZXBvcnRJZCkudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgJHNjb3BlLnJlcG9ydCA9IHJlcG9ydDtcclxuICAgIH0pOyovXHJcblxyXG4gICAgJHNjb3BlLmFkZFBob3RvID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnNob3dQaG90byA9IGZhbHNlO1xyXG4gICAgfTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICRzY29wZS5pc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xyXG4gIFxyXG4gIElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCkudGhlbihmdW5jdGlvbihpc3N1ZXMpIHtcclxuICAgICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gICAgfSk7XHJcblxyXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gIH0pKi9cclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdG9rZW4gPSBcImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpmYVdRaU9pSTFPVEJsTXprNE4yTmpOREl5TnpBd01EUmxaRFEwTlRBaUxDSmxiV0ZwYkNJNkltRmtiV2x1SWl3aWNHRnpjM2R2Y21RaU9pSWtNbUVrTURna0xqZzFiSEp6VlVGWVlTNUtUR0ZNYVZsT2FqRlZUelZZYUhabU5IQmtXR1JyTDFkdmVqaFJUMkoxYld3NVFVdGhPVEI0TVVjaWZRLmlWcV9rNFh3Nkc0dlBiczhhcmYzTGZJTGVpZmdsclZQS0l2YUhYUzl1S0VcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJc3N1ZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChcImh0dHBzOi8vemItYXBpLmhlcm9rdWFwcC5jb20vaXNzdWVzXCIsIHsgaGVhZGVyczogeyAnYmVhcmVyJzogdG9rZW4gfSB9ICkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuXHRcdFx0Ly9URU1QXHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgcmVzcG9uc2UuZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdCAgcmVzcG9uc2UuZGF0YS5kYXRhW2ldLnBob3RvID0gXCJpbWcvY2hhc3NldmVsZC5wbmdcIjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLmRhdGEuZGF0YTtcclxuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJc3N1ZShpc3N1ZUlkKSB7XHJcbiAgICAgICAgLyogZm9yICh2YXIgaSA9IDA7IGkgPCBpc3N1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGlzc3Vlc1tpXS5pZCA9PT0gcGFyc2VJbnQoaXNzdWVJZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc3N1ZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7ICovXHJcblxyXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0O1xyXG4gICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRJc3N1ZXM6IGdldElzc3VlcyxcclxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWVcclxuICAgIH07XHJcbn07XHJcbiIsInZhciBpc3N1ZXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5pc3N1ZXMnLCBbXSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3Vlc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanNcIikpO1xyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5jb250cm9sbGVyLmpzXCIpKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5mYWN0b3J5KFwiSXNzdWVzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvaXNzdWVzLmZhY3RvcnkuanNcIikpO1xyXG5cclxuaXNzdWVzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9pc3N1ZXMucm91dGVzLmpzXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gaXNzdWVzTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3VlcycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2lzc3VlcycsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnaXNzdWVzJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVzQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5hZGQnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9hZGQnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ21hcEBhcHAuaXNzdWVzLmFkZCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbWFwL3RlbXBsYXRlcy9pc3N1ZS5tYXAuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlTWFwQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAnaXNzdWVzQGFwcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMuZGV0YWlscycsIHtcclxuICAgICAgICAgICAgdXJsOiAnLzppc3N1ZUlkJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5kZXRhaWxzLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZUNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufTtcclxuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xyXG5cclxubWFpbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFpbi5yb3V0ZXNcIikpO1xyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpbk1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYXBwJyxcclxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbWFpbi5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvaXNzdWVzJyk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xyXG5cclxuICAgICR0cmFuc2xhdGVQcm92aWRlclxyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ2xvY2FsZXMvJyxcclxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucmVnaXN0ZXJBdmFpbGFibGVMYW5ndWFnZUtleXMoWydubCcsICdlbiddLCB7XHJcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxyXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxyXG4gICAgICAgICAgICAnZW4nOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcclxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZVBhcmFtZXRlcnMnKVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJGNvcmRvdmFHZW9sb2NhdGlvbiwgJGlvbmljUG9wdXApIHtcclxuXHJcbiAgICAvLyBHb29nbGUgTWFwcyBvcHRpb25zXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcclxuICAgIH07XHJcblxyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG5cclxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xyXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiAxNSxcclxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNYXAgZWxlbWVudFxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkRpdCBpcyBlZW4gbWVsZGluZyFcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICAgdmFyIGlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcblxyXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXHJcbiAgICB9O1xyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XHJcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xyXG5cclxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xyXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xyXG4gICAgICAgICAgICB6b29tOiAxMixcclxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBNYXAgZWxlbWVudFxyXG4gICAgICAgICRzY29wZS5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFwXCIpLCBtYXBPcHRpb25zKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29vcmRpbmF0ZXMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGlzc3Vlc1tpXS5sYXRpdHVkZSwgaXNzdWVzW2ldLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGNvb3JkaW5hdGVzXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICAgJzxpbWcgc3JjPVwiJyArIGlzc3Vlc1tpXS5mb3RvICsgJ1wiIHdpZHRoPVwiMTAwXCIvPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+JyArIGlzc3Vlc1tpXS50b2VsaWNodGluZyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj48YSBocmVmPVwiLyMvYXBwL2lzc3Vlcy8nICsgaXNzdWVzW2ldLmlkICsgJ1wiPk1lbGRpbmc8L2E+ICdcclxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwnY2xpY2snLCAoZnVuY3Rpb24obWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdyl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoY29udGVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsbWFya2VyKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgfSkobWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdykpO1xyXG5cclxuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCRzY29wZS5tYXAsICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbGF0TG5nOiAnICsgZXZlbnQubGF0TG5nLmxhdCgpICsgJywgJyArIGV2ZW50LmxhdExuZy5sbmcoKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJ2YXIgbWFwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFwJywgW10pO1xyXG5cclxubWFwTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZU1hcENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUubWFwLmNvbnRyb2xsZXIuanNcIikpO1xyXG5tYXBNb2R1bGUuY29udHJvbGxlcignTWFwQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvbWFwLmNvbnRyb2xsZXIuanMnKSk7XHJcbm1hcE1vZHVsZS5mYWN0b3J5KFwiSXNzdWVzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi8uLi9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbm1hcE1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFwLnJvdXRlcy5qc1wiKSk7XHJcbm1vZHVsZS5leHBvcnRzID0gbWFwTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcclxuICAgICAgICAgICAgdXJsOiAnL21hcCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnbWFwJzoge1xyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL21hcC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFwQ29udHJvbGxlcidcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSwgU2V0dGluZ3NGYWN0b3J5KSB7XHJcblxyXG4gICAgU2V0dGluZ3NGYWN0b3J5LmdldE1lKCkudGhlbihmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgJHNjb3BlLnVzZXIgPSB1c2VyO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHNjb3BlLnN3aXRjaExhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlKSB7XHJcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xyXG4gICAgfTtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRodHRwKSB7XHJcblxyXG4gICAgdG9rZW4gPSBcImV5SjBlWEFpT2lKS1YxUWlMQ0poYkdjaU9pSklVekkxTmlKOS5leUpmYVdRaU9pSTFPVEJsTXprNE4yTmpOREl5TnpBd01EUmxaRFEwTlRBaUxDSmxiV0ZwYkNJNkltRmtiV2x1SWl3aWNHRnpjM2R2Y21RaU9pSWtNbUVrTURna0xqZzFiSEp6VlVGWVlTNUtUR0ZNYVZsT2FqRlZUelZZYUhabU5IQmtXR1JyTDFkdmVqaFJUMkoxYld3NVFVdGhPVEI0TVVjaWZRLmlWcV9rNFh3Nkc0dlBiczhhcmYzTGZJTGVpZmdsclZQS0l2YUhYUzl1S0VcIjtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRNZSgpIHtcclxuICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KFwiaHR0cHM6Ly96Yi1hcGkuaGVyb2t1YXBwLmNvbS91c2Vycy9tZVwiLCB7IGhlYWRlcnM6IHsgJ2JlYXJlcic6IHRva2VuIH0gfSApLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0TWU6IGdldE1lXHJcbiAgICB9O1xyXG59O1xyXG4iLCJ2YXIgc2V0dGluZ3NNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5zZXR0aW5ncycsIFtdKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XHJcblxyXG5zZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9zZXR0aW5ncy5yb3V0ZXNcIikpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAkc3RhdGVQcm92aWRlclxyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XHJcbiAgICAgIHVybDogJy9zZXR0aW5ncycsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ3NldHRpbmdzJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL3NldHRpbmdzL3RlbXBsYXRlcy9zZXR0aW5ncy5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxufTtcclxuIl19
