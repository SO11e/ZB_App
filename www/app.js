require('./components/main/main.module');
require('./components/reports/reports.module');
require('./components/settings/settings.module');

angular.module('zonnebloem', [
        'ionic',
        'zonnebloem.main',
        'zonnebloem.reports',
        'zonnebloem.settings'
    ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
