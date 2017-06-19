require('./components/main/main.module');
require('./components/authorization/authorization.module');
require('./components/map/map.module');
require('./components/issues/issues.module.js');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
    'ionic',
    'ngCordova',
	'ngStorage',
    'pascalprecht.translate',
    'zonnebloem.main',
    'zonnebloem.authorization',
    'zonnebloem.map',
    'zonnebloem.issues',
    'zonnebloem.settings'
])

    .run(function ($ionicPlatform, $state, $localStorage, AuthorizationFactory, SettingsFactory) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.Keyboard) {
                Keyboard.hideFormAccessoryBar(false);
                Keyboard.shrinkView(true);
                Keyboard.disableScrollingInShrinkView(true);
            }

            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }

            if (AuthorizationFactory.getAuthToken() === null || AuthorizationFactory.getAuthToken() === undefined) {
                $state.go('app.login');
            } else {
                $state.go('app.map');
            }
            
            SettingsFactory.switchLanguage($localStorage.lang);
            
        });
    });
