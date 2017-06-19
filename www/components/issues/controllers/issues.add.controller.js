module.exports = function ($scope, $rootScope, $state, $stateParams, $cordovaGeolocation, $cordovaCamera, $ionicPopup, $translate, IssuesFactory, MapFactory, $ionicHistory, $ionicLoading) {

    var mapOptions = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    $cordovaGeolocation.getCurrentPosition(mapOptions).then(function (position) {
        MapFactory.showIssueMap(position.coords.latitude, position.coords.longitude, function () {
            var geocoder = new google.maps.Geocoder;
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            MapFactory.getCurrentAddress(geocoder, latLng, position.coords.latitude, position.coords.longitude);
            $scope.hideSpinner = true;
        });
    }, function (error) {
        MapFactory.showLocationError();
        $scope.hideSpinner = true;
    });

    $scope.issue = {
        street: "",
        city: "",
        postalCode: "",
        description: "",
        photo: "",
        thumbnail: "",
        lat: "",
        lng: ""
    };

    $rootScope.$on('addressLoadedEvent', function (event, data) {
        $scope.issue.street = data.street;
        $scope.issue.city = data.city;
        $scope.issue.postalCode = data.postalCode;
        $scope.issue.lat = data.lat;
        $scope.issue.lng = data.lng;
        $scope.$apply();
    });

    $scope.takePhoto = function () {
        var options = setOptions(Camera.PictureSourceType.CAMERA);

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.issue.fullimage = "data:image/jpeg;base64," + imageData;
            $scope.issue.thumbnail = "data:image/jpeg;base64," + imageData;
        }, function (error) {
            showPhotoError();
        });
    };

    $scope.addPhotoFromGallery = function () {
        var options = setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);

        $cordovaCamera.getPicture(options).then(function (imageData) {
            $scope.issue.fullimage = "data:image/jpeg;base64," + imageData;
            $scope.issue.thumbnail = "data:image/jpeg;base64," + imageData;
        }, function (error) {
            showPhotoError();
        });
    };

    $scope.saveIssue = function () {
        $ionicLoading.show({
            template: '<ion-spinner></ion-spinner>'
        }).then(function () {
            IssuesFactory.postIssue($scope.issue).then(function () {
                $ionicLoading.hide().then(function () {
                    $ionicHistory.goBack();
                });
            }, function (error) {
                console.error(error);
            });
        })
    };

    $scope.removePhoto = function () {
        $scope.issue.fullimage = null;
        $scope.issue.thumbnail = null;
    };

    function showPhotoError() {
        $ionicPopup.alert({
            title: $translate.instant('ISSUES_ADD_PHOTO_ERROR_TITLE'),
            template: $translate.instant('ISSUES_ADD_PHOTO_ERROR_EXPLANATION'),
            okText: $translate.instant('ISSUES_ADD_PHOTO_ERROR_ACCEPT')
        });
    }

    function setOptions(sourceType) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: sourceType,
            allowEdit: false,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        return options;
    }
};
