module.exports = function ($scope, $translate, $localStorage, AuthorizationFactory ) {

    $scope.lang = $localStorage.lang;
    $translate.use($localStorage.lang);

    $scope.user = AuthorizationFactory.getUser();

    $scope.switchLanguage = function (language) {
        $translate.use(language);
        $localStorage.lang = language;
        $scope.lang = $localStorage.lang;
    };

};
