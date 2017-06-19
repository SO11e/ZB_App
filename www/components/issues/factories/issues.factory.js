module.exports = function (hostname, $http, AuthorizationFactory, $ionicPopup, $translate, $cordovaFileTransfer) {
    var token = AuthorizationFactory.getAuthToken();

    function getIssues(page, amount = 500) {
        return $http.get(hostname + "/issues?page=" + page + "&perPage=" + amount, { headers: { 'bearer': token } }).then(function (response) {
            return response.data.data;
        }, function (error) {
            console.error(error);
        });
    }

    function getIssuesForRegion(regionId, page, amount) {
        return $http.get(hostname + "/issues/region/" + regionId + "?page=" + page + "&perPage=" + amount, { headers: { 'bearer': token } }).then(function (response) {
            return response.data.data;
        }, function (error) {
            console.error(error);
        });
    }

    function getIssue(issueId) {
        return $http.get(hostname + "/issues/" + issueId, { headers: { 'bearer': token } }).then(function (response) {
			return response.data;
        }, function (error) {
            console.error(error);
        });
    }

    function postIssue(issue) {
        var regionId = AuthorizationFactory.getUser().region._id;
        if (issue.street === "" || issue.city === "" || issue.postalCode === "" || issue.lat === "" || issue.lng === "") {
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else if (issue.description === "") {
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_ACCEPT')
            });
        } else {
            var postIssue = {
                streetName: issue.street,
                city: issue.city,
                zipCode: issue.postalCode,
                description: issue.description,
                region: regionId,
                latitude: issue.lat,
                longitude: issue.lng,
                fullimage: issue.fullimage,
                thumbnail: issue.thumbnail
            };

            return $http.post(hostname + '/issues', JSON.stringify(postIssue), { headers: { 'bearer': token, 'Content-Type': 'application/json' } }).then(function (response) {
                if (response.status !== undefined) {
                    if (response.status === 201) {
                        return response.data;
                    }
                }
                $ionicPopup.alert({
                    title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                    template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                    okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
                });
                return response.data;
            }, function (error) {
                console.error(error);
            });
        }
    }

    return {
        getIssues: getIssues,
        getIssuesForRegion: getIssuesForRegion,
        getIssue: getIssue,
        postIssue: postIssue
    };
};