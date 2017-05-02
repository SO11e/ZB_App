module.exports = function ($scope, $translate, SettingsFactory) {

    SettingsFactory.getMe().then(function(user) {
        $scope.user = user;
    });

    $scope.switchLanguage = function (language) {
        localStorage.setItem("lang", language)
        $translate.use(language);
    };

};
