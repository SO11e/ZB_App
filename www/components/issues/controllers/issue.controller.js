module.exports = function ($scope, $state, $stateParams, $cordovaGeolocation, IssuesFactory, IssueMapFactory) {

    IssuesFactory.getIssue($stateParams.issueId).then(function (issue) {
        $scope.issue = issue;
        IssueMapFactory.showMap($scope.issue.latitude, $scope.issue.longitude, function () {
            $scope.hideSpinner = true;
        });
    }, function (error) {
        console.error(error);
    });

};
