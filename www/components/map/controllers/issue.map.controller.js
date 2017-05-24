module.exports = function ($scope, $cordovaGeolocation, IssueMapFactory) {

    // Google Maps options
    var options = {
        timeout: 10000,
        enableHighAccuracy: true
    };

    // Sets map to current location
    $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
        IssueMapFactory.showMap(position.coords.latitude, position.coords.longitude)
        $scope.hideSpinner = true;
    }, function(error){
        IssueMapFactory.showLocationError();
        $scope.hideSpinner = true;
    });
};