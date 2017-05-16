module.exports = function ($scope, IssuesFactory) {

  $scope.issues = IssuesFactory.getIssues();
  
  IssuesFactory.getIssues().then(function(issues) {
        $scope.issues = issues;
    });

  /*ReportsFactory.getReports().then(function (issues) {
      $scope.issues = issues;
  })*/

};
