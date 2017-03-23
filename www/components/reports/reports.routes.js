module.exports = function ($stateProvider) {
    $stateProvider
        .state('app.reports', {
            url: '/reports',
            views: {
                'reports': {
                    templateUrl: 'components/reports/templates/reports.html',
                    controller: 'ReportsController'
                }
            }
        })

        .state('app.reports.details', {
            url: '/:reportId',
            views: {
                'reports@app': {
                    templateUrl: 'components/reports/templates/reports.details.html',
                    controller: 'ReportController'
                }
            }
        })

        .state('app.reports.add', {
            url: '/add',
            views: {
                'reports@app': {
                    templateUrl: 'components/reports/templates/reports.add.html',
                    controller: 'ReportController'
                }
            }
        });
};
