module.exports = function ($scope, $stateParams, ReportsFactory) {

  $scope.report = ReportsFactory.getReport($stateParams.reportId);

  $scope.addPhoto = function () {
    $scope.showPhoto = true;
  };

  $scope.removePhoto = function () {
    $scope.showPhoto = false;
  };

};
