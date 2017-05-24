module.exports = function ($scope, $cordovaGeolocation, MapFactory) {

    // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        MapFactory.showIssueMap(position.coords.latitude, position.coords.longitude, function () {
            $scope.hideSpinner = true;
        });
    }, function(error){
        MapFactory.showLocationError();
        $scope.hideSpinner = true;
    });
};