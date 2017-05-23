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

},{"./components/authorization/authorization.module":2,"./components/issues/issues.module.js":11,"./components/main/main.module":13,"./components/map/map.module":19,"./components/settings/settings.module":23}],2:[function(require,module,exports){
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
        $scope.$root.hideTabs = "login-header";
        $scope.credentials = {
            "email": "",
            "password": ""
        };
    });

    $scope.login = function () {
        AuthorizationFactory.login($scope.credentials).then(function (data) {
            if (data) {
                AuthorizationFactory.setAuthToken(data.token);

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

    $scope.token = AuthorizationFactory.getAuthToken();

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
module.exports = function ($scope, $rootScope, $state, $stateParams, IssuesFactory, $cordovaCamera, $ionicPopup, $translate) {

    $scope.photoPath = "";
    $scope.showPhoto = false;
    $scope.issue = {
        street : "",
        city : "",
        postalCode : "",
        description : "",
        lat : "",
        lng : ""
    };

    $rootScope.$on('addressLoadedEvent', function (event, data) {
        console.log('Triggered: addressLoadedEvent');
        $scope.issue.street = data.street;
        $scope.issue.city = data.city;
        $scope.issue.postalCode = data.postalCode;
        $scope.issue.lat = data.lat;
        $scope.issue.lng = data.lng;
        $scope.$apply();
        console.log(data); // 'Data to send'
    });

    
    $scope.takePhoto = function(){
        console.log('Opening camera');

        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.photo = "data:image/jpeg;base64," + imageData;
            $scope.showPhoto = true;

        }, function(err) {
        // error
        });

        // var srcType = Camera.PictureSourceType.CAMERA;
        // var options = setOptions(srcType);

        // navigator.camera.getPicture(function cameraSuccess(imageUri) {

        //     $scope.photo = imageUri;
        //     $scope.showPhoto = true;
        //     $scope.$apply();
            
        //     // You may choose to copy the picture, save it somewhere, or upload.
        //     createNewFileEntry(imageUri);

        // }, function cameraError(error) {
        //     $ionicPopup.alert({
        //         title: $translate.instant('ISSUES_ADD_PHOTO_ERROR_TITLE'),
        //         template: $translate.instant('ISSUES_ADD_PHOTO_ERROR_EXPLANATION'),
        //         okText: $translate.instant('ISSUES_ADD_PHOTO_ERROR_ACCEPT')
        //     });

        //     console.log("Unable to obtain picture: " + error);

        // }, options);

    };

    $scope.addPhotoFromGallery = function () {
        console.log('Opening gallery');
        
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            $scope.photo = imageUri;
            $scope.showPhoto = true;
            $scope.$apply();

            // You may choose to copy the picture, save it somewhere, or upload.
            createNewFileEntry(imageUri);

        }, function cameraError(error) {
            $ionicPopup.alert({
                title: $translate.instant('ISSUES_ADD_PHOTO_ERROR_TITLE'),
                template: $translate.instant('ISSUES_ADD_PHOTO_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUES_ADD_PHOTO_ERROR_ACCEPT')
            });

            console.log("Unable to obtain picture: " + error);

        }, options);
        
    };

    $scope.saveIssue = function () {
        console.log('Saving issue');

        var issue = {
            street : $scope.issue.street,
            city : $scope.issue.city,
            postalCode : $scope.issue.postalCode,
            description : $scope.issue.description,
            photoPath : "",
            lat : $scope.issue.lat,
            lng : $scope.issue.lng
        };
        if($scope.photoPath !== ""){
            issue.photoPath = $scope.photoPath;
        }
        console.log('Posting issue to factory');
        console.log(issue);
        IssuesFactory.postIssue(issue);
    };

    $scope.removePhoto = function () {
        $scope.photo = null;
        $scope.showPhoto = false;
    };

    // Get a FileEntry Object 
    function getFileEntry(imgUri) {
        window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
            // Do something with the FileEntry object, like write to it, upload it, etc.
            // writeFile(fileEntry, imgUri);
            console.log("got file: " + fileEntry.fullPath);
            // displayFileData(fileEntry.nativeURL, "Native URL");

        }, function () {
            // If don't get the FileEntry (which may happen when testing
            // on some emulators), copy to a new FileEntry.
            createNewFileEntry(imgUri);
            });
    }
    function createNewFileEntry(imgUri) {
        window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function success(dirEntry) {

            // JPEG file
            dirEntry.getFile("tempFile.jpeg", { create: true, exclusive: false }, function (fileEntry) {

                // Do something with it, like write to it, upload it, etc.
                // writeFile(fileEntry, imgUri);
                console.log("got file: " + fileEntry.fullPath);
                // displayFileData(fileEntry.fullPath, "File copied to");

            }, onErrorCreateFile);

        }, onErrorResolveUrl);
    }
    function setOptions(srcType) {
        var options = {
            // Some common settings are 20, 50, and 100
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            allowEdit: false,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            saveToPhotoAlbum: true,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }

};

},{}],8:[function(require,module,exports){
module.exports = function ($scope, $state, $stateParams, IssuesFactory) {

    $scope.issue = IssuesFactory.getIssue($stateParams.issueId);

    /*ReportsFactory.getReport($stateParams.reportId).then(function (report) {
        $scope.report = report;
    });*/


};

},{}],9:[function(require,module,exports){
module.exports = function ($scope, IssuesFactory) {

  $scope.issues = IssuesFactory.getIssues();
  
  IssuesFactory.getIssues().then(function(issues) {
        $scope.issues = issues;
    });

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};
},{}],10:[function(require,module,exports){
module.exports = function (hostname, $http, AuthorizationFactory, $ionicPopup, $translate, $cordovaFileTransfer) {
    var token = AuthorizationFactory.getAuthToken();

    function getIssues() {
        return $http.get(hostname + "/issues", { headers: { 'bearer': token } } ).then(function (response) {
			
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

    function postIssue(issue) {
        console.log('Token: ' + token);
        if(issue.street === "" || issue.city === "" || issue.postalCode === "" || issue.lat === "" || issue.lng === ""){
            console.error('Not all required issue properties are set');
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else if (issue.description === "") {
            console.error('Missing the description');
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_ACCEPT')
            });
        } else {
            return $http.post(hostname + "/issues", {
                data: {    
                    'streetName': issue.street,
                    'place': issue.city,
                    'postalCode': issue.postalCode,
                    'description': issue.description,
                    'latitude': issue.lat,
                    'longitude': issue.lng
                }}, { 
                    headers: { 
                        'bearer': token 
            }}).then(function (response) {
                console.log('API SUCCESS RESPONSE');
                console.log(response.data);

                if(issue.photoPath !== ""){
                    console.log('photoPath: ' + issue.photoPath);
                    
                    if(response.data._id !== null){
                        //Variables for file transfer
                        var server = "plaats hier de server URL";
                        var targetPath = issue.photoPath;
                        var trustHosts = true;
                        var options = {};
                        options.fileName = "hier komt de bestandsnaam";

                        $cordovaFileTransfer.upload(server, targetPath, options, trustAllHosts)
                            .then(function(result) {
                                // Success!
                                console.log("FILETRANSFER SUCCESS" );
                                console.log(result);

                                $ionicPopup.alert({
                                    title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                                    template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                                    okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                                });
                            }, function(err) {
                                // Error
                                console.log("FILETRANSFER ERROR" );
                                console.error(err);

                                $ionicPopup.alert({
                                    title: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_TITLE'),
                                    template: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_EXPLANATION'),
                                    okText: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_ACCEPT')
                                });
                            }, function (progress) {
                                // constant progress updates
                                console.log("FILETRANSFER PROGRESS");
                                console.log(progress);
                        });
                    } else {
                        console.log("Response from API had no issue _id");
                        $ionicPopup.alert({
                            title: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_TITLE'),
                            template: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_EXPLANATION'),
                            okText: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_ACCEPT')
                        });
                    }

                    
                } else {
                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                        template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                    });
                }

                return response.data;
            }, function(error) {
                $ionicPopup.alert({
                    title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                    template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                    okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
                });
                console.log('API ERROR RESPONSE');
                console.log(error);
            });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};
},{}],11:[function(require,module,exports){
var issuesModule = angular.module('zonnebloem.issues', []);

issuesModule.controller("IssuesController", require("./controllers/issues.controller.js"));
issuesModule.controller("IssueController", require("./controllers/issue.controller.js"));
issuesModule.controller("IssueAddController", require("./controllers/issue.add.controller.js"));

issuesModule.factory("IssuesFactory", require("./factories/issues.factory.js"));

issuesModule.config(require("./issues.routes.js"));

module.exports = issuesModule;
},{"./controllers/issue.add.controller.js":7,"./controllers/issue.controller.js":8,"./controllers/issues.controller.js":9,"./factories/issues.factory.js":10,"./issues.routes.js":12}],12:[function(require,module,exports){
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
                    controller: 'IssueAddController'
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

},{}],13:[function(require,module,exports){
var mainModule = angular.module('zonnebloem.main', []);

mainModule.value('hostname', "https://zb-api.herokuapp.com");

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;
},{"./main.routes":14,"./main.translation":15}],14:[function(require,module,exports){
module.exports = function ($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'main.html'
        });

    $urlRouterProvider.otherwise('/app/issues');
};

},{}],15:[function(require,module,exports){
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
},{}],16:[function(require,module,exports){
module.exports = function ($scope, $rootScope, $cordovaGeolocation, $ionicPopup) {

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
            template: 'We kunnen helaas uw huidige locatie niet ophalen. Zet uw locatie service aan.'
        });
        //TODO promt voor het aanzetten van locatie service
    });


    function showMap(lat, lng) {
        var latLng = new google.maps.LatLng(lat, lng);

        // Map options
        var mapOptions = {
            zoom: 9,
            center: latLng,
            disableDefaultUI: true
        };

        // Map element
        var map = new google.maps.Map(document.getElementById("map"), mapOptions);
        $scope.map = map;

        // Variables needed to get the address
        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        getCurrentAddress(geocoder, map, infowindow, latLng, lat, lng);

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

    function getCurrentAddress(geocoder, map, infowindow, latLng, lat, lng) {
        console.log("Getting current address");

        geocoder.geocode({'location': latLng}, function (results, status) {
            console.log("GEOCODER RESPONSE: " + status);
            console.log("RESULTS");
            console.log(results);
            if (status === 'OK') {
                if (results[0]) {
                    map.setZoom(17);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });
                    infowindow.setContent(results[0].formatted_address);
                    infowindow.open(map, marker);

                    // variables for forLoops
                    var i = 0;
                    var o = 0;

                    // Getting street
                    var street = "";
                    var streetFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "route") {
                                streetFound = true;
                                street = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!streetFound){
                        street = "Niet gevonden";
                    } 

                    // Getting city
                    var city = "";
                    var cityFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "locality") {
                                cityFound = true;
                                city = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!cityFound){
                        city = "Niet gevonden";
                    }

                    // Getting postal code
                    var postalCode = "";
                    var postalCodeFound = false;
                    for (o = 0; o < results[0].address_components.length; o++) {
                        for (i = 0; i < results[0].address_components[o].types.length; i++) {
                            if (results[0].address_components[o].types[i] === "postal_code" || results[0].address_components[o].types[i] === "postal_code_prefix") {
                                postalCodeFound = true;
                                postalCode = results[0].address_components[o].long_name;
                                break;
                            }
                        }
                    }
                    if(!postalCodeFound){
                        postalCode = "Niet gevonden";
                    }

         
                    console.log('Broadcasting: addressLoadedEvent');
                    // Broadcast address loaded
                    $rootScope.$broadcast('addressLoadedEvent', {
                        street: street,
                        city: city,
                        postalCode: postalCode,
                        lng: lng,
                        lat: lat
                    });


                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Geen adres gevonden.',
                        template: 'We kunnen helaas uw huidige adres niet vinden. Raadpleeg a.u.b. de beeherder.'
                    });
                }
            } else {
                var errorPopup = $ionicPopup.alert({
                    title: 'Fout bij het ophalen van het adres.',
                    template: 'We kunnen helaas uw huidige adres niet vinden. Raadpleeg a.u.b. de beeherder.'
                });
            }
        });
    }
};
},{}],17:[function(require,module,exports){
module.exports = function ($scope, $cordovaGeolocation, $ionicPopup, IssuesFactory, RoutesWalkedFactory) {

    var issues = IssuesFactory.getIssues();
    var routesWalked = RoutesWalkedFactory.getRoutesWalked();
    var gpsEnabled = false;
    var timer = undefined;
    var routeWalked = [];
    var dirService = new google.maps.DirectionsService();

    var test = true;
    var testLat;
    var testLng;

    // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };
    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
        gpsEnabled = true;
        testLat = position.coords.latitude;
        testLng = position.coords.longitude;
        showMap(position.coords.latitude, position.coords.longitude);
    }, function(error){
        // Show Could not get location alert dialog
        gpsEnabled = false;
        var alertPopup = $ionicPopup.alert({
            title: 'Geen locatie',
            template: 'We kunnen helaas uw huidige locatie niet ophalen'
        });

        testLat = 51.688420;
        testLng = 5.287392;
        showMap(51.688420, 5.287392);
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

                    testLat = event.latLng.lat();
                    testLng = event.latLng.lng();
                });
            }

            //Add routes walked
            for(var j = 0; j < routesWalked.length; j++){
                for(var i = 0; i < routesWalked[j].waypoints.length; i++){
                    if(i > 0){
                        var origin = new google.maps.LatLng(routesWalked[j].waypoints[i-1].latitude, routesWalked[j].waypoints[i-1].longitude);
                        var destination = new google.maps.LatLng(routesWalked[j].waypoints[i].latitude, routesWalked[j].waypoints[i].longitude);
                        renderRoute(origin, destination, 'green');
                    }
                }
            }

        });
    }

    $scope.walkRoute = function(){
        if(typeof timer == 'undefined'){
            if(gpsEnabled){
                if(typeof timer == 'undefined'){
                    console.log('start route');
                    timer = setInterval(updateRoute, 3000);
                    document.getElementById("route-button").innerHTML = "Stop route";
                }
            }
            else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Geen locatie',
                    template: 'We kunnen helaas uw huidige locatie niet ophalen'
                });
            }
        }
        else{

            var popup = $ionicPopup.confirm({
                title: "Route stoppen",
                template: "Wilt u deze route opslaan?"
            })

            popup.then(function (res) {
                if(res){
                    console.log('end route');
                    clearInterval(timer);
                    timer = undefined;
                    document.getElementById("route-button").innerHTML = "Start route";

                    routesWalked.push(routeWalked);
                }
                else{

                }
            })
        }
    };

    function updateRoute(){
        if(test){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].lat(), routeWalked[routeWalked.length-1].lng(), testLat, testLng) > 20){
                    routeWalked.push(
                        new google.maps.LatLng(testLat, testLng)
                    );
                }
            }
            else{
                routeWalked.push(
                    new google.maps.LatLng(testLat, testLng)
                );
            }
            var pos = new google.maps.LatLng(testLat, testLng);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                renderRoute(routeWalked[routeWalked.length-2], routeWalked[routeWalked.length-1], 'blue');
            }
            console.log(routeWalked);

            return;
        }

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){
            if(routeWalked.length > 0){
                if(measure(routeWalked[routeWalked.length-1].lat(), routeWalked[routeWalked.length-1].lng(), position.coords.latitude, position.coords.longitude) > 20){
                    routeWalked.push(
                        new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                    );
                }
            }
            else{
                routeWalked.push(
                    new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
                );
            }
            var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $scope.map.setCenter(pos);

            //update route
            if(routeWalked.length > 1){
                renderRoute(routeWalked[routeWalked.length-2], routeWalked[routeWalked.length-1], 'blue');
            }
            console.log(routeWalked);

        }, function(error){
            // Show Could not get location alert dialog
            gpsEnabled = false;
            var alertPopup = $ionicPopup.alert({
                title: 'Geen locatie',
                template: 'We kunnen helaas uw huidige locatie niet ophalen'
            });

            clearInterval(timer);
        });
    }

    function measure(lat1, lon1, lat2, lon2){
        var R = 6378.137; // Radius of earth in KM
        var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
        var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d * 1000; // meters
    }

    function renderRoute(origin, destination, color){
        if(typeof color == 'undefined'){ color = 'green'; }

        var polylineOptions = {
            strokeColor: color,
            strokeOpacity: 1,
            strokeWeight: 4
        };

        var request = {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.WALKING
        };
        dirService.route(request, function(response, status){
            if(status == google.maps.DirectionsStatus.OK){
                var legs = response.routes[0].legs;
                for (i = 0; i < legs.length; i++){
                    var steps = legs[i].steps;
                    for (j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        var stepPolyline = new google.maps.Polyline(polylineOptions);
                        for (k = 0; k < nextSegment.length; k++) {
                            stepPolyline.getPath().push(nextSegment[k]);
                        }
                        stepPolyline.setMap($scope.map);
                    }
                }
            }
        });
    }
};
},{}],18:[function(require,module,exports){
module.exports = function () {
    var routesWalked = [
        {
            userId: "1",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.688513,
                    longitude: 5.287445
                },
                {
                    latitude: 51.689298,
                    longitude: 5.287756
                },
                {
                    latitude: 51.689604,
                    longitude: 5.286731
                },
                {
                    latitude: 51.690953,
                    longitude: 5.287195
                }
            ]
        },
        {
            userId: "2",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.686144,
                    longitude: 5.289735
                },
                {
                    latitude: 51.685944,
                    longitude: 5.290808
                },
                {
                    latitude: 51.688418,
                    longitude: 5.291827
                },
                {
                    latitude: 51.688591,
                    longitude: 5.290808
                },
                {
                    latitude: 51.689249,
                    longitude: 5.291001
                }
            ]
        }
    ];

    function getRoutesWalked() {
        return routesWalked;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (routesWalked) {
         return routesWalked;
         });*/
    }

    return {
        getRoutesWalked: getRoutesWalked
    };
};

},{}],19:[function(require,module,exports){
var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));
mapModule.factory("RoutesWalkedFactory", require("./factories/routesWalked.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;
},{"./../issues/factories/issues.factory.js":10,"./controllers/issue.map.controller.js":16,"./controllers/map.controller.js":17,"./factories/routesWalked.factory.js":18,"./map.routes.js":20}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
module.exports = function ($scope, $translate, $localStorage, AuthorizationFactory ) {

    $scope.lang = $localStorage.lang;
    $translate.use($localStorage.lang);

    $scope.user = AuthorizationFactory.getUser();

    $scope.switchLanguage = function (language) {
        $translate.use(language);
        $localStorage.lang = language;
        $scope.lang = $localStorage.lang;
    };

};

},{}],22:[function(require,module,exports){
module.exports = function () {
    
};

},{}],23:[function(require,module,exports){
var settingsModule = angular.module('zonnebloem.settings', []);

settingsModule.controller("SettingsController", require("./controllers/settings.controller"));

settingsModule.factory("SettingsFactory", require("./factories/settings.factory"));

settingsModule.config(require("./settings.routes"));

module.exports = settingsModule;

},{"./controllers/settings.controller":21,"./factories/settings.factory":22,"./settings.routes":24}],24:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJ3d3cvYXBwLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9hdXRob3JpemF0aW9uLm1vZHVsZS5qcyIsInd3dy9jb21wb25lbnRzL2F1dGhvcml6YXRpb24vYXV0aG9yaXphdGlvbi5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ2luLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9hdXRob3JpemF0aW9uL2NvbnRyb2xsZXJzL2xvZ291dC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi9mYWN0b3JpZXMvYXV0aG9yaXphdGlvbi5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmFkZC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvY29udHJvbGxlcnMvaXNzdWVzLmNvbnRyb2xsZXIuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzIiwid3d3L2NvbXBvbmVudHMvaXNzdWVzL2lzc3Vlcy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLnJvdXRlcy5qcyIsInd3dy9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9tYWluL21haW4ucm91dGVzLmpzIiwid3d3L2NvbXBvbmVudHMvbWFpbi9tYWluLnRyYW5zbGF0aW9uLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL2ZhY3Rvcmllcy9yb3V0ZXNXYWxrZWQuZmFjdG9yeS5qcyIsInd3dy9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlLmpzIiwid3d3L2NvbXBvbmVudHMvbWFwL21hcC5yb3V0ZXMuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyLmpzIiwid3d3L2NvbXBvbmVudHMvc2V0dGluZ3MvZmFjdG9yaWVzL3NldHRpbmdzLmZhY3RvcnkuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5tb2R1bGUuanMiLCJ3d3cvY29tcG9uZW50cy9zZXR0aW5ncy9zZXR0aW5ncy5yb3V0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwicmVxdWlyZSgnLi9jb21wb25lbnRzL21haW4vbWFpbi5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL2F1dGhvcml6YXRpb24vYXV0aG9yaXphdGlvbi5tb2R1bGUnKTtcclxucmVxdWlyZSgnLi9jb21wb25lbnRzL21hcC9tYXAubW9kdWxlJyk7XHJcbnJlcXVpcmUoJy4vY29tcG9uZW50cy9pc3N1ZXMvaXNzdWVzLm1vZHVsZS5qcycpO1xyXG5yZXF1aXJlKCcuL2NvbXBvbmVudHMvc2V0dGluZ3Mvc2V0dGluZ3MubW9kdWxlJyk7XHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnem9ubmVibG9lbScsIFtcclxuICAgICdpb25pYycsXHJcbiAgICAnbmdDb3Jkb3ZhJyxcclxuXHQnbmdTdG9yYWdlJyxcclxuICAgICdwYXNjYWxwcmVjaHQudHJhbnNsYXRlJyxcclxuICAgICd6b25uZWJsb2VtLm1haW4nLFxyXG4gICAgJ3pvbm5lYmxvZW0uYXV0aG9yaXphdGlvbicsXHJcbiAgICAnem9ubmVibG9lbS5tYXAnLFxyXG4gICAgJ3pvbm5lYmxvZW0uaXNzdWVzJyxcclxuICAgICd6b25uZWJsb2VtLnNldHRpbmdzJ1xyXG5dKVxyXG5cclxuICAgIC5ydW4oZnVuY3Rpb24gKCRpb25pY1BsYXRmb3JtLCAkc3RhdGUsIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XHJcbiAgICAgICAgJGlvbmljUGxhdGZvcm0ucmVhZHkoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBIaWRlIHRoZSBhY2Nlc3NvcnkgYmFyIGJ5IGRlZmF1bHQgKHJlbW92ZSB0aGlzIHRvIHNob3cgdGhlIGFjY2Vzc29yeSBiYXIgYWJvdmUgdGhlIGtleWJvYXJkXHJcbiAgICAgICAgICAgIC8vIGZvciBmb3JtIGlucHV0cylcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5LZXlib2FyZCkge1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuaGlkZUZvcm1BY2Nlc3NvcnlCYXIodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBLZXlib2FyZC5zaHJpbmtWaWV3KHRydWUpO1xyXG4gICAgICAgICAgICAgICAgS2V5Ym9hcmQuZGlzYWJsZVNjcm9sbGluZ0luU2hyaW5rVmlldyh0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5TdGF0dXNCYXIpIHtcclxuICAgICAgICAgICAgICAgIFN0YXR1c0Jhci5zdHlsZUxpZ2h0Q29udGVudCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoQXV0aG9yaXphdGlvbkZhY3RvcnkuZ2V0QXV0aFRva2VuKCkgPT09IG51bGwgfHwgQXV0aG9yaXphdGlvbkZhY3RvcnkuZ2V0QXV0aFRva2VuKCkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdhcHAubG9naW4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiIsInZhciBhdXRob3JpemF0aW9uTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0uYXV0aG9yaXphdGlvbicsIFtdKTtcclxuXHJcbmF1dGhvcml6YXRpb25Nb2R1bGUuY29udHJvbGxlcihcIkxvZ2luQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9sb2dpbi5jb250cm9sbGVyLmpzXCIpKTtcclxuYXV0aG9yaXphdGlvbk1vZHVsZS5jb250cm9sbGVyKFwiTG9nb3V0Q29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9sb2dvdXQuY29udHJvbGxlci5qc1wiKSk7XHJcblxyXG5hdXRob3JpemF0aW9uTW9kdWxlLmZhY3RvcnkoXCJBdXRob3JpemF0aW9uRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvYXV0aG9yaXphdGlvbi5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbmF1dGhvcml6YXRpb25Nb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL2F1dGhvcml6YXRpb24ucm91dGVzLmpzXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gYXV0aG9yaXphdGlvbk1vZHVsZTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAubG9naW4nLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnc2V0dGluZ3MnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2F1dGhvcml6YXRpb24vdGVtcGxhdGVzL2xvZ2luLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlLCAkc2NvcGUsICRpb25pY0hpc3RvcnksIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICAgJHNjb3BlLiRvbignJGlvbmljVmlldy5iZWZvcmVFbnRlcicsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJHNjb3BlLiRyb290LmhpZGVUYWJzID0gXCJsb2dpbi1oZWFkZXJcIjtcclxuICAgICAgICAkc2NvcGUuY3JlZGVudGlhbHMgPSB7XHJcbiAgICAgICAgICAgIFwiZW1haWxcIjogXCJcIixcclxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBcIlwiXHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgICRzY29wZS5sb2dpbiA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBBdXRob3JpemF0aW9uRmFjdG9yeS5sb2dpbigkc2NvcGUuY3JlZGVudGlhbHMpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIEF1dGhvcml6YXRpb25GYWN0b3J5LnNldEF1dGhUb2tlbihkYXRhLnRva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5zZXR0aW5ncycpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5jbGVhckhpc3RvcnkoKTtcclxuICAgICAgICAgICAgICAgICRpb25pY0hpc3RvcnkuY2xlYXJDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xyXG4gICAgICAgICAgICAgICAgICAgIGhpc3RvcnlSb290OiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuJHJvb3QuaGlkZVRhYnMgPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlLCAkc2NvcGUsICRpb25pY0hpc3RvcnksIEF1dGhvcml6YXRpb25GYWN0b3J5KSB7XHJcblxyXG4gICAgJHNjb3BlLnRva2VuID0gQXV0aG9yaXphdGlvbkZhY3RvcnkuZ2V0QXV0aFRva2VuKCk7XHJcblxyXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgQXV0aG9yaXphdGlvbkZhY3RvcnkuY2xlYXJVc2VyKCk7XHJcbiAgICAgICAgICAgIEF1dGhvcml6YXRpb25GYWN0b3J5LmNsZWFyQXV0aFRva2VuKCk7XHJcblxyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2FwcC5sb2dpbicpO1xyXG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xyXG4gICAgICAgICAgICAkaW9uaWNIaXN0b3J5LmNsZWFyQ2FjaGUoKTtcclxuICAgICAgICAgICAgJGlvbmljSGlzdG9yeS5uZXh0Vmlld09wdGlvbnMoe1xyXG4gICAgICAgICAgICAgICAgaGlzdG9yeVJvb3Q6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaG9zdG5hbWUsICRodHRwLCAkbG9jYWxTdG9yYWdlLCAkaW9uaWNQb3B1cCwgJHRyYW5zbGF0ZSkge1xyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ2luKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLnBvc3QoaG9zdG5hbWUgKyBcIi9sb2dpblwiLCBKU09OLnN0cmluZ2lmeShjcmVkZW50aWFscyksIHtoZWFkZXJzOiB7J0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ319KVxyXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoZXJyb3Iuc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgIHNob3dBbGVydCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VyKCkge1xyXG4gICAgICAgIHJldHVybiAkbG9jYWxTdG9yYWdlLnVzZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0VXNlcih1c2VyKSB7XHJcbiAgICAgICAgJGxvY2FsU3RvcmFnZS51c2VyID0gdXNlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhclVzZXIoKSB7XHJcbiAgICAgICAgZGVsZXRlICRsb2NhbFN0b3JhZ2UudXNlcjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRVc2VybmFtZSgpIHtcclxuICAgICAgICBpZiAoJGxvY2FsU3RvcmFnZS51c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkbG9jYWxTdG9yYWdlLnVzZXIubG9jYWwudXNlcm5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEF1dGhUb2tlbigpIHtcclxuICAgICAgICByZXR1cm4gJGxvY2FsU3RvcmFnZS5hdXRoVG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0QXV0aFRva2VuKHRva2VuKSB7XHJcbiAgICAgICAgJGxvY2FsU3RvcmFnZS5hdXRoVG9rZW4gPSB0b2tlbjtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBjbGVhckF1dGhUb2tlbigpIHtcclxuICAgICAgICBkZWxldGUgJGxvY2FsU3RvcmFnZS5hdXRoVG9rZW47XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gc2hvd0FsZXJ0KCkge1xyXG4gICAgICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnTE9HSU5fRVJST1JfVElUTEUnKSxcclxuICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnTE9HSU5fRVJST1JfRVhQTEFOQVRJT04nKSxcclxuICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0xPR0lOX0VSUk9SX0FDQ0VQVCcpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgLypsb2dvdXQ6IGxvZ291dCwqL1xyXG4gICAgICAgIGdldFVzZXI6IGdldFVzZXIsXHJcbiAgICAgICAgc2V0VXNlcjogc2V0VXNlcixcclxuICAgICAgICBjbGVhclVzZXI6IGNsZWFyVXNlcixcclxuICAgICAgICBnZXRVc2VybmFtZTogZ2V0VXNlcm5hbWUsXHJcbiAgICAgICAgZ2V0QXV0aFRva2VuOiBnZXRBdXRoVG9rZW4sXHJcbiAgICAgICAgc2V0QXV0aFRva2VuOiBzZXRBdXRoVG9rZW4sXHJcbiAgICAgICAgY2xlYXJBdXRoVG9rZW46IGNsZWFyQXV0aFRva2VuXHJcbiAgICB9O1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZSwgJHN0YXRlUGFyYW1zLCBJc3N1ZXNGYWN0b3J5LCAkY29yZG92YUNhbWVyYSwgJGlvbmljUG9wdXAsICR0cmFuc2xhdGUpIHtcclxuXHJcbiAgICAkc2NvcGUucGhvdG9QYXRoID0gXCJcIjtcclxuICAgICRzY29wZS5zaG93UGhvdG8gPSBmYWxzZTtcclxuICAgICRzY29wZS5pc3N1ZSA9IHtcclxuICAgICAgICBzdHJlZXQgOiBcIlwiLFxyXG4gICAgICAgIGNpdHkgOiBcIlwiLFxyXG4gICAgICAgIHBvc3RhbENvZGUgOiBcIlwiLFxyXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJcIixcclxuICAgICAgICBsYXQgOiBcIlwiLFxyXG4gICAgICAgIGxuZyA6IFwiXCJcclxuICAgIH07XHJcblxyXG4gICAgJHJvb3RTY29wZS4kb24oJ2FkZHJlc3NMb2FkZWRFdmVudCcsIGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdUcmlnZ2VyZWQ6IGFkZHJlc3NMb2FkZWRFdmVudCcpO1xyXG4gICAgICAgICRzY29wZS5pc3N1ZS5zdHJlZXQgPSBkYXRhLnN0cmVldDtcclxuICAgICAgICAkc2NvcGUuaXNzdWUuY2l0eSA9IGRhdGEuY2l0eTtcclxuICAgICAgICAkc2NvcGUuaXNzdWUucG9zdGFsQ29kZSA9IGRhdGEucG9zdGFsQ29kZTtcclxuICAgICAgICAkc2NvcGUuaXNzdWUubGF0ID0gZGF0YS5sYXQ7XHJcbiAgICAgICAgJHNjb3BlLmlzc3VlLmxuZyA9IGRhdGEubG5nO1xyXG4gICAgICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTsgLy8gJ0RhdGEgdG8gc2VuZCdcclxuICAgIH0pO1xyXG5cclxuICAgIFxyXG4gICAgJHNjb3BlLnRha2VQaG90byA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ09wZW5pbmcgY2FtZXJhJyk7XHJcblxyXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgICAgICBxdWFsaXR5OiA1MCxcclxuICAgICAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMLFxyXG4gICAgICAgICAgICBzb3VyY2VUeXBlOiBDYW1lcmEuUGljdHVyZVNvdXJjZVR5cGUuQ0FNRVJBLFxyXG4gICAgICAgICAgICBhbGxvd0VkaXQ6IHRydWUsXHJcbiAgICAgICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxyXG4gICAgICAgICAgICB0YXJnZXRXaWR0aDogMTAwLFxyXG4gICAgICAgICAgICB0YXJnZXRIZWlnaHQ6IDEwMCxcclxuICAgICAgICAgICAgcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxyXG4gICAgICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZSxcclxuICAgICAgICAgICAgY29ycmVjdE9yaWVudGF0aW9uOnRydWVcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpLnRoZW4oZnVuY3Rpb24oaW1hZ2VEYXRhKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5waG90byA9IFwiZGF0YTppbWFnZS9qcGVnO2Jhc2U2NCxcIiArIGltYWdlRGF0YTtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dQaG90byA9IHRydWU7XHJcblxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xyXG4gICAgICAgIC8vIGVycm9yXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vIHZhciBzcmNUeXBlID0gQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQTtcclxuICAgICAgICAvLyB2YXIgb3B0aW9ucyA9IHNldE9wdGlvbnMoc3JjVHlwZSk7XHJcblxyXG4gICAgICAgIC8vIG5hdmlnYXRvci5jYW1lcmEuZ2V0UGljdHVyZShmdW5jdGlvbiBjYW1lcmFTdWNjZXNzKGltYWdlVXJpKSB7XHJcblxyXG4gICAgICAgIC8vICAgICAkc2NvcGUucGhvdG8gPSBpbWFnZVVyaTtcclxuICAgICAgICAvLyAgICAgJHNjb3BlLnNob3dQaG90byA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgICRzY29wZS4kYXBwbHkoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gICAgIC8vIFlvdSBtYXkgY2hvb3NlIHRvIGNvcHkgdGhlIHBpY3R1cmUsIHNhdmUgaXQgc29tZXdoZXJlLCBvciB1cGxvYWQuXHJcbiAgICAgICAgLy8gICAgIGNyZWF0ZU5ld0ZpbGVFbnRyeShpbWFnZVVyaSk7XHJcblxyXG4gICAgICAgIC8vIH0sIGZ1bmN0aW9uIGNhbWVyYUVycm9yKGVycm9yKSB7XHJcbiAgICAgICAgLy8gICAgICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAvLyAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFU19BRERfUEhPVE9fRVJST1JfVElUTEUnKSxcclxuICAgICAgICAvLyAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFU19BRERfUEhPVE9fRVJST1JfRVhQTEFOQVRJT04nKSxcclxuICAgICAgICAvLyAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRVNfQUREX1BIT1RPX0VSUk9SX0FDQ0VQVCcpXHJcbiAgICAgICAgLy8gICAgIH0pO1xyXG5cclxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coXCJVbmFibGUgdG8gb2J0YWluIHBpY3R1cmU6IFwiICsgZXJyb3IpO1xyXG5cclxuICAgICAgICAvLyB9LCBvcHRpb25zKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5hZGRQaG90b0Zyb21HYWxsZXJ5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdPcGVuaW5nIGdhbGxlcnknKTtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgc3JjVHlwZSA9IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5TQVZFRFBIT1RPQUxCVU07XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBzZXRPcHRpb25zKHNyY1R5cGUpO1xyXG5cclxuICAgICAgICBuYXZpZ2F0b3IuY2FtZXJhLmdldFBpY3R1cmUoZnVuY3Rpb24gY2FtZXJhU3VjY2VzcyhpbWFnZVVyaSkge1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnBob3RvID0gaW1hZ2VVcmk7XHJcbiAgICAgICAgICAgICRzY29wZS5zaG93UGhvdG8gPSB0cnVlO1xyXG4gICAgICAgICAgICAkc2NvcGUuJGFwcGx5KCk7XHJcblxyXG4gICAgICAgICAgICAvLyBZb3UgbWF5IGNob29zZSB0byBjb3B5IHRoZSBwaWN0dXJlLCBzYXZlIGl0IHNvbWV3aGVyZSwgb3IgdXBsb2FkLlxyXG4gICAgICAgICAgICBjcmVhdGVOZXdGaWxlRW50cnkoaW1hZ2VVcmkpO1xyXG5cclxuICAgICAgICB9LCBmdW5jdGlvbiBjYW1lcmFFcnJvcihlcnJvcikge1xyXG4gICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRVNfQUREX1BIT1RPX0VSUk9SX1RJVExFJyksXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRVNfQUREX1BIT1RPX0VSUk9SX0VYUExBTkFUSU9OJyksXHJcbiAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVTX0FERF9QSE9UT19FUlJPUl9BQ0NFUFQnKVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5hYmxlIHRvIG9idGFpbiBwaWN0dXJlOiBcIiArIGVycm9yKTtcclxuXHJcbiAgICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgXHJcbiAgICB9O1xyXG5cclxuICAgICRzY29wZS5zYXZlSXNzdWUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1NhdmluZyBpc3N1ZScpO1xyXG5cclxuICAgICAgICB2YXIgaXNzdWUgPSB7XHJcbiAgICAgICAgICAgIHN0cmVldCA6ICRzY29wZS5pc3N1ZS5zdHJlZXQsXHJcbiAgICAgICAgICAgIGNpdHkgOiAkc2NvcGUuaXNzdWUuY2l0eSxcclxuICAgICAgICAgICAgcG9zdGFsQ29kZSA6ICRzY29wZS5pc3N1ZS5wb3N0YWxDb2RlLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbiA6ICRzY29wZS5pc3N1ZS5kZXNjcmlwdGlvbixcclxuICAgICAgICAgICAgcGhvdG9QYXRoIDogXCJcIixcclxuICAgICAgICAgICAgbGF0IDogJHNjb3BlLmlzc3VlLmxhdCxcclxuICAgICAgICAgICAgbG5nIDogJHNjb3BlLmlzc3VlLmxuZ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaWYoJHNjb3BlLnBob3RvUGF0aCAhPT0gXCJcIil7XHJcbiAgICAgICAgICAgIGlzc3VlLnBob3RvUGF0aCA9ICRzY29wZS5waG90b1BhdGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdQb3N0aW5nIGlzc3VlIHRvIGZhY3RvcnknKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhpc3N1ZSk7XHJcbiAgICAgICAgSXNzdWVzRmFjdG9yeS5wb3N0SXNzdWUoaXNzdWUpO1xyXG4gICAgfTtcclxuXHJcbiAgICAkc2NvcGUucmVtb3ZlUGhvdG8gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLnBob3RvID0gbnVsbDtcclxuICAgICAgICAkc2NvcGUuc2hvd1Bob3RvID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEdldCBhIEZpbGVFbnRyeSBPYmplY3QgXHJcbiAgICBmdW5jdGlvbiBnZXRGaWxlRW50cnkoaW1nVXJpKSB7XHJcbiAgICAgICAgd2luZG93LnJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoaW1nVXJpLCBmdW5jdGlvbiBzdWNjZXNzKGZpbGVFbnRyeSkge1xyXG4gICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCB0aGUgRmlsZUVudHJ5IG9iamVjdCwgbGlrZSB3cml0ZSB0byBpdCwgdXBsb2FkIGl0LCBldGMuXHJcbiAgICAgICAgICAgIC8vIHdyaXRlRmlsZShmaWxlRW50cnksIGltZ1VyaSk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZ290IGZpbGU6IFwiICsgZmlsZUVudHJ5LmZ1bGxQYXRoKTtcclxuICAgICAgICAgICAgLy8gZGlzcGxheUZpbGVEYXRhKGZpbGVFbnRyeS5uYXRpdmVVUkwsIFwiTmF0aXZlIFVSTFwiKTtcclxuXHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBJZiBkb24ndCBnZXQgdGhlIEZpbGVFbnRyeSAod2hpY2ggbWF5IGhhcHBlbiB3aGVuIHRlc3RpbmdcclxuICAgICAgICAgICAgLy8gb24gc29tZSBlbXVsYXRvcnMpLCBjb3B5IHRvIGEgbmV3IEZpbGVFbnRyeS5cclxuICAgICAgICAgICAgY3JlYXRlTmV3RmlsZUVudHJ5KGltZ1VyaSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY3JlYXRlTmV3RmlsZUVudHJ5KGltZ1VyaSkge1xyXG4gICAgICAgIHdpbmRvdy5yZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGNvcmRvdmEuZmlsZS5jYWNoZURpcmVjdG9yeSwgZnVuY3Rpb24gc3VjY2VzcyhkaXJFbnRyeSkge1xyXG5cclxuICAgICAgICAgICAgLy8gSlBFRyBmaWxlXHJcbiAgICAgICAgICAgIGRpckVudHJ5LmdldEZpbGUoXCJ0ZW1wRmlsZS5qcGVnXCIsIHsgY3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IGZhbHNlIH0sIGZ1bmN0aW9uIChmaWxlRW50cnkpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEbyBzb21ldGhpbmcgd2l0aCBpdCwgbGlrZSB3cml0ZSB0byBpdCwgdXBsb2FkIGl0LCBldGMuXHJcbiAgICAgICAgICAgICAgICAvLyB3cml0ZUZpbGUoZmlsZUVudHJ5LCBpbWdVcmkpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJnb3QgZmlsZTogXCIgKyBmaWxlRW50cnkuZnVsbFBhdGgpO1xyXG4gICAgICAgICAgICAgICAgLy8gZGlzcGxheUZpbGVEYXRhKGZpbGVFbnRyeS5mdWxsUGF0aCwgXCJGaWxlIGNvcGllZCB0b1wiKTtcclxuXHJcbiAgICAgICAgICAgIH0sIG9uRXJyb3JDcmVhdGVGaWxlKTtcclxuXHJcbiAgICAgICAgfSwgb25FcnJvclJlc29sdmVVcmwpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gc2V0T3B0aW9ucyhzcmNUeXBlKSB7XHJcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIC8vIFNvbWUgY29tbW9uIHNldHRpbmdzIGFyZSAyMCwgNTAsIGFuZCAxMDBcclxuICAgICAgICAgICAgcXVhbGl0eTogNTAsXHJcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uVHlwZTogQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5EQVRBX1VSTCxcclxuICAgICAgICAgICAgLy8gSW4gdGhpcyBhcHAsIGR5bmFtaWNhbGx5IHNldCB0aGUgcGljdHVyZSBzb3VyY2UsIENhbWVyYSBvciBwaG90byBnYWxsZXJ5XHJcbiAgICAgICAgICAgIHNvdXJjZVR5cGU6IHNyY1R5cGUsXHJcbiAgICAgICAgICAgIGFsbG93RWRpdDogZmFsc2UsXHJcbiAgICAgICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxyXG4gICAgICAgICAgICB0YXJnZXRXaWR0aDogMTAwLFxyXG4gICAgICAgICAgICB0YXJnZXRIZWlnaHQ6IDEwMCxcclxuICAgICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogdHJ1ZSxcclxuICAgICAgICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlICAvL0NvcnJlY3RzIEFuZHJvaWQgb3JpZW50YXRpb24gcXVpcmtzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xyXG4gICAgfVxyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUsICRzdGF0ZVBhcmFtcywgSXNzdWVzRmFjdG9yeSkge1xyXG5cclxuICAgICRzY29wZS5pc3N1ZSA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWUoJHN0YXRlUGFyYW1zLmlzc3VlSWQpO1xyXG5cclxuICAgIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0KCRzdGF0ZVBhcmFtcy5yZXBvcnRJZCkudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgJHNjb3BlLnJlcG9ydCA9IHJlcG9ydDtcclxuICAgIH0pOyovXHJcblxyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCBJc3N1ZXNGYWN0b3J5KSB7XHJcblxyXG4gICRzY29wZS5pc3N1ZXMgPSBJc3N1ZXNGYWN0b3J5LmdldElzc3VlcygpO1xyXG4gIFxyXG4gIElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCkudGhlbihmdW5jdGlvbihpc3N1ZXMpIHtcclxuICAgICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gICAgfSk7XHJcblxyXG4gIC8qUmVwb3J0c0ZhY3RvcnkuZ2V0UmVwb3J0cygpLnRoZW4oZnVuY3Rpb24gKGlzc3Vlcykge1xyXG4gICAgICAkc2NvcGUuaXNzdWVzID0gaXNzdWVzO1xyXG4gIH0pKi9cclxuXHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaG9zdG5hbWUsICRodHRwLCBBdXRob3JpemF0aW9uRmFjdG9yeSwgJGlvbmljUG9wdXAsICR0cmFuc2xhdGUsICRjb3Jkb3ZhRmlsZVRyYW5zZmVyKSB7XHJcbiAgICB2YXIgdG9rZW4gPSBBdXRob3JpemF0aW9uRmFjdG9yeS5nZXRBdXRoVG9rZW4oKTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRJc3N1ZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuICRodHRwLmdldChob3N0bmFtZSArIFwiL2lzc3Vlc1wiLCB7IGhlYWRlcnM6IHsgJ2JlYXJlcic6IHRva2VuIH0gfSApLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcblx0XHRcdFxyXG4gICAgICAgICAgICAvL1RFTVBcclxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCByZXNwb25zZS5kYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0ICByZXNwb25zZS5kYXRhLmRhdGFbaV0ucGhvdG8gPSBcImltZy9jaGFzc2V2ZWxkLnBuZ1wiO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2UuZGF0YS5kYXRhO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldElzc3VlKGlzc3VlSWQpIHtcclxuICAgICAgICAvKiBmb3IgKHZhciBpID0gMDsgaSA8IGlzc3Vlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaXNzdWVzW2ldLmlkID09PSBwYXJzZUludChpc3N1ZUlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzc3Vlc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDsgKi9cclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocmVwb3J0KSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXBvcnQ7XHJcbiAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBwb3N0SXNzdWUoaXNzdWUpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnVG9rZW46ICcgKyB0b2tlbik7XHJcbiAgICAgICAgaWYoaXNzdWUuc3RyZWV0ID09PSBcIlwiIHx8IGlzc3VlLmNpdHkgPT09IFwiXCIgfHwgaXNzdWUucG9zdGFsQ29kZSA9PT0gXCJcIiB8fCBpc3N1ZS5sYXQgPT09IFwiXCIgfHwgaXNzdWUubG5nID09PSBcIlwiKXtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm90IGFsbCByZXF1aXJlZCBpc3N1ZSBwcm9wZXJ0aWVzIGFyZSBzZXQnKTtcclxuICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9FUlJPUl9USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9FUlJPUl9FWFBMQU5BVElPTicpLFxyXG4gICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfRVJST1JfQUNDRVBUJylcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChpc3N1ZS5kZXNjcmlwdGlvbiA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdNaXNzaW5nIHRoZSBkZXNjcmlwdGlvbicpO1xyXG4gICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX0RFU0NSSVBUSU9OX0VSUk9SX1RJVExFJyksXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX0RFU0NSSVBUSU9OX0VSUk9SX0VYUExBTkFUSU9OJyksXHJcbiAgICAgICAgICAgICAgICBva1RleHQ6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9ERVNDUklQVElPTl9FUlJPUl9BQ0NFUFQnKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJGh0dHAucG9zdChob3N0bmFtZSArIFwiL2lzc3Vlc1wiLCB7XHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7ICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICdzdHJlZXROYW1lJzogaXNzdWUuc3RyZWV0LFxyXG4gICAgICAgICAgICAgICAgICAgICdwbGFjZSc6IGlzc3VlLmNpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgJ3Bvc3RhbENvZGUnOiBpc3N1ZS5wb3N0YWxDb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICdkZXNjcmlwdGlvbic6IGlzc3VlLmRlc2NyaXB0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgICdsYXRpdHVkZSc6IGlzc3VlLmxhdCxcclxuICAgICAgICAgICAgICAgICAgICAnbG9uZ2l0dWRlJzogaXNzdWUubG5nXHJcbiAgICAgICAgICAgICAgICB9fSwgeyBcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmVhcmVyJzogdG9rZW4gXHJcbiAgICAgICAgICAgIH19KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FQSSBTVUNDRVNTIFJFU1BPTlNFJyk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihpc3N1ZS5waG90b1BhdGggIT09IFwiXCIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwaG90b1BhdGg6ICcgKyBpc3N1ZS5waG90b1BhdGgpO1xyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmRhdGEuX2lkICE9PSBudWxsKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9WYXJpYWJsZXMgZm9yIGZpbGUgdHJhbnNmZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNlcnZlciA9IFwicGxhYXRzIGhpZXIgZGUgc2VydmVyIFVSTFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0UGF0aCA9IGlzc3VlLnBob3RvUGF0aDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRydXN0SG9zdHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZpbGVOYW1lID0gXCJoaWVyIGtvbXQgZGUgYmVzdGFuZHNuYWFtXCI7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkY29yZG92YUZpbGVUcmFuc2Zlci51cGxvYWQoc2VydmVyLCB0YXJnZXRQYXRoLCBvcHRpb25zLCB0cnVzdEFsbEhvc3RzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gU3VjY2VzcyFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZJTEVUUkFOU0ZFUiBTVUNDRVNTXCIgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfU1VDQ0VTU19USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX1NVQ0NFU1NfRVhQTEFOQVRJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfU1VDQ0VTU19BQ0NFUFQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRXJyb3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkZJTEVUUkFOU0ZFUiBFUlJPUlwiICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfUEhPVE9fVVBMT0FEX0VSUk9SX1RJVExFJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfUEhPVE9fVVBMT0FEX0VSUk9SX0VYUExBTkFUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX1BIT1RPX1VQTE9BRF9FUlJPUl9BQ0NFUFQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc3RhbnQgcHJvZ3Jlc3MgdXBkYXRlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRklMRVRSQU5TRkVSIFBST0dSRVNTXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb2dyZXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNwb25zZSBmcm9tIEFQSSBoYWQgbm8gaXNzdWUgX2lkXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX1BIT1RPX1VQTE9BRF9FUlJPUl9USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICR0cmFuc2xhdGUuaW5zdGFudCgnSVNTVUVfUE9TVF9QSE9UT19VUExPQURfRVJST1JfRVhQTEFOQVRJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9rVGV4dDogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX1BIT1RPX1VQTE9BRF9FUlJPUl9BQ0NFUFQnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW9uaWNQb3B1cC5hbGVydCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfU1VDQ0VTU19USVRMRScpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX1NVQ0NFU1NfRVhQTEFOQVRJT04nKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfU1VDQ0VTU19BQ0NFUFQnKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfRVJST1JfVElUTEUnKSxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHRyYW5zbGF0ZS5pbnN0YW50KCdJU1NVRV9QT1NUX0VSUk9SX0VYUExBTkFUSU9OJyksXHJcbiAgICAgICAgICAgICAgICAgICAgb2tUZXh0OiAkdHJhbnNsYXRlLmluc3RhbnQoJ0lTU1VFX1BPU1RfRVJST1JfQUNDRVBUJylcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0FQSSBFUlJPUiBSRVNQT05TRScpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRJc3N1ZXM6IGdldElzc3VlcyxcclxuICAgICAgICBnZXRJc3N1ZTogZ2V0SXNzdWUsXHJcbiAgICAgICAgcG9zdElzc3VlOiBwb3N0SXNzdWVcclxuICAgIH07XHJcbn07IiwidmFyIGlzc3Vlc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLmlzc3VlcycsIFtdKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZXMuY29udHJvbGxlci5qc1wiKSk7XHJcbmlzc3Vlc01vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLmNvbnRyb2xsZXIuanNcIikpO1xyXG5pc3N1ZXNNb2R1bGUuY29udHJvbGxlcihcIklzc3VlQWRkQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9pc3N1ZS5hZGQuY29udHJvbGxlci5qc1wiKSk7XHJcblxyXG5pc3N1ZXNNb2R1bGUuZmFjdG9yeShcIklzc3Vlc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL2lzc3Vlcy5mYWN0b3J5LmpzXCIpKTtcclxuXHJcbmlzc3Vlc01vZHVsZS5jb25maWcocmVxdWlyZShcIi4vaXNzdWVzLnJvdXRlcy5qc1wiKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGlzc3Vlc01vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXJcclxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9pc3N1ZXMnLFxyXG4gICAgICAgICAgICB2aWV3czoge1xyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlcyc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0lzc3Vlc0NvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAuc3RhdGUoJ2FwcC5pc3N1ZXMuYWRkJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYWRkJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdtYXBAYXBwLmlzc3Vlcy5hZGQnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvaXNzdWUubWFwLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdJc3N1ZU1hcENvbnRyb2xsZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgJ2lzc3Vlc0BhcHAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL2lzc3Vlcy90ZW1wbGF0ZXMvaXNzdWVzLmFkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVBZGRDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLnN0YXRlKCdhcHAuaXNzdWVzLmRldGFpbHMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy86aXNzdWVJZCcsXHJcbiAgICAgICAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgICAgICAgICAnaXNzdWVzQGFwcCc6IHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvaXNzdWVzL3RlbXBsYXRlcy9pc3N1ZXMuZGV0YWlscy5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnSXNzdWVDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbn07XHJcbiIsInZhciBtYWluTW9kdWxlID0gYW5ndWxhci5tb2R1bGUoJ3pvbm5lYmxvZW0ubWFpbicsIFtdKTtcclxuXHJcbm1haW5Nb2R1bGUudmFsdWUoJ2hvc3RuYW1lJywgXCJodHRwczovL3piLWFwaS5oZXJva3VhcHAuY29tXCIpO1xyXG5cclxubWFpbk1vZHVsZS5jb25maWcocmVxdWlyZShcIi4vbWFpbi5yb3V0ZXNcIikpO1xyXG5tYWluTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYWluLnRyYW5zbGF0aW9uXCIpKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gbWFpbk1vZHVsZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XHJcbiAgICAkc3RhdGVQcm92aWRlclxyXG4gICAgICAgIC5zdGF0ZSgnYXBwJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYXBwJyxcclxuICAgICAgICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbWFpbi5odG1sJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9hcHAvaXNzdWVzJyk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCR0cmFuc2xhdGVQcm92aWRlcikge1xyXG5cclxuICAgICR0cmFuc2xhdGVQcm92aWRlclxyXG4gICAgICAgIC51c2VTdGF0aWNGaWxlc0xvYWRlcih7XHJcbiAgICAgICAgICAgIHByZWZpeDogJ2xvY2FsZXMvJyxcclxuICAgICAgICAgICAgc3VmZml4OiAnLmpzb24nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucmVnaXN0ZXJBdmFpbGFibGVMYW5ndWFnZUtleXMoWydubCcsICdlbiddLCB7XHJcbiAgICAgICAgICAgICdubCcgOiAnbmwnLFxyXG4gICAgICAgICAgICAnbmxfTkwnOiAnbmwnLFxyXG4gICAgICAgICAgICAnZW4nOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVVMnOiAnZW4nLFxyXG4gICAgICAgICAgICAnZW5fVUsnOiAnZW4nXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucHJlZmVycmVkTGFuZ3VhZ2UoJ25sJylcclxuICAgICAgICAuZmFsbGJhY2tMYW5ndWFnZSgnbmwnKVxyXG4gICAgICAgIC51c2VTYW5pdGl6ZVZhbHVlU3RyYXRlZ3koJ2VzY2FwZVBhcmFtZXRlcnMnKVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJGNvcmRvdmFHZW9sb2NhdGlvbiwgJGlvbmljUG9wdXApIHtcclxuXHJcbiAgICAgLy8gR29vZ2xlIE1hcHMgb3B0aW9uc1xyXG4gICAgdmFyIG9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGltZW91dDogMTAwMDAsXHJcbiAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlXHJcbiAgICB9O1xyXG5cclxuXHJcblxyXG4gICAgLy8gU2V0cyBtYXAgdG8gY3VycmVudCBsb2NhdGlvblxyXG4gICAgJGNvcmRvdmFHZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24ob3B0aW9ucykudGhlbihmdW5jdGlvbihwb3NpdGlvbil7XHJcbiAgICAgICAgc2hvd01hcChwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpO1xyXG4gICAgfSwgZnVuY3Rpb24oZXJyb3Ipe1xyXG4gICAgICAgIC8vIFNob3cgQ291bGQgbm90IGdldCBsb2NhdGlvbiBhbGVydCBkaWFsb2dcclxuICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBsb2NhdGllIG5pZXQgb3BoYWxlbi4gWmV0IHV3IGxvY2F0aWUgc2VydmljZSBhYW4uJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vVE9ETyBwcm9tdCB2b29yIGhldCBhYW56ZXR0ZW4gdmFuIGxvY2F0aWUgc2VydmljZVxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcblxyXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDksXHJcbiAgICAgICAgICAgIGNlbnRlcjogbGF0TG5nLFxyXG4gICAgICAgICAgICBkaXNhYmxlRGVmYXVsdFVJOiB0cnVlXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gTWFwIGVsZW1lbnRcclxuICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1hcFwiKSwgbWFwT3B0aW9ucyk7XHJcbiAgICAgICAgJHNjb3BlLm1hcCA9IG1hcDtcclxuXHJcbiAgICAgICAgLy8gVmFyaWFibGVzIG5lZWRlZCB0byBnZXQgdGhlIGFkZHJlc3NcclxuICAgICAgICB2YXIgZ2VvY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXI7XHJcbiAgICAgICAgdmFyIGluZm93aW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdztcclxuICAgICAgICBnZXRDdXJyZW50QWRkcmVzcyhnZW9jb2RlciwgbWFwLCBpbmZvd2luZG93LCBsYXRMbmcsIGxhdCwgbG5nKTtcclxuXHJcbiAgICAgICAgLy8gR29vZ2xlIE1hcHNcclxuICAgICAgICAvLyBXYWl0IHVudGlsIHRoZSBtYXAgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gU2V0cyBhIHBvcHVwIHdpbmRvdyB3aGVuIHRoZSB1c2VyIHRhcHMgYSBtYXJrZXJcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lck9uY2UoJHNjb3BlLm1hcCwgJ2lkbGUnLCBmdW5jdGlvbigpe1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGVTcGlubmVyID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1AsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbjogbGF0TG5nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50OiBcIkRpdCBpcyBlZW4gbWVsZGluZyFcIlxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKCRzY29wZS5tYXAsIG1hcmtlcik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50QWRkcmVzcyhnZW9jb2RlciwgbWFwLCBpbmZvd2luZG93LCBsYXRMbmcsIGxhdCwgbG5nKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJHZXR0aW5nIGN1cnJlbnQgYWRkcmVzc1wiKTtcclxuXHJcbiAgICAgICAgZ2VvY29kZXIuZ2VvY29kZSh7J2xvY2F0aW9uJzogbGF0TG5nfSwgZnVuY3Rpb24gKHJlc3VsdHMsIHN0YXR1cykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkdFT0NPREVSIFJFU1BPTlNFOiBcIiArIHN0YXR1cyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUkVTVUxUU1wiKTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0cyk7XHJcbiAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwLnNldFpvb20oMTcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGxhdExuZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBtYXBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpbmZvd2luZG93LnNldENvbnRlbnQocmVzdWx0c1swXS5mb3JtYXR0ZWRfYWRkcmVzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5mb3dpbmRvdy5vcGVuKG1hcCwgbWFya2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyaWFibGVzIGZvciBmb3JMb29wc1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldHRpbmcgc3RyZWV0XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmVldCA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0cmVldEZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChvID0gMDsgbyA8IHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50c1tvXS50eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzW29dLnR5cGVzW2ldID09PSBcInJvdXRlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJlZXRGb3VuZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyZWV0ID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbb10ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFzdHJlZXRGb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldCA9IFwiTmlldCBnZXZvbmRlblwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldHRpbmcgY2l0eVxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjaXR5ID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2l0eUZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChvID0gMDsgbyA8IHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzLmxlbmd0aDsgbysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50c1tvXS50eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzW29dLnR5cGVzW2ldID09PSBcImxvY2FsaXR5XCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaXR5Rm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNpdHkgPSByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50c1tvXS5sb25nX25hbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIWNpdHlGb3VuZCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNpdHkgPSBcIk5pZXQgZ2V2b25kZW5cIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldHRpbmcgcG9zdGFsIGNvZGVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zdGFsQ29kZSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvc3RhbENvZGVGb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobyA9IDA7IG8gPCByZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50cy5sZW5ndGg7IG8rKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbb10udHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRzWzBdLmFkZHJlc3NfY29tcG9uZW50c1tvXS50eXBlc1tpXSA9PT0gXCJwb3N0YWxfY29kZVwiIHx8IHJlc3VsdHNbMF0uYWRkcmVzc19jb21wb25lbnRzW29dLnR5cGVzW2ldID09PSBcInBvc3RhbF9jb2RlX3ByZWZpeFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zdGFsQ29kZUZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3N0YWxDb2RlID0gcmVzdWx0c1swXS5hZGRyZXNzX2NvbXBvbmVudHNbb10ubG9uZ19uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCFwb3N0YWxDb2RlRm91bmQpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0YWxDb2RlID0gXCJOaWV0IGdldm9uZGVuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0Jyb2FkY2FzdGluZzogYWRkcmVzc0xvYWRlZEV2ZW50Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQnJvYWRjYXN0IGFkZHJlc3MgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdhZGRyZXNzTG9hZGVkRXZlbnQnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVldDogc3RyZWV0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXR5OiBjaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3N0YWxDb2RlOiBwb3N0YWxDb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsbmc6IGxuZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBsYXRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGFkcmVzIGdldm9uZGVuLicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGFkcmVzIG5pZXQgdmluZGVuLiBSYWFkcGxlZWcgYS51LmIuIGRlIGJlZWhlcmRlci4nXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0ZvdXQgYmlqIGhldCBvcGhhbGVuIHZhbiBoZXQgYWRyZXMuJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJ1dlIGt1bm5lbiBoZWxhYXMgdXcgaHVpZGlnZSBhZHJlcyBuaWV0IHZpbmRlbi4gUmFhZHBsZWVnIGEudS5iLiBkZSBiZWVoZXJkZXIuJ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc2NvcGUsICRjb3Jkb3ZhR2VvbG9jYXRpb24sICRpb25pY1BvcHVwLCBJc3N1ZXNGYWN0b3J5LCBSb3V0ZXNXYWxrZWRGYWN0b3J5KSB7XHJcblxyXG4gICAgdmFyIGlzc3VlcyA9IElzc3Vlc0ZhY3RvcnkuZ2V0SXNzdWVzKCk7XHJcbiAgICB2YXIgcm91dGVzV2Fsa2VkID0gUm91dGVzV2Fsa2VkRmFjdG9yeS5nZXRSb3V0ZXNXYWxrZWQoKTtcclxuICAgIHZhciBncHNFbmFibGVkID0gZmFsc2U7XHJcbiAgICB2YXIgdGltZXIgPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgcm91dGVXYWxrZWQgPSBbXTtcclxuICAgIHZhciBkaXJTZXJ2aWNlID0gbmV3IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTZXJ2aWNlKCk7XHJcblxyXG4gICAgdmFyIHRlc3QgPSB0cnVlO1xyXG4gICAgdmFyIHRlc3RMYXQ7XHJcbiAgICB2YXIgdGVzdExuZztcclxuXHJcbiAgICAvLyBHb29nbGUgTWFwcyBvcHRpb25zXHJcbiAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICB0aW1lb3V0OiAxMDAwMCxcclxuICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWVcclxuICAgIH07XHJcbiAgICAvLyBTZXRzIG1hcCB0byBjdXJyZW50IGxvY2F0aW9uXHJcbiAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuICAgICAgICBncHNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB0ZXN0TGF0ID0gcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlO1xyXG4gICAgICAgIHRlc3RMbmcgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgIHNob3dNYXAocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKTtcclxuICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAvLyBTaG93IENvdWxkIG5vdCBnZXQgbG9jYXRpb24gYWxlcnQgZGlhbG9nXHJcbiAgICAgICAgZ3BzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnV2Uga3VubmVuIGhlbGFhcyB1dyBodWlkaWdlIGxvY2F0aWUgbmlldCBvcGhhbGVuJ1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0ZXN0TGF0ID0gNTEuNjg4NDIwO1xyXG4gICAgICAgIHRlc3RMbmcgPSA1LjI4NzM5MjtcclxuICAgICAgICBzaG93TWFwKDUxLjY4ODQyMCwgNS4yODczOTIpO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHNob3dNYXAobGF0LCBsbmcpIHtcclxuICAgICAgICB2YXIgbGF0TG5nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsYXQsIGxuZyk7XHJcblxyXG4gICAgICAgIC8vIE1hcCBvcHRpb25zXHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHpvb206IDEyLFxyXG4gICAgICAgICAgICBjZW50ZXI6IGxhdExuZyxcclxuICAgICAgICAgICAgZGlzYWJsZURlZmF1bHRVSTogdHJ1ZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIE1hcCBlbGVtZW50XHJcbiAgICAgICAgJHNjb3BlLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYXBcIiksIG1hcE9wdGlvbnMpO1xyXG5cclxuICAgICAgICAvLyBHb29nbGUgTWFwc1xyXG4gICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIG1hcCBpcyBsb2FkZWRcclxuICAgICAgICAvLyBTZXRzIGEgcG9wdXAgd2luZG93IHdoZW4gdGhlIHVzZXIgdGFwcyBhIG1hcmtlclxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyT25jZSgkc2NvcGUubWFwLCAnaWRsZScsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlU3Bpbm5lciA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBpc3N1ZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvb3JkaW5hdGVzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhpc3N1ZXNbaV0ubGF0aXR1ZGUsIGlzc3Vlc1tpXS5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcDogJHNjb3BlLm1hcCxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBjb29yZGluYXRlc1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGluZm9XaW5kb3cgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbnRlbnQgPSAgICc8aW1nIHNyYz1cIicgKyBpc3N1ZXNbaV0uZm90byArICdcIiB3aWR0aD1cIjEwMFwiLz4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGJyPicgKyBpc3N1ZXNbaV0udG9lbGljaHRpbmcgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YnI+PGEgaHJlZj1cIi8jL2FwcC9pc3N1ZXMvJyArIGlzc3Vlc1tpXS5pZCArICdcIj5NZWxkaW5nPC9hPiAnXHJcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsJ2NsaWNrJywgKGZ1bmN0aW9uKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mb1dpbmRvdy5zZXRDb250ZW50KGNvbnRlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLG1hcmtlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH0pKG1hcmtlcixjb250ZW50LGluZm9XaW5kb3cpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcigkc2NvcGUubWFwLCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2xhdExuZzogJyArIGV2ZW50LmxhdExuZy5sYXQoKSArICcsICcgKyBldmVudC5sYXRMbmcubG5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0ZXN0TGF0ID0gZXZlbnQubGF0TG5nLmxhdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRlc3RMbmcgPSBldmVudC5sYXRMbmcubG5nKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy9BZGQgcm91dGVzIHdhbGtlZFxyXG4gICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgcm91dGVzV2Fsa2VkLmxlbmd0aDsgaisrKXtcclxuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCByb3V0ZXNXYWxrZWRbal0ud2F5cG9pbnRzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihpID4gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW4gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHJvdXRlc1dhbGtlZFtqXS53YXlwb2ludHNbaS0xXS5sYXRpdHVkZSwgcm91dGVzV2Fsa2VkW2pdLndheXBvaW50c1tpLTFdLmxvbmdpdHVkZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcocm91dGVzV2Fsa2VkW2pdLndheXBvaW50c1tpXS5sYXRpdHVkZSwgcm91dGVzV2Fsa2VkW2pdLndheXBvaW50c1tpXS5sb25naXR1ZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW5kZXJSb3V0ZShvcmlnaW4sIGRlc3RpbmF0aW9uLCAnZ3JlZW4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgJHNjb3BlLndhbGtSb3V0ZSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgaWYodHlwZW9mIHRpbWVyID09ICd1bmRlZmluZWQnKXtcclxuICAgICAgICAgICAgaWYoZ3BzRW5hYmxlZCl7XHJcbiAgICAgICAgICAgICAgICBpZih0eXBlb2YgdGltZXIgPT0gJ3VuZGVmaW5lZCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGFydCByb3V0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwodXBkYXRlUm91dGUsIDMwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYnV0dG9uXCIpLmlubmVySFRNTCA9IFwiU3RvcCByb3V0ZVwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICB2YXIgYWxlcnRQb3B1cCA9ICRpb25pY1BvcHVwLmFsZXJ0KHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0dlZW4gbG9jYXRpZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgdmFyIHBvcHVwID0gJGlvbmljUG9wdXAuY29uZmlybSh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogXCJSb3V0ZSBzdG9wcGVuXCIsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJXaWx0IHUgZGV6ZSByb3V0ZSBvcHNsYWFuP1wiXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBwb3B1cC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmKHJlcyl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuZCByb3V0ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVyID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm91dGUtYnV0dG9uXCIpLmlubmVySFRNTCA9IFwiU3RhcnQgcm91dGVcIjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcm91dGVzV2Fsa2VkLnB1c2gocm91dGVXYWxrZWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVSb3V0ZSgpe1xyXG4gICAgICAgIGlmKHRlc3Qpe1xyXG4gICAgICAgICAgICBpZihyb3V0ZVdhbGtlZC5sZW5ndGggPiAwKXtcclxuICAgICAgICAgICAgICAgIGlmKG1lYXN1cmUocm91dGVXYWxrZWRbcm91dGVXYWxrZWQubGVuZ3RoLTFdLmxhdCgpLCByb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMV0ubG5nKCksIHRlc3RMYXQsIHRlc3RMbmcpID4gMjApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlV2Fsa2VkLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcodGVzdExhdCwgdGVzdExuZylcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICByb3V0ZVdhbGtlZC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcodGVzdExhdCwgdGVzdExuZylcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHBvcyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcodGVzdExhdCwgdGVzdExuZyk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubWFwLnNldENlbnRlcihwb3MpO1xyXG5cclxuICAgICAgICAgICAgLy91cGRhdGUgcm91dGVcclxuICAgICAgICAgICAgaWYocm91dGVXYWxrZWQubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJSb3V0ZShyb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMl0sIHJvdXRlV2Fsa2VkW3JvdXRlV2Fsa2VkLmxlbmd0aC0xXSwgJ2JsdWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb3V0ZVdhbGtlZCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkY29yZG92YUdlb2xvY2F0aW9uLmdldEN1cnJlbnRQb3NpdGlvbihvcHRpb25zKS50aGVuKGZ1bmN0aW9uKHBvc2l0aW9uKXtcclxuICAgICAgICAgICAgaWYocm91dGVXYWxrZWQubGVuZ3RoID4gMCl7XHJcbiAgICAgICAgICAgICAgICBpZihtZWFzdXJlKHJvdXRlV2Fsa2VkW3JvdXRlV2Fsa2VkLmxlbmd0aC0xXS5sYXQoKSwgcm91dGVXYWxrZWRbcm91dGVXYWxrZWQubGVuZ3RoLTFdLmxuZygpLCBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpID4gMjApe1xyXG4gICAgICAgICAgICAgICAgICAgIHJvdXRlV2Fsa2VkLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5MYXRMbmcocG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLCBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlKVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHJvdXRlV2Fsa2VkLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSwgcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUubWFwLnNldENlbnRlcihwb3MpO1xyXG5cclxuICAgICAgICAgICAgLy91cGRhdGUgcm91dGVcclxuICAgICAgICAgICAgaWYocm91dGVXYWxrZWQubGVuZ3RoID4gMSl7XHJcbiAgICAgICAgICAgICAgICByZW5kZXJSb3V0ZShyb3V0ZVdhbGtlZFtyb3V0ZVdhbGtlZC5sZW5ndGgtMl0sIHJvdXRlV2Fsa2VkW3JvdXRlV2Fsa2VkLmxlbmd0aC0xXSwgJ2JsdWUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyb3V0ZVdhbGtlZCk7XHJcblxyXG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKXtcclxuICAgICAgICAgICAgLy8gU2hvdyBDb3VsZCBub3QgZ2V0IGxvY2F0aW9uIGFsZXJ0IGRpYWxvZ1xyXG4gICAgICAgICAgICBncHNFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciBhbGVydFBvcHVwID0gJGlvbmljUG9wdXAuYWxlcnQoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdHZWVuIGxvY2F0aWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdXZSBrdW5uZW4gaGVsYWFzIHV3IGh1aWRpZ2UgbG9jYXRpZSBuaWV0IG9waGFsZW4nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbWVhc3VyZShsYXQxLCBsb24xLCBsYXQyLCBsb24yKXtcclxuICAgICAgICB2YXIgUiA9IDYzNzguMTM3OyAvLyBSYWRpdXMgb2YgZWFydGggaW4gS01cclxuICAgICAgICB2YXIgZExhdCA9IGxhdDIgKiBNYXRoLlBJIC8gMTgwIC0gbGF0MSAqIE1hdGguUEkgLyAxODA7XHJcbiAgICAgICAgdmFyIGRMb24gPSBsb24yICogTWF0aC5QSSAvIDE4MCAtIGxvbjEgKiBNYXRoLlBJIC8gMTgwO1xyXG4gICAgICAgIHZhciBhID0gTWF0aC5zaW4oZExhdC8yKSAqIE1hdGguc2luKGRMYXQvMikgK1xyXG4gICAgICAgICAgICBNYXRoLmNvcyhsYXQxICogTWF0aC5QSSAvIDE4MCkgKiBNYXRoLmNvcyhsYXQyICogTWF0aC5QSSAvIDE4MCkgKlxyXG4gICAgICAgICAgICBNYXRoLnNpbihkTG9uLzIpICogTWF0aC5zaW4oZExvbi8yKTtcclxuICAgICAgICB2YXIgYyA9IDIgKiBNYXRoLmF0YW4yKE1hdGguc3FydChhKSwgTWF0aC5zcXJ0KDEtYSkpO1xyXG4gICAgICAgIHZhciBkID0gUiAqIGM7XHJcbiAgICAgICAgcmV0dXJuIGQgKiAxMDAwOyAvLyBtZXRlcnNcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiByZW5kZXJSb3V0ZShvcmlnaW4sIGRlc3RpbmF0aW9uLCBjb2xvcil7XHJcbiAgICAgICAgaWYodHlwZW9mIGNvbG9yID09ICd1bmRlZmluZWQnKXsgY29sb3IgPSAnZ3JlZW4nOyB9XHJcblxyXG4gICAgICAgIHZhciBwb2x5bGluZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHN0cm9rZUNvbG9yOiBjb2xvcixcclxuICAgICAgICAgICAgc3Ryb2tlT3BhY2l0eTogMSxcclxuICAgICAgICAgICAgc3Ryb2tlV2VpZ2h0OiA0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdmFyIHJlcXVlc3QgPSB7XHJcbiAgICAgICAgICAgIG9yaWdpbjogb3JpZ2luLFxyXG4gICAgICAgICAgICBkZXN0aW5hdGlvbjogZGVzdGluYXRpb24sXHJcbiAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLlRyYXZlbE1vZGUuV0FMS0lOR1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZGlyU2VydmljZS5yb3V0ZShyZXF1ZXN0LCBmdW5jdGlvbihyZXNwb25zZSwgc3RhdHVzKXtcclxuICAgICAgICAgICAgaWYoc3RhdHVzID09IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNTdGF0dXMuT0spe1xyXG4gICAgICAgICAgICAgICAgdmFyIGxlZ3MgPSByZXNwb25zZS5yb3V0ZXNbMF0ubGVncztcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZWdzLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcHMgPSBsZWdzW2ldLnN0ZXBzO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzdGVwcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV4dFNlZ21lbnQgPSBzdGVwc1tqXS5wYXRoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc3RlcFBvbHlsaW5lID0gbmV3IGdvb2dsZS5tYXBzLlBvbHlsaW5lKHBvbHlsaW5lT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBuZXh0U2VnbWVudC5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RlcFBvbHlsaW5lLmdldFBhdGgoKS5wdXNoKG5leHRTZWdtZW50W2tdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVwUG9seWxpbmUuc2V0TWFwKCRzY29wZS5tYXApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJvdXRlc1dhbGtlZCA9IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHVzZXJJZDogXCIxXCIsXHJcbiAgICAgICAgICAgIHJlZ2lvbklkOiBcIjFcIixcclxuICAgICAgICAgICAgd2F5cG9pbnRzOltcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjg4NTEzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yODc0NDVcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY4OTI5OCxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjg3NzU2XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODk2MDQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI4NjczMVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjkwOTUzLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yODcxOTVcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICB1c2VySWQ6IFwiMlwiLFxyXG4gICAgICAgICAgICByZWdpb25JZDogXCIxXCIsXHJcbiAgICAgICAgICAgIHdheXBvaW50czpbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY4NjE0NCxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjg5NzM1XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODU5NDQsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI5MDgwOFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogNTEuNjg4NDE4LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogNS4yOTE4MjdcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDUxLjY4ODU5MSxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IDUuMjkwODA4XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiA1MS42ODkyNDksXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiA1LjI5MTAwMVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSb3V0ZXNXYWxrZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJvdXRlc1dhbGtlZDtcclxuXHJcbiAgICAgICAgLypyZXR1cm4gJGh0dHAuZ2V0KFwiSElFUiBLT01UIERFIExJTksgTkFBUiBERSBBUElcIikudGhlbihmdW5jdGlvbiAocm91dGVzV2Fsa2VkKSB7XHJcbiAgICAgICAgIHJldHVybiByb3V0ZXNXYWxrZWQ7XHJcbiAgICAgICAgIH0pOyovXHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSb3V0ZXNXYWxrZWQ6IGdldFJvdXRlc1dhbGtlZFxyXG4gICAgfTtcclxufTtcclxuIiwidmFyIG1hcE1vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLm1hcCcsIFtdKTtcclxuXHJcbm1hcE1vZHVsZS5jb250cm9sbGVyKFwiSXNzdWVNYXBDb250cm9sbGVyXCIsIHJlcXVpcmUoXCIuL2NvbnRyb2xsZXJzL2lzc3VlLm1hcC5jb250cm9sbGVyLmpzXCIpKTtcclxubWFwTW9kdWxlLmNvbnRyb2xsZXIoJ01hcENvbnRyb2xsZXInLCByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL21hcC5jb250cm9sbGVyLmpzJykpO1xyXG5tYXBNb2R1bGUuZmFjdG9yeShcIklzc3Vlc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vLi4vaXNzdWVzL2ZhY3Rvcmllcy9pc3N1ZXMuZmFjdG9yeS5qc1wiKSk7XHJcbm1hcE1vZHVsZS5mYWN0b3J5KFwiUm91dGVzV2Fsa2VkRmFjdG9yeVwiLCByZXF1aXJlKFwiLi9mYWN0b3JpZXMvcm91dGVzV2Fsa2VkLmZhY3RvcnkuanNcIikpO1xyXG5cclxubWFwTW9kdWxlLmNvbmZpZyhyZXF1aXJlKFwiLi9tYXAucm91dGVzLmpzXCIpKTtcclxubW9kdWxlLmV4cG9ydHMgPSBtYXBNb2R1bGU7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAgICAgLnN0YXRlKCdhcHAubWFwJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvbWFwJyxcclxuICAgICAgICAgICAgdmlld3M6IHtcclxuICAgICAgICAgICAgICAgICdtYXAnOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdjb21wb25lbnRzL21hcC90ZW1wbGF0ZXMvbWFwLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdNYXBDb250cm9sbGVyJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoJHNjb3BlLCAkdHJhbnNsYXRlLCAkbG9jYWxTdG9yYWdlLCBBdXRob3JpemF0aW9uRmFjdG9yeSApIHtcclxuXHJcbiAgICAkc2NvcGUubGFuZyA9ICRsb2NhbFN0b3JhZ2UubGFuZztcclxuICAgICR0cmFuc2xhdGUudXNlKCRsb2NhbFN0b3JhZ2UubGFuZyk7XHJcblxyXG4gICAgJHNjb3BlLnVzZXIgPSBBdXRob3JpemF0aW9uRmFjdG9yeS5nZXRVc2VyKCk7XHJcblxyXG4gICAgJHNjb3BlLnN3aXRjaExhbmd1YWdlID0gZnVuY3Rpb24gKGxhbmd1YWdlKSB7XHJcbiAgICAgICAgJHRyYW5zbGF0ZS51c2UobGFuZ3VhZ2UpO1xyXG4gICAgICAgICRsb2NhbFN0b3JhZ2UubGFuZyA9IGxhbmd1YWdlO1xyXG4gICAgICAgICRzY29wZS5sYW5nID0gJGxvY2FsU3RvcmFnZS5sYW5nO1xyXG4gICAgfTtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgXHJcbn07XHJcbiIsInZhciBzZXR0aW5nc01vZHVsZSA9IGFuZ3VsYXIubW9kdWxlKCd6b25uZWJsb2VtLnNldHRpbmdzJywgW10pO1xyXG5cclxuc2V0dGluZ3NNb2R1bGUuY29udHJvbGxlcihcIlNldHRpbmdzQ29udHJvbGxlclwiLCByZXF1aXJlKFwiLi9jb250cm9sbGVycy9zZXR0aW5ncy5jb250cm9sbGVyXCIpKTtcclxuXHJcbnNldHRpbmdzTW9kdWxlLmZhY3RvcnkoXCJTZXR0aW5nc0ZhY3RvcnlcIiwgcmVxdWlyZShcIi4vZmFjdG9yaWVzL3NldHRpbmdzLmZhY3RvcnlcIikpO1xyXG5cclxuc2V0dGluZ3NNb2R1bGUuY29uZmlnKHJlcXVpcmUoXCIuL3NldHRpbmdzLnJvdXRlc1wiKSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHNldHRpbmdzTW9kdWxlO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICRzdGF0ZVByb3ZpZGVyXHJcbiAgICAuc3RhdGUoJ2FwcC5zZXR0aW5ncycsIHtcclxuICAgICAgdXJsOiAnL3NldHRpbmdzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnc2V0dGluZ3MnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvc2V0dGluZ3MvdGVtcGxhdGVzL3NldHRpbmdzLmh0bWwnLFxyXG4gICAgICAgICAgY29udHJvbGxlcjogJ1NldHRpbmdzQ29udHJvbGxlcidcclxuICAgICAgICB9LFxyXG4gICAgICAgICdsb2dvdXRAYXBwLnNldHRpbmdzJzoge1xyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2NvbXBvbmVudHMvYXV0aG9yaXphdGlvbi90ZW1wbGF0ZXMvbG9nb3V0Lmh0bWwnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnTG9nb3V0Q29udHJvbGxlcidcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG59O1xyXG4iXX0=
