module.exports = function ($scope, $translate, AuthorizationFactory) {

    $scope.token = AuthorizationFactory.getAuthToken();

    $scope.switchLanguage = function (language) {
        $translate.use(language);
    };

};
