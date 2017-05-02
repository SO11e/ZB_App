(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./components/main/main.module');
require('./components/authorization/authorization.module');
require('./components/map/map.module');
require('./components/issues/issues.module.js');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
    'ionic',
    'ngCordova',
    'ngStorage',
    'pascalprecht.translate',
    'zonnebloem.main',
    'zonnebloem.authorization',
    'zonnebloem.map',
    'zonnebloem.issues',
    'zonnebloem.settings'
])

    .run(function ($ionicPlatform, $state, AuthorizationFactory) {
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

            if (AuthorizationFactory.getAuthToken() === null || AuthorizationFactory.getAuthToken() === undefined) {
                $state.go('app.login');
                console.log("User not logged in");
            } else {
                console.log("User logged in");
            }
        });
    });

},{"./components/authorization/authorization.module":2,"./components/issues/issues.module.js":10,"./components/main/main.module":12,"./components/map/map.module":17,"./components/settings/settings.module":20}],2:[function(require,module,exports){
var authorizationModule = angular.module('zonnebloem.authorization', []);

authorizationModule.controller("LoginController", require("./controllers/login.controller.js"));
authorizationModule.controller("LogoutController", require("./controllers/logout.controller.js"));

authorizationModule.factory("AuthorizationFactory", require("./factories/authorization.factory.js"));

authorizationModule.config(require("./authorization.routes.js"));

module.exports = authorizationModule;

},{"./authorization.routes.js":3,"./controllers/login.controller.js":4,"./controllers/logout.controller.js":5,"./factories/authorization.factory.js":6}],3:[function(require,module,exports){
module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.login', {
            url: '/login',
            views: {
                'settings': {
                    templateUrl: 'components/authorization/templates/login.html',
                    controller: 'LoginController'
                }
            }
        });
};

},{}],4:[function(require,module,exports){
module.exports = function ($state, $scope, $ionicHistory, AuthorizationFactory) {

    $scope.credentials = {
        "email": "",
        "password": ""
    };

    $scope.login = function () {
        AuthorizationFactory.login($scope.credentials).then(function (data) {
            console.log(data);
            if (data) {
                AuthorizationFactory.setAuthToken(data);

                $state.go('app.settings');
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
            }
        });
    };

};

},{}],5:[function(require,module,exports){
module.exports = function ($state, $scope, $ionicHistory, AuthorizationFactory) {

    $scope.logout = function () {
            AuthorizationFactory.clearUser();
            AuthorizationFactory.clearAuthToken();

            $state.go('app.login');
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
    };

};

},{}],6:[function(require,module,exports){
module.exports = function (hostname, $http, $localStorage, $ionicPopup, $translate) {

    function login(credentials) {
        return $http.post(hostname + "/login", JSON.stringify(credentials), {headers: {'Content-Type': 'application/json'}})
            .then(function (response) {
                return response.data;
            }, function (error) {
                // console.error(error.status);
                showAlert();
            });
    }

    function getUser() {
        return $localStorage.user;
    }

    function setUser(user) {
        $localStorage.user = user;
    }

    function clearUser() {
        delete $localStorage.user;
    }

    function getUsername() {
        if ($localStorage.user) {
            return $localStorage.user.local.username;
        }
    }

    function getAuthToken() {
        return $localStorage.authToken;
    }

    function setAuthToken(token) {
        $localStorage.authToken = token;
    }

    function clearAuthToken() {
        delete $localStorage.authToken;
    }

    function showAlert() {
        $ionicPopup.alert({
            title: $translate.instant('LOGIN_ERROR_TITLE'),
            template: $translate.instant('LOGIN_ERROR_EXPLANATION'),
            okText: $translate.instant('LOGIN_ERROR_ACCEPT')
        });
    }

    return {
        login: login,
        /*logout: logout,*/
        getUser: getUser,
        setUser: setUser,
        clearUser: clearUser,
        getUsername: getUsername,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        clearAuthToken: clearAuthToken
    };
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
module.exports = function ($scope, IssuesFactory) {

  $scope.issues = IssuesFactory.getIssues();

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
var issuesModule = angular.module('zonnebloem.issues', []);

issuesModule.controller("IssuesController", require("./controllers/issues.controller.js"));
issuesModule.controller("IssueController", require("./controllers/issue.controller.js"));

issuesModule.factory("IssuesFactory", require("./factories/issues.factory.js"));

issuesModule.config(require("./issues.routes.js"));

module.exports = issuesModule;
},{"./controllers/issue.controller.js":7,"./controllers/issues.controller.js":8,"./factories/issues.factory.js":9,"./issues.routes.js":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.value('hostname', "https://zb-api.herokuapp.com");

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;
},{"./main.routes":13,"./main.translation":14}],13:[function(require,module,exports){
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'main.html'
        });

    $urlRouterProvider.otherwise('/app/issues');
};

},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;
},{"./../issues/factories/issues.factory.js":9,"./controllers/issue.map.controller.js":15,"./controllers/map.controller.js":16,"./map.routes.js":18}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
module.exports = function ($scope, $translate, AuthorizationFactory) {

    $scope.token = AuthorizationFactory.getAuthToken();

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};

},{}],20:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

// settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":19,"./settings.routes":21}],21:[function(require,module,exports){
module.exports = function ($stateProvider) {
  $stateProvider
    .state('app.settings', {
      url: '/settings',
      views: {
        'settings': {
          templateUrl: 'components/settings/templates/settings.html',
          controller: 'SettingsController'
        },
          'logout@app.settings': {
              templateUrl: 'components/authorization/templates/logout.html',
              controller: 'LogoutController'
          }
      }
    });
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9hdXRob3JpemF0aW9uLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL2F1dGhvcml6YXRpb24vYXV0aG9yaXphdGlvbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ291dC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9mYWN0b3JpZXMvYXV0aG9yaXphdGlvbi5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4vY29tcG9uZW50cy9tYWluL21haW4ubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9hdXRob3JpemF0aW9uLm1vZHVsZScpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUnKTtcblxuYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0nLCBbXG4gICAgJ2lvbmljJyxcbiAgICAnbmdDb3Jkb3ZhJyxcbiAgICAnbmdTdG9yYWdlJyxcbiAgICAncGFzY2FscHJlY2h0LnRyYW5zbGF0ZScsXG4gICAgJ3pvbm5lYmxvZW0ubWFpbicsXG4gICAgJ3pvbm5lYmxvZW0uYXV0aG9yaXphdGlvbicsXG4gICAgJ3pvbm5lYmxvZW0ubWFwJyxcbiAgICAnem9ubmVibG9lbS5pc3N1ZXMnLFxuICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xuXSlcblxuICAgIC5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUsIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XG4gICAgICAgICRpb25pY1BsYXRmb3JtLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIC8vIEhpZGUgdGhlIGFjY2Vzc29yeSBiYXIgYnkgZGVmYXVsdCAocmVtb3ZlIHRoaXMgdG8gc2hvdyB0aGUgYWNjZXNzb3J5IGJhciBhYm92ZSB0aGUga2V5Ym9hcmRcbiAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcbiAgICAgICAgICAgIGlmICh3aW5kb3cuS2V5Ym9hcmQpIHtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5oaWRlRm9ybUFjY2Vzc29yeUJhcih0cnVlKTtcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5zaHJpbmtWaWV3KHRydWUpO1xuICAgICAgICAgICAgICAgIEtleWJvYXJkLmRpc2FibGVTY3JvbGxpbmdJblNocmlua1ZpZXcodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh3aW5kb3cuU3RhdHVzQmFyKSB7XG4gICAgICAgICAgICAgICAgU3RhdHVzQmFyLnN0eWxlTGlnaHRDb250ZW50KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChBdXRob3JpemF0aW9uRmFjdG9yeS5nZXRBdXRoVG9rZW4oKSA9PT0gbnVsbCB8fCBBdXRob3JpemF0aW9uRmFjdG9yeS5nZXRBdXRoVG9rZW4oKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlVzZXIgbm90IGxvZ2dlZCBpblwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJVc2VyIGxvZ2dlZCBpblwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4iLCJ2YXIgYXV0aG9yaXphdGlvbk1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLmF1dGhvcml6YXRpb24nLCBbXSk7XG5cbmF1dGhvcml6YXRpb25Nb2R1bGUuY29udHJvbGxlcihcIkxvZ2luQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9sb2dpbi5jb250cm9sbGVyLmpzXCIpKTtcbmF1dGhvcml6YXRpb25Nb2R1bGUuY29udHJvbGxlcihcIkxvZ291dENvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvbG9nb3V0LmNvbnRyb2xsZXIuanNcIikpO1xuXG5hdXRob3JpemF0aW9uTW9kdWxlLmZhY3RvcnkoXCJBdXRob3JpemF0aW9uRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvYXV0aG9yaXphdGlvbi5mYWN0b3J5LmpzXCIpKTtcblxuYXV0aG9yaXphdGlvbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vYXV0aG9yaXphdGlvbi5yb3V0ZXMuanNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGF1dGhvcml6YXRpb25Nb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmxvZ2luJywge1xuICAgICAgICAgICAgdXJsOiAnL2xvZ2luJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ3NldHRpbmdzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi90ZW1wbGF0ZXMvbG9naW4uaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGUsICRzY29wZSwgJGlvbmljSGlzdG9yeSwgQXV0aG9yaXphdGlvbkZhY3RvcnkpIHtcblxuICAgICRzY29wZS5jcmVkZW50aWFscyA9IHtcbiAgICAgICAgXCJlbWFpbFwiOiBcIlwiLFxuICAgICAgICBcInBhc3N3b3JkXCI6IFwiXCJcbiAgICB9O1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5sb2dpbigkc2NvcGUuY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5zZXRBdXRoVG9rZW4oZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5zZXR0aW5ncycpO1xuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJIaXN0b3J5KCk7XG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgICAgICBoaXN0b3J5Um9vdDogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlLCAkc2NvcGUsICRpb25pY0hpc3RvcnksIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgQXV0aG9yaXphdGlvbkZhY3RvcnkuY2xlYXJVc2VyKCk7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5jbGVhckF1dGhUb2tlbigpO1xuXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckhpc3RvcnkoKTtcbiAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xuICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaG9zdG5hbWUsICRodHRwLCAkbG9jYWxTdG9yYWdlLCAkaW9uaWNQb3B1cCwgJHRyYW5zbGF0ZSkge1xuXG4gICAgZnVuY3Rpb24gbG9naW4oY3JlZGVudGlhbHMpIHtcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoaG9zdG5hbWUgKyBcIi9sb2dpblwiLCBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscyksIHtoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ319KVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmVycm9yKGVycm9yLnN0YXR1cyk7XG4gICAgICAgICAgICAgICAgc2hvd0FsZXJ0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgICAgICByZXR1cm4gJGxvY2FsU3RvcmFnZS51c2VyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFVzZXIodXNlcikge1xuICAgICAgICAkbG9jYWxTdG9yYWdlLnVzZXIgPSB1c2VyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyVXNlcigpIHtcbiAgICAgICAgZGVsZXRlICRsb2NhbFN0b3JhZ2UudXNlcjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRVc2VybmFtZSgpIHtcbiAgICAgICAgaWYgKCRsb2NhbFN0b3JhZ2UudXNlcikge1xuICAgICAgICAgICAgcmV0dXJuICRsb2NhbFN0b3JhZ2UudXNlci5sb2NhbC51c2VybmFtZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldEF1dGhUb2tlbigpIHtcbiAgICAgICAgcmV0dXJuICRsb2NhbFN0b3JhZ2UuYXV0aFRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldEF1dGhUb2tlbih0b2tlbikge1xuICAgICAgICAkbG9jYWxTdG9yYWdlLmF1dGhUb2tlbiA9IHRva2VuO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyQXV0aFRva2VuKCkge1xuICAgICAgICBkZWxldGUgJGxvY2FsU3RvcmFnZS5hdXRoVG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2hvd0FsZXJ0KCkge1xuICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdMT0dJTl9FUlJPUl9USVRMRScpLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnTE9HSU5fRVJST1JfRVhQTEFOQVRJT04nKSxcbiAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZS5pbnN0YW50KCdMT0dJTl9FUlJPUl9BQ0NFUFQnKVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgIC8qbG9nb3V0OiBsb2dvdXQsKi9cbiAgICAgICAgZ2V0VXNlcjogZ2V0VXNlcixcbiAgICAgICAgc2V0VXNlcjogc2V0VXNlcixcbiAgICAgICAgY2xlYXJVc2VyOiBjbGVhclVzZXIsXG4gICAgICAgIGdldFVzZXJuYW1lOiBnZXRVc2VybmFtZSxcbiAgICAgICAgZ2V0QXV0aFRva2VuOiBnZXRBdXRoVG9rZW4sXG4gICAgICAgIHNldEF1dGhUb2tlbjogc2V0QXV0aFRva2VuLFxuICAgICAgICBjbGVhckF1dGhUb2tlbjogY2xlYXJBdXRoVG9rZW5cbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlLCAkc3RhdGVQYXJhbXMsIElzc3Vlc0ZhY3RvcnkpIHtcblxuICAgICRzY29wZS5pc3N1ZSA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWUoJHN0YXRlUGFyYW1zLmlzc3VlSWQpO1xuXG4gICAgLypSZXBvcnRzRmFjdG9yeS5nZXRSZXBvcnQoJHN0YXRlUGFyYW1zLnJlcG9ydElkKS50aGVuKGZ1bmN0aW9uIChyZXBvcnQpIHtcbiAgICAgICAgJHNjb3BlLnJlcG9ydCA9IHJlcG9ydDtcbiAgICB9KTsqL1xuXG4gICAgJHNjb3BlLmFkZFBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gdHJ1ZTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLnJlbW92ZVBob3RvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XG4gICAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsIElzc3Vlc0ZhY3RvcnkpIHtcblxuICAkc2NvcGUuaXNzdWVzID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZXMoKTtcblxuICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydHMoKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcbiAgICAgICRzY29wZS5pc3N1ZXMgPSBpc3N1ZXM7XG4gIH0pKi9cblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBpc3N1ZXMgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAwLFxuICAgICAgICAgICAgc3RyYWF0OiBcIlpvcmd2bGlldHN0cmFhdFwiLFxuICAgICAgICAgICAgaHVpc251bW1lcjogNDkxLFxuICAgICAgICAgICAgcG9zdGNvZGU6IFwiNDgzNCBOSFwiLFxuICAgICAgICAgICAgcGxhYXRzOiBcIkJyZWRhXCIsXG4gICAgICAgICAgICB0b2VsaWNodGluZzogXCJUZSBob2dlIHN0b2VwcmFuZFwiLFxuICAgICAgICAgICAgZm90bzogXCJpbWcvbG9jYXRpZS5wbmdcIixcbiAgICAgICAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAyLTIwXCIsXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogbnVsbCxcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41NzM0MzgsXG4gICAgICAgICAgICBsb25naXR1ZGU6IDQuODEyNzczXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkOiAxLFxuICAgICAgICAgICAgc3RyYWF0OiBcIkNoYXNzZXZlbGRcIixcbiAgICAgICAgICAgIGh1aXNudW1tZXI6IG51bGwsXG4gICAgICAgICAgICBwb3N0Y29kZTogXCI0ODExIERIXCIsXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIkhlayBvcCBkZSBzdG9lcFwiLFxuICAgICAgICAgICAgZm90bzogXCJpbWcvY2hhc3NldmVsZC5wbmdcIixcbiAgICAgICAgICAgIGRhdHVtX2dlbWVsZDogXCIyMDE3LTAxLTA0XCIsXG4gICAgICAgICAgICBkYXR1bV9vcGdlbG9zdDogXCIyMDE3LTAyLTE1XCIsXG4gICAgICAgICAgICBsYXRpdHVkZTogNTEuNTg4ODc1LFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiA0Ljc4NTY2M1xuICAgICAgICB9XG4gICAgXTtcblxuICAgIGZ1bmN0aW9uIGdldElzc3VlcygpIHtcbiAgICAgICAgcmV0dXJuIGlzc3VlcztcblxuICAgICAgICAvKnJldHVybiAkaHR0cC5nZXQoXCJISUVSIEtPTVQgREUgTElOSyBOQUFSIERFIEFQSVwiKS50aGVuKGZ1bmN0aW9uIChpc3N1ZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBpc3N1ZXM7XG4gICAgICAgIH0pOyovXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWUoaXNzdWVJZCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGlzc3Vlc1tpXS5pZCA9PT0gcGFyc2VJbnQoaXNzdWVJZCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNzdWVzW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcG9ydDtcbiAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBnZXRJc3N1ZXM6IGdldElzc3VlcyxcbiAgICAgICAgZ2V0SXNzdWU6IGdldElzc3VlXG4gICAgfTtcbn07XG4iLCJ2YXIgaXNzdWVzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uaXNzdWVzJywgW10pO1xuXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3Vlc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanNcIikpO1xuaXNzdWVzTW9kdWxlLmNvbnRyb2xsZXIoXCJJc3N1ZUNvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvaXNzdWUuY29udHJvbGxlci5qc1wiKSk7XG5cbmlzc3Vlc01vZHVsZS5mYWN0b3J5KFwiSXNzdWVzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvaXNzdWVzLmZhY3RvcnkuanNcIikpO1xuXG5pc3N1ZXNNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL2lzc3Vlcy5yb3V0ZXMuanNcIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzc3Vlc01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3VlcycsIHtcbiAgICAgICAgICAgIHVybDogJy9pc3N1ZXMnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnaXNzdWVzJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZXNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMuYWRkJywge1xuICAgICAgICAgICAgdXJsOiAnL2FkZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdtYXBAYXBwLmlzc3Vlcy5hZGQnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL2lzc3VlLm1hcC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlTWFwQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuYWRkLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMuZGV0YWlscycsIHtcbiAgICAgICAgICAgIHVybDogJy86aXNzdWVJZCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdpc3N1ZXNAYXBwJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuZGV0YWlscy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3VlQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufTtcbiIsInZhciBtYWluTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFpbicsIFtdKTtcblxubWFpbk1vZHVsZS52YWx1ZSgnaG9zdG5hbWUnLCBcImh0dHBzOi8vemItYXBpLmhlcm9rdWFwcC5jb21cIik7XG5cbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4ucm91dGVzXCIpKTtcbm1haW5Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL21haW4udHJhbnNsYXRpb25cIikpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1haW5Nb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwJywge1xuICAgICAgICAgICAgdXJsOiAnL2FwcCcsXG4gICAgICAgICAgICBhYnN0cmFjdDogdHJ1ZSxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbWFpbi5odG1sJ1xuICAgICAgICB9KTtcblxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvaXNzdWVzJyk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHRyYW5zbGF0ZVByb3ZpZGVyKSB7XG5cbiAgICAkdHJhbnNsYXRlUHJvdmlkZXJcbiAgICAgICAgLnVzZVN0YXRpY0ZpbGVzTG9hZGVyKHtcbiAgICAgICAgICAgIHByZWZpeDogJ2xvY2FsZXMvJyxcbiAgICAgICAgICAgIHN1ZmZpeDogJy5qc29uJ1xuICAgICAgICB9KVxuICAgICAgICAucmVnaXN0ZXJBdmFpbGFibGVMYW5ndWFnZUtleXMoWydubCcsICdlbiddLCB7XG4gICAgICAgICAgICAnbmwnIDogJ25sJyxcbiAgICAgICAgICAgICdubF9OTCc6ICdubCcsXG4gICAgICAgICAgICAnZW4nOiAnZW4nLFxuICAgICAgICAgICAgJ2VuX1VTJzogJ2VuJyxcbiAgICAgICAgICAgICdlbl9VSyc6ICdlbidcbiAgICAgICAgfSlcbiAgICAgICAgLnByZWZlcnJlZExhbmd1YWdlKCdubCcpXG4gICAgICAgIC5mYWxsYmFja0xhbmd1YWdlKCdubCcpXG4gICAgICAgIC5kZXRlcm1pbmVQcmVmZXJyZWRMYW5ndWFnZSgpXG4gICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZVBhcmFtZXRlcnMnKVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwKSB7XG5cbiAgICAvLyBHb29nbGUgTWFwcyBvcHRpb25zXG4gICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHRpbWVvdXQ6IDEwMDAwLFxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcbiAgICB9O1xuXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxuICAgICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICBzaG93TWFwKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcblxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHpvb206IDE1LFxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcbiAgICAgICAgJHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xuXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXG4gICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIG1hcCBpcyBsb2FkZWRcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcblxuICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcbiAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYXRMbmdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkRpdCBpcyBlZW4gbWVsZGluZyFcIlxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3Blbigkc2NvcGUubWFwLCBtYXJrZXIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwLCBJc3N1ZXNGYWN0b3J5KSB7XG5cbiAgICB2YXIgaXNzdWVzID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZXMoKTtcblxuICAgIC8vIEdvb2dsZSBNYXBzIG9wdGlvbnNcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgdGltZW91dDogMTAwMDAsXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgIH07XG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxuICAgICRjb3Jkb3ZhR2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24ocG9zaXRpb24pe1xuICAgICAgICBzaG93TWFwKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxuICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICBmdW5jdGlvbiBzaG93TWFwKGxhdCwgbG5nKSB7XG4gICAgICAgIHZhciBsYXRMbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcblxuICAgICAgICAvLyBNYXAgb3B0aW9uc1xuICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHpvb206IDEyLFxuICAgICAgICAgICAgY2VudGVyOiBsYXRMbmcsXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcbiAgICAgICAgJHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xuXG4gICAgICAgIC8vIEdvb2dsZSBNYXBzXG4gICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIG1hcCBpcyBsb2FkZWRcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXJPbmNlKCRzY29wZS5tYXAsICdpZGxlJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpc3N1ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIHZhciBjb29yZGluYXRlcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoaXNzdWVzW2ldLmxhdGl0dWRlLCBpc3N1ZXNbaV0ubG9uZ2l0dWRlKTtcbiAgICAgICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0aW9uOiBnb29nbGUubWFwcy5BbmltYXRpb24uRFJPUCxcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGNvb3JkaW5hdGVzXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAgICc8aW1nIHNyYz1cIicgKyBpc3N1ZXNbaV0uZm90byArICdcIiB3aWR0aD1cIjEwMFwiLz4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj4nICsgaXNzdWVzW2ldLnRvZWxpY2h0aW5nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxicj48YSBocmVmPVwiLyMvYXBwL2lzc3Vlcy8nICsgaXNzdWVzW2ldLmlkICsgJ1wiPk1lbGRpbmc8L2E+ICdcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsJ2NsaWNrJywgKGZ1bmN0aW9uKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoY29udGVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgfSkobWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdykpO1xuXG4gICAgICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoJHNjb3BlLm1hcCwgJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbGF0TG5nOiAnICsgZXZlbnQubGF0TG5nLmxhdCgpICsgJywgJyArIGV2ZW50LmxhdExuZy5sbmcoKSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgfVxufTsiLCJ2YXIgbWFwTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFwJywgW10pO1xuXG5tYXBNb2R1bGUuY29udHJvbGxlcihcIklzc3VlTWFwQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5tYXAuY29udHJvbGxlci5qc1wiKSk7XG5tYXBNb2R1bGUuY29udHJvbGxlcignTWFwQ29udHJvbGxlcicsIHJlcXVpcmUoJy4vY29udHJvbGxlcnMvbWFwLmNvbnRyb2xsZXIuanMnKSk7XG5tYXBNb2R1bGUuZmFjdG9yeShcIklzc3Vlc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vLi4vaXNzdWVzL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XG5cbm1hcE1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFwLnJvdXRlcy5qc1wiKSk7XG5tb2R1bGUuZXhwb3J0cyA9IG1hcE1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgIC5zdGF0ZSgnYXBwLm1hcCcsIHtcbiAgICAgICAgICAgIHVybDogJy9tYXAnLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnbWFwJzoge1xuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvbWFwL3RlbXBsYXRlcy9tYXAuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXBDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICR0cmFuc2xhdGUsIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XG5cbiAgICAkc2NvcGUudG9rZW4gPSBBdXRob3JpemF0aW9uRmFjdG9yeS5nZXRBdXRoVG9rZW4oKTtcblxuICAgICRzY29wZS5zd2l0Y2hMYW5ndWFnZSA9IGZ1bmN0aW9uIChsYW5ndWFnZSkge1xuICAgICAgICAkdHJhbnNsYXRlLnVzZShsYW5ndWFnZSk7XG4gICAgfTtcblxufTtcbiIsInZhciBzZXR0aW5nc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLnNldHRpbmdzJywgW10pO1xuXG5zZXR0aW5nc01vZHVsZS5jb250cm9sbGVyKFwiU2V0dGluZ3NDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXJcIikpO1xuXG4vLyBzZXR0aW5nc01vZHVsZS5mYWN0b3J5KFwiU2V0dGluZ3NGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zZXR0aW5ncy5mYWN0b3J5XCIpKTtcblxuc2V0dGluZ3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3NldHRpbmdzLnJvdXRlc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0dGluZ3NNb2R1bGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xuICAkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnYXBwLnNldHRpbmdzJywge1xuICAgICAgdXJsOiAnL3NldHRpbmdzJyxcbiAgICAgIHZpZXdzOiB7XG4gICAgICAgICdzZXR0aW5ncyc6IHtcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvc2V0dGluZ3MvdGVtcGxhdGVzL3NldHRpbmdzLmh0bWwnLFxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdTZXR0aW5nc0NvbnRyb2xsZXInXG4gICAgICAgIH0sXG4gICAgICAgICAgJ2xvZ291dEBhcHAuc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hdXRob3JpemF0aW9uL3RlbXBsYXRlcy9sb2dvdXQuaHRtbCcsXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dvdXRDb250cm9sbGVyJ1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbn07XG4iXX0=
