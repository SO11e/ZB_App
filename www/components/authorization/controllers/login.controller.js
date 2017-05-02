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
