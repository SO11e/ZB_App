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
                AuthorizationFactory.setUser(data.user);

                $state.go('app.map');
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
