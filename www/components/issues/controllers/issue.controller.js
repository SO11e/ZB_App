module.exports = function ($scope, $state, $stateParams, $cordovaGeolocation, IssuesFactory, MapFactory) {

    IssuesFactory.getIssue($stateParams.issueId).then(function (issue) {
        $scope.issue = issue;
        MapFactory.showIssueMap($scope.issue.latitude, $scope.issue.longitude, function () {
            $scope.hideSpinner = true;
        });
    }, function (error) {
        console.error(error);
    });

<<<<<<< HEAD
=======

>>>>>>> development
};
