module.exports = function ($scope, $translate, SettingsFactory, AuthorizationFactory ) {

    SettingsFactory.getMe().then(function(user) {
        $scope.user = AuthorizationFactory.getUser();
    });

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};
