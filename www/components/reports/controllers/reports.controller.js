module.exports = function ($scope, ReportsFactory) {

  $scope.reports = ReportsFactory.getReports();

};
