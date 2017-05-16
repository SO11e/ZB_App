module.exports = function ($stateProvider) {
  $stateProvider
    .state('app.settings', {
      url: '/settings',
      views: {
        'settings': {
          templateUrl: 'components/settings/templates/settings.html',
          controller: 'SettingsController'
        },
        'logout@app.settings': {
            templateUrl: 'components/authorization/templates/logout.html',
            controller: 'LogoutController'
        }
      }
    });
};
