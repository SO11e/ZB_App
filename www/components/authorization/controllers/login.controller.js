module.exports = function ($state, $scope, $ionicHistory, AuthorizationFactory) {

    $scope.$on('$ionicView.beforeEnter', function(){
        $scope.$root.hideTabs = "tabs-hide";
        $scope.credentials = {
            "email": "",
            "password": ""
        };
    });

    $scope.login = function () {
        AuthorizationFactory.login($scope.credentials).then(function (data) {
            if (data) {
                AuthorizationFactory.setAuthToken(data);

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
