module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.login', {
            url: '/login',
            views: {
                'login': {
                    templateUrl: 'components/authorization/templates/login.html',
                    controller: 'LoginController'
                }
            }
        });
};
