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
