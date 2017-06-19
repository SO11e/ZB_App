module.exports = function ($scope, AuthorizationFactory, SettingsFactory ) {

    $scope.user = AuthorizationFactory.getUser();

    $scope.switchLanguage = SettingsFactory.switchLanguage;

};
