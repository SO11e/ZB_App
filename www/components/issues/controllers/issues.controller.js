module.exports = function ($scope, $ionicScrollDelegate, IssuesFactory, AuthorizationFactory, $ionicLoading) {
  var page = 0;
  var amount = 10;
  var region = AuthorizationFactory.getUserRegion();

  $scope.$on('$ionicView.enter', function () {
    $scope.getIssuesForRegion();
  });

  $scope.getIssuesForRegion = function () {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    }).then(function () {
      IssuesFactory.getIssuesForRegion(region, page, amount).then(function (issues) {
        $scope.issues = issues;
        $scope.canLoadMore = canLoadMore(issues);
        $scope.$broadcast('scroll.refreshComplete');
        $ionicLoading.hide();
      });
    });
  }

  $scope.loadMore = function () {
    page++;

    IssuesFactory.getIssuesForRegion(region, page, amount).then(function (issues) {
      $scope.issues = $scope.issues.concat(issues);
      $scope.canLoadMore = canLoadMore(issues);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }

  $scope.filterIssues = function (issue) {
    $ionicScrollDelegate.scrollTop();

    if (!$scope.searchQuery) { return issue; }

    var searchQuery = removeSpecialCharacters($scope.searchQuery);
    var streetName = removeSpecialCharacters(issue.streetName);

    return streetName.indexOf(searchQuery) !== -1;
  }

  function canLoadMore(issues) {
    if (issues.length < amount) {
      return false;
    }

    return true;
  }

  function removeSpecialCharacters(string) {
    return string.replace(/[^\w]|_/g, "").toLowerCase();
  }

};