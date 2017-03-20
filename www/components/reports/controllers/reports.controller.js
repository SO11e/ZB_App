module.exports = function ($scope, ReportsFactory) {

  $scope.reports = ReportsFactory.getReports();

  /*ReportsFactory.getReports().then(function (reports) {
      $scope.reports = reports;
  })*/

};
