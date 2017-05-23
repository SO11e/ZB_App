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
