module.exports = function ($scope, $rootScope, $state, $stateParams, IssuesFactory, $cordovaCamera, $ionicPopup, $translate) {

    $scope.issue = {
        street : '',
        city : '',
        postalCode : '',
        description : '',
        lat : '',
        lng : ''
    };

    console.log('issueAddController');
    $rootScope.$on('addressLoadedEvent', function (event, data) {
        console.log('addressLoadedEvent');
        $scope.issue.street = data.street;
        $scope.issue.city = data.city;
        $scope.issue.postalCode = data.postalCode;
        $scope.issue.lat = data.lat;
        $scope.issue.lng = data.lng;
        console.log(data); // 'Data to send'
    });

    $scope.takePhoto = function () {
        document.addEventListener("deviceready", function () {
            console.log('Opening Camera');

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
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });

        }, false);
    };

    $scope.addPhotoFromGallery = function () {
        console.log('Opening Gallery');
    };

    $scope.saveIssue = function () {
        console.log('Saving issue');
        var issue = {
            street : $scope.issue.street,
            city : $scope.issue.city,
            postalCode : $scope.issue.postalCode,
            description : $scope.issue.description,
            lat : $scope.issue.lat,
            lng : $scope.issue.lng
        };
        IssuesFactory.postIssue(issue);
    };

    $scope.removePhoto = function () {
        $scope.showPhoto = false;
    };
};
