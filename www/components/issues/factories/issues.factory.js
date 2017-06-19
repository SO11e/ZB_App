module.exports = function (hostname, $http, AuthorizationFactory, $ionicPopup, $translate, $cordovaFileTransfer) {
    var token = AuthorizationFactory.getAuthToken();

    function getIssues(page, amount = 500) {
        return $http.get(hostname + "/issues?page=" + page + "&perPage=" + amount, { headers: { 'bearer': token } }).then(function (response) {
            //TEMP
            for (var i = 0; i < response.data.data.length; i++) {
                response.data.data[i].photo = "img/zonnebloem.png";
            }

            return response.data.data;
        }, function (error) {
            console.error(error);
        });
    }

    function getIssuesForRegion(regionId, page, amount) {
        return $http.get(hostname + "/issues/region/" + regionId + "?page=" + page + "&perPage=" + amount, { headers: { 'bearer': token } }).then(function (response) {
            //TEMP
            for (var i = 0; i < response.data.data.length; i++) {
                response.data.data[i].photo = "img/chasseveld.png";
            }

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
                longitude: issue.lng
            };

            return $http.post(hostname + '/issues', JSON.stringify(postIssue), { headers: { 'bearer': token, 'Content-Type': 'application/json' } }).then(function (response) {
                if (response.status !== undefined) {
                    if (response.status === 201) {
                        $ionicPopup.alert({
                            title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                            template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                            okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                        });
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