module.exports = function ($scope, IssuesFactory) {

  IssuesFactory.getIssues().then(function (issues) {
    $scope.issues = issues;
  });

};