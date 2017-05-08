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

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.$root.hideTabs = "tabs-hide";
        $scope.credentials = {
            "email": "",
            "password": ""
        };
    });

    $scope.login = function () {
        AuthorizationFactory.login($scope.credentials).then(function (data) {
            if (data) {
                AuthorizationFactory.setAuthToken(data);

                $state.go('app.settings');
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });

                $scope.$root.hideTabs = "";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9hdXRob3JpemF0aW9uLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL2F1dGhvcml6YXRpb24vYXV0aG9yaXphdGlvbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ291dC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9mYWN0b3JpZXMvYXV0aG9yaXphdGlvbi5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYXAvbWFwLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL3NldHRpbmdzL2NvbnRyb2xsZXJzL3NldHRpbmdzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2F1dGhvcml6YXRpb24ubW9kdWxlJyk7XG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvbWFwL21hcC5tb2R1bGUnKTtcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLm1vZHVsZS5qcycpO1xucmVxdWlyZSgnLi9jb21wb25lbnRzL3NldHRpbmdzL3NldHRpbmdzLm1vZHVsZScpO1xuXG5hbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbScsIFtcbiAgICAnaW9uaWMnLFxuICAgICduZ0NvcmRvdmEnLFxuICAgICduZ1N0b3JhZ2UnLFxuICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcbiAgICAnem9ubmVibG9lbS5tYWluJyxcbiAgICAnem9ubmVibG9lbS5hdXRob3JpemF0aW9uJyxcbiAgICAnem9ubmVibG9lbS5tYXAnLFxuICAgICd6b25uZWJsb2VtLmlzc3VlcycsXG4gICAgJ3pvbm5lYmxvZW0uc2V0dGluZ3MnXG5dKVxuXG4gICAgLnJ1bihmdW5jdGlvbiAoJGlvbmljUGxhdGZvcm0sICRzdGF0ZSwgQXV0aG9yaXphdGlvbkZhY3RvcnkpIHtcbiAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gSGlkZSB0aGUgYWNjZXNzb3J5IGJhciBieSBkZWZhdWx0IChyZW1vdmUgdGhpcyB0byBzaG93IHRoZSBhY2Nlc3NvcnkgYmFyIGFib3ZlIHRoZSBrZXlib2FyZFxuICAgICAgICAgICAgLy8gZm9yIGZvcm0gaW5wdXRzKVxuICAgICAgICAgICAgaWYgKHdpbmRvdy5LZXlib2FyZCkge1xuICAgICAgICAgICAgICAgIEtleWJvYXJkLmhpZGVGb3JtQWNjZXNzb3J5QmFyKHRydWUpO1xuICAgICAgICAgICAgICAgIEtleWJvYXJkLnNocmlua1ZpZXcodHJ1ZSk7XG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbGluZ0luU2hyaW5rVmlldyh0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcbiAgICAgICAgICAgICAgICBTdGF0dXNCYXIuc3R5bGVMaWdodENvbnRlbnQoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKEF1dGhvcml6YXRpb25GYWN0b3J5LmdldEF1dGhUb2tlbigpID09PSBudWxsIHx8IEF1dGhvcml6YXRpb25GYWN0b3J5LmdldEF1dGhUb2tlbigpID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiIsInZhciBhdXRob3JpemF0aW9uTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uYXV0aG9yaXphdGlvbicsIFtdKTtcblxuYXV0aG9yaXphdGlvbk1vZHVsZS5jb250cm9sbGVyKFwiTG9naW5Db250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2xvZ2luLmNvbnRyb2xsZXIuanNcIikpO1xuYXV0aG9yaXphdGlvbk1vZHVsZS5jb250cm9sbGVyKFwiTG9nb3V0Q29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9sb2dvdXQuY29udHJvbGxlci5qc1wiKSk7XG5cbmF1dGhvcml6YXRpb25Nb2R1bGUuZmFjdG9yeShcIkF1dGhvcml6YXRpb25GYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9hdXRob3JpemF0aW9uLmZhY3RvcnkuanNcIikpO1xuXG5hdXRob3JpemF0aW9uTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9hdXRob3JpemF0aW9uLnJvdXRlcy5qc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0aG9yaXphdGlvbk1vZHVsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XG4gICAgICAgICAgICB1cmw6ICcvbG9naW4nLFxuICAgICAgICAgICAgdmlld3M6IHtcbiAgICAgICAgICAgICAgICAnc2V0dGluZ3MnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9hdXRob3JpemF0aW9uL3RlbXBsYXRlcy9sb2dpbi5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ2luQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZSwgJHNjb3BlLCAkaW9uaWNIaXN0b3J5LCBBdXRob3JpemF0aW9uRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVFbnRlcicsIGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS4kcm9vdC5oaWRlVGFicyA9IFwidGFicy1oaWRlXCI7XG4gICAgICAgICRzY29wZS5jcmVkZW50aWFscyA9IHtcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcbiAgICAgICAgICAgIFwicGFzc3dvcmRcIjogXCJcIlxuICAgICAgICB9O1xuICAgIH0pO1xuXG4gICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5sb2dpbigkc2NvcGUuY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgQXV0aG9yaXphdGlvbkZhY3Rvcnkuc2V0QXV0aFRva2VuKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAuc2V0dGluZ3MnKTtcbiAgICAgICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkubmV4dFZpZXdPcHRpb25zKHtcbiAgICAgICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICRzY29wZS4kcm9vdC5oaWRlVGFicyA9IFwiXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGUsICRzY29wZSwgJGlvbmljSGlzdG9yeSwgQXV0aG9yaXphdGlvbkZhY3RvcnkpIHtcblxuICAgICRzY29wZS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5jbGVhclVzZXIoKTtcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb25GYWN0b3J5LmNsZWFyQXV0aFRva2VuKCk7XG5cbiAgICAgICAgICAgICRzdGF0ZS5nbygnYXBwLmxvZ2luJyk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckNhY2hlKCk7XG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5Lm5leHRWaWV3T3B0aW9ucyh7XG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChob3N0bmFtZSwgJGh0dHAsICRsb2NhbFN0b3JhZ2UsICRpb25pY1BvcHVwLCAkdHJhbnNsYXRlKSB7XG5cbiAgICBmdW5jdGlvbiBsb2dpbihjcmVkZW50aWFscykge1xuICAgICAgICByZXR1cm4gJGh0dHAucG9zdChob3N0bmFtZSArIFwiL2xvZ2luXCIsIEpTT04uc3RyaW5naWZ5KGNyZWRlbnRpYWxzKSwge2hlYWRlcnM6IHsnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nfX0pXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhdHVzKTtcbiAgICAgICAgICAgICAgICBzaG93QWxlcnQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVzZXIoKSB7XG4gICAgICAgIHJldHVybiAkbG9jYWxTdG9yYWdlLnVzZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VXNlcih1c2VyKSB7XG4gICAgICAgICRsb2NhbFN0b3JhZ2UudXNlciA9IHVzZXI7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJVc2VyKCkge1xuICAgICAgICBkZWxldGUgJGxvY2FsU3RvcmFnZS51c2VyO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFVzZXJuYW1lKCkge1xuICAgICAgICBpZiAoJGxvY2FsU3RvcmFnZS51c2VyKSB7XG4gICAgICAgICAgICByZXR1cm4gJGxvY2FsU3RvcmFnZS51c2VyLmxvY2FsLnVzZXJuYW1lO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0QXV0aFRva2VuKCkge1xuICAgICAgICByZXR1cm4gJGxvY2FsU3RvcmFnZS5hdXRoVG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QXV0aFRva2VuKHRva2VuKSB7XG4gICAgICAgICRsb2NhbFN0b3JhZ2UuYXV0aFRva2VuID0gdG9rZW47XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2xlYXJBdXRoVG9rZW4oKSB7XG4gICAgICAgIGRlbGV0ZSAkbG9jYWxTdG9yYWdlLmF1dGhUb2tlbjtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93QWxlcnQoKSB7XG4gICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcbiAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0xPR0lOX0VSUk9SX1RJVExFJyksXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdMT0dJTl9FUlJPUl9FWFBMQU5BVElPTicpLFxuICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0xPR0lOX0VSUk9SX0FDQ0VQVCcpXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgICAgLypsb2dvdXQ6IGxvZ291dCwqL1xuICAgICAgICBnZXRVc2VyOiBnZXRVc2VyLFxuICAgICAgICBzZXRVc2VyOiBzZXRVc2VyLFxuICAgICAgICBjbGVhclVzZXI6IGNsZWFyVXNlcixcbiAgICAgICAgZ2V0VXNlcm5hbWU6IGdldFVzZXJuYW1lLFxuICAgICAgICBnZXRBdXRoVG9rZW46IGdldEF1dGhUb2tlbixcbiAgICAgICAgc2V0QXV0aFRva2VuOiBzZXRBdXRoVG9rZW4sXG4gICAgICAgIGNsZWFyQXV0aFRva2VuOiBjbGVhckF1dGhUb2tlblxuICAgIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgSXNzdWVzRmFjdG9yeSkge1xuXG4gICAgJHNjb3BlLmlzc3VlID0gSXNzdWVzRmFjdG9yeS5nZXRJc3N1ZSgkc3RhdGVQYXJhbXMuaXNzdWVJZCk7XG5cbiAgICAvKlJlcG9ydHNGYWN0b3J5LmdldFJlcG9ydCgkc3RhdGVQYXJhbXMucmVwb3J0SWQpLnRoZW4oZnVuY3Rpb24gKHJlcG9ydCkge1xuICAgICAgICAkc2NvcGUucmVwb3J0ID0gcmVwb3J0O1xuICAgIH0pOyovXG5cbiAgICAkc2NvcGUuYWRkUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSB0cnVlO1xuICAgIH07XG5cbiAgICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcbiAgICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgSXNzdWVzRmFjdG9yeSkge1xuXG4gICRzY29wZS5pc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xuXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xuICAgICAgJHNjb3BlLmlzc3VlcyA9IGlzc3VlcztcbiAgfSkqL1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGlzc3VlcyA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6IDAsXG4gICAgICAgICAgICBzdHJhYXQ6IFwiWm9yZ3ZsaWV0c3RyYWF0XCIsXG4gICAgICAgICAgICBodWlzbnVtbWVyOiA0OTEsXG4gICAgICAgICAgICBwb3N0Y29kZTogXCI0ODM0IE5IXCIsXG4gICAgICAgICAgICBwbGFhdHM6IFwiQnJlZGFcIixcbiAgICAgICAgICAgIHRvZWxpY2h0aW5nOiBcIlRlIGhvZ2Ugc3RvZXByYW5kXCIsXG4gICAgICAgICAgICBmb3RvOiBcImltZy9sb2NhdGllLnBuZ1wiLFxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDItMjBcIixcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBudWxsLFxuICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjU3MzQzOCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogNC44MTI3NzNcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWQ6IDEsXG4gICAgICAgICAgICBzdHJhYXQ6IFwiQ2hhc3NldmVsZFwiLFxuICAgICAgICAgICAgaHVpc251bW1lcjogbnVsbCxcbiAgICAgICAgICAgIHBvc3Rjb2RlOiBcIjQ4MTEgREhcIixcbiAgICAgICAgICAgIHBsYWF0czogXCJCcmVkYVwiLFxuICAgICAgICAgICAgdG9lbGljaHRpbmc6IFwiSGVrIG9wIGRlIHN0b2VwXCIsXG4gICAgICAgICAgICBmb3RvOiBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiLFxuICAgICAgICAgICAgZGF0dW1fZ2VtZWxkOiBcIjIwMTctMDEtMDRcIixcbiAgICAgICAgICAgIGRhdHVtX29wZ2Vsb3N0OiBcIjIwMTctMDItMTVcIixcbiAgICAgICAgICAgIGxhdGl0dWRlOiA1MS41ODg4NzUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IDQuNzg1NjYzXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgZnVuY3Rpb24gZ2V0SXNzdWVzKCkge1xuICAgICAgICByZXR1cm4gaXNzdWVzO1xuXG4gICAgICAgIC8qcmV0dXJuICRodHRwLmdldChcIkhJRVIgS09NVCBERSBMSU5LIE5BQVIgREUgQVBJXCIpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xuICAgICAgICAgICAgcmV0dXJuIGlzc3VlcztcbiAgICAgICAgfSk7Ki9cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRJc3N1ZShpc3N1ZUlkKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXNzdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpc3N1ZXNbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XG4gICAgICAgICAgICByZXR1cm4gcmVwb3J0O1xuICAgICAgICB9KTsqL1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIGdldElzc3VlczogZ2V0SXNzdWVzLFxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWVcbiAgICB9O1xufTtcbiIsInZhciBpc3N1ZXNNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5pc3N1ZXMnLCBbXSk7XG5cbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5jb250cm9sbGVyLmpzXCIpKTtcblxuaXNzdWVzTW9kdWxlLmZhY3RvcnkoXCJJc3N1ZXNGYWN0b3J5XCIsIHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XG5cbmlzc3Vlc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vaXNzdWVzLnJvdXRlcy5qc1wiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNzdWVzTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzJywge1xuICAgICAgICAgICAgdXJsOiAnL2lzc3VlcycsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdpc3N1ZXMnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3Vlc0NvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5hZGQnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ21hcEBhcHAuaXNzdWVzLmFkZCc6IHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvaXNzdWUubWFwLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVNYXBDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5hZGQuaHRtbCcsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZUNvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgICAgIC5zdGF0ZSgnYXBwLmlzc3Vlcy5kZXRhaWxzJywge1xuICAgICAgICAgICAgdXJsOiAnLzppc3N1ZUlkJyxcbiAgICAgICAgICAgIHZpZXdzOiB7XG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9pc3N1ZXMvdGVtcGxhdGVzL2lzc3Vlcy5kZXRhaWxzLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG59O1xuIiwidmFyIG1haW5Nb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYWluJywgW10pO1xuXG5tYWluTW9kdWxlLnZhbHVlKCdob3N0bmFtZScsIFwiaHR0cHM6Ly96Yi1hcGkuaGVyb2t1YXBwLmNvbVwiKTtcblxubWFpbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFpbi5yb3V0ZXNcIikpO1xubWFpbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFpbi50cmFuc2xhdGlvblwiKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gbWFpbk1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAnLCB7XG4gICAgICAgICAgICB1cmw6ICcvYXBwJyxcbiAgICAgICAgICAgIGFic3RyYWN0OiB0cnVlLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnXG4gICAgICAgIH0pO1xuXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2FwcC9pc3N1ZXMnKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdHJhbnNsYXRlUHJvdmlkZXIpIHtcblxuICAgICR0cmFuc2xhdGVQcm92aWRlclxuICAgICAgICAudXNlU3RhdGljRmlsZXNMb2FkZXIoe1xuICAgICAgICAgICAgcHJlZml4OiAnbG9jYWxlcy8nLFxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXG4gICAgICAgIH0pXG4gICAgICAgIC5yZWdpc3RlckF2YWlsYWJsZUxhbmd1YWdlS2V5cyhbJ25sJywgJ2VuJ10sIHtcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxuICAgICAgICAgICAgJ25sX05MJzogJ25sJyxcbiAgICAgICAgICAgICdlbic6ICdlbicsXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxuICAgICAgICAgICAgJ2VuX1VLJzogJ2VuJ1xuICAgICAgICB9KVxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmZhbGxiYWNrTGFuZ3VhZ2UoJ25sJylcbiAgICAgICAgLmRldGVybWluZVByZWZlcnJlZExhbmd1YWdlKClcbiAgICAgICAgLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlUGFyYW1ldGVycycpXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJGNvcmRvdmFHZW9sb2NhdGlvbiwgJGlvbmljUG9wdXApIHtcblxuICAgIC8vIEdvb2dsZSBNYXBzIG9wdGlvbnNcbiAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgdGltZW91dDogMTAwMDAsXG4gICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZVxuICAgIH07XG5cbiAgICAvLyBTZXRzIG1hcCB0byBjdXJyZW50IGxvY2F0aW9uXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xuXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgem9vbTogMTUsXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXAgZWxlbWVudFxuICAgICAgICAkc2NvcGUubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XG5cbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxuICAgICAgICAvLyBTZXRzIGEgcG9wdXAgd2luZG93IHdoZW4gdGhlIHVzZXIgdGFwcyBhIG1hcmtlclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAkc2NvcGUuaGlkZVNwaW5uZXIgPSB0cnVlO1xuXG4gICAgICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXG4gICAgICAgICAgICAgICAgcG9zaXRpb246IGxhdExuZ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IFwiRGl0IGlzIGVlbiBtZWxkaW5nIVwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KTtcbiAgICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJGNvcmRvdmFHZW9sb2NhdGlvbiwgJGlvbmljUG9wdXAsIElzc3Vlc0ZhY3RvcnkpIHtcblxuICAgIHZhciBpc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xuXG4gICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xuICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXG4gICAgfTtcbiAgICAvLyBTZXRzIG1hcCB0byBjdXJyZW50IGxvY2F0aW9uXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcbiAgICB9LCBmdW5jdGlvbihlcnJvcil7XG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcbiAgICAgICAgdmFyIGFsZXJ0UG9wdXAgPSAkaW9uaWNQb3B1cC5hbGVydCh7XG4gICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcbiAgICAgICAgdmFyIGxhdExuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobGF0LCBsbmcpO1xuXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXG4gICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgem9vbTogMTIsXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBNYXAgZWxlbWVudFxuICAgICAgICAkc2NvcGUubWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XG5cbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcbiAgICAgICAgLy8gV2FpdCB1bnRpbCB0aGUgbWFwIGlzIGxvYWRlZFxuICAgICAgICAvLyBTZXRzIGEgcG9wdXAgd2luZG93IHdoZW4gdGhlIHVzZXIgdGFwcyBhIG1hcmtlclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAkc2NvcGUuaGlkZVNwaW5uZXIgPSB0cnVlO1xuICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpc3N1ZXNbaV0ubGF0aXR1ZGUsIGlzc3Vlc1tpXS5sb25naXR1ZGUpO1xuICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgbWFwOiAkc2NvcGUubWFwLFxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogY29vcmRpbmF0ZXNcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcbiAgICAgICAgICAgICAgICB2YXIgY29udGVudCA9ICAgJzxpbWcgc3JjPVwiJyArIGlzc3Vlc1tpXS5mb3RvICsgJ1wiIHdpZHRoPVwiMTAwXCIvPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPicgKyBpc3N1ZXNbaV0udG9lbGljaHRpbmcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPjxhIGhyZWY9XCIvIy9hcHAvaXNzdWVzLycgKyBpc3N1ZXNbaV0uaWQgKyAnXCI+TWVsZGluZzwvYT4gJ1xuICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwnY2xpY2snLCAoZnVuY3Rpb24obWFya2VyLGNvbnRlbnQsaW5mb1dpbmRvdyl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChjb250ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsbWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICB9KShtYXJrZXIsY29udGVudCxpbmZvV2luZG93KSk7XG5cbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcigkc2NvcGUubWFwLCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsYXRMbmc6ICcgKyBldmVudC5sYXRMbmcubGF0KCkgKyAnLCAnICsgZXZlbnQubGF0TG5nLmxuZygpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICB9XG59OyIsInZhciBtYXBNb2R1bGUgPSBhbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbS5tYXAnLCBbXSk7XG5cbm1hcE1vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVNYXBDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzXCIpKTtcbm1hcE1vZHVsZS5jb250cm9sbGVyKCdNYXBDb250cm9sbGVyJywgcmVxdWlyZSgnLi9jb250cm9sbGVycy9tYXAuY29udHJvbGxlci5qcycpKTtcbm1hcE1vZHVsZS5mYWN0b3J5KFwiSXNzdWVzRmFjdG9yeVwiLCByZXF1aXJlKFwiLi8uLi9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzXCIpKTtcblxubWFwTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYXAucm91dGVzLmpzXCIpKTtcbm1vZHVsZS5leHBvcnRzID0gbWFwTW9kdWxlOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdhcHAubWFwJywge1xuICAgICAgICAgICAgdXJsOiAnL21hcCcsXG4gICAgICAgICAgICB2aWV3czoge1xuICAgICAgICAgICAgICAgICdtYXAnOiB7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9tYXAvdGVtcGxhdGVzL21hcC5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ01hcENvbnRyb2xsZXInXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHRyYW5zbGF0ZSwgQXV0aG9yaXphdGlvbkZhY3RvcnkpIHtcblxuICAgICRzY29wZS50b2tlbiA9IEF1dGhvcml6YXRpb25GYWN0b3J5LmdldEF1dGhUb2tlbigpO1xuXG4gICAgJHNjb3BlLnN3aXRjaExhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlKSB7XG4gICAgICAgICR0cmFuc2xhdGUudXNlKGxhbmd1YWdlKTtcbiAgICB9O1xuXG59O1xuIiwidmFyIHNldHRpbmdzTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uc2V0dGluZ3MnLCBbXSk7XG5cbnNldHRpbmdzTW9kdWxlLmNvbnRyb2xsZXIoXCJTZXR0aW5nc0NvbnRyb2xsZXJcIiwgcmVxdWlyZShcIi4vY29udHJvbGxlcnMvc2V0dGluZ3MuY29udHJvbGxlclwiKSk7XG5cbi8vIHNldHRpbmdzTW9kdWxlLmZhY3RvcnkoXCJTZXR0aW5nc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL3NldHRpbmdzLmZhY3RvcnlcIikpO1xuXG5zZXR0aW5nc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vc2V0dGluZ3Mucm91dGVzXCIpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBzZXR0aW5nc01vZHVsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzdGF0ZVByb3ZpZGVyKSB7XG4gICRzdGF0ZVByb3ZpZGVyXG4gICAgLnN0YXRlKCdhcHAuc2V0dGluZ3MnLCB7XG4gICAgICB1cmw6ICcvc2V0dGluZ3MnLFxuICAgICAgdmlld3M6IHtcbiAgICAgICAgJ3NldHRpbmdzJzoge1xuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnY29tcG9uZW50cy9zZXR0aW5ncy90ZW1wbGF0ZXMvc2V0dGluZ3MuaHRtbCcsXG4gICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ29udHJvbGxlcidcbiAgICAgICAgfSxcbiAgICAgICAgICAnbG9nb3V0QGFwcC5zZXR0aW5ncyc6IHtcbiAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2F1dGhvcml6YXRpb24vdGVtcGxhdGVzL2xvZ291dC5odG1sJyxcbiAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0xvZ291dENvbnRyb2xsZXInXG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xufTtcbiJdfQ==
