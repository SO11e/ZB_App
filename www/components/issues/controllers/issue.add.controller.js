module.exports = function ($scope, $rootScope, $state, $stateParams, IssuesFactory, $cordovaCamera, $ionicPopup, $translate) {

    $scope.pictureUrl = 'http://placehold.it/100x100';
    $scope.issue = {
        street : '',
        city : '',
        postalCode : '',
        description : '',
        lat : '',
        lng : ''
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

        var srcType = Camera.PictureSourceType.CAMERA;
        var options = setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            $scope.pictureUrl = imageUri;
            
            // You may choose to copy the picture, save it somewhere, or upload.
            createNewFileEntry(imageUri);

        }, function cameraError(error) {
            $ionicPopup.alert({
                title: $translate.instant('ISSUES_ADD_PHOTO_ERROR_TITLE'),
                template: $translate.instant('ISSUES_ADD_PHOTO_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUES_ADD_PHOTO_ERROR_ACCEPT')
            });

            console.debug("Unable to obtain picture: " + error, "app");

        }, options);

    };

    $scope.addPhotoFromGallery = function () {
        console.log('Opening gallery');
        
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
        var options = setOptions(srcType);

        navigator.camera.getPicture(function cameraSuccess(imageUri) {

            $scope.pictureUrl = imageUri;

            // You may choose to copy the picture, save it somewhere, or upload.
            createNewFileEntry(imageUri);

        }, function cameraError(error) {
            $ionicPopup.alert({
                title: $translate.instant('ISSUES_ADD_PHOTO_ERROR_TITLE'),
                template: $translate.instant('ISSUES_ADD_PHOTO_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUES_ADD_PHOTO_ERROR_ACCEPT')
            });

            console.debug("Unable to obtain picture: " + error, "app");

        }, options);
        
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
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        }
        return options;
    }

};
