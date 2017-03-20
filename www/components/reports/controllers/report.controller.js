module.exports = function ($scope, $stateParams, ReportsFactory) {

    $scope.report = ReportsFactory.getReport($stateParams.reportId);

    /*ReportsFactory.getReport($stateParams.reportId).then(function (report) {
        $scope.report = report;
    });*/

    $scope.addPhoto = function () {
        $scope.showPhoto = true;
    };

    $scope.removePhoto = function () {
        $scope.showPhoto = false;
    };

};
