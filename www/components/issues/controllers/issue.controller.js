module.exports = function ($scope, $state, $stateParams, IssuesFactory) {

    IssuesFactory.getIssue($stateParams.issueId).then(function (issue) {
        $scope.issue = issue;
        console.log(issue);
    });


};
