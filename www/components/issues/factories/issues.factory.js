module.exports = function (hostname, $http, AuthorizationFactory, $ionicPopup, $translate, $cordovaFileTransfer) {
    var token = AuthorizationFactory.getAuthToken();


    function getIssues() {
        return $http.get(hostname + "/issues", { headers: { 'bearer': token } } ).then(function (response) {
			
            //TEMP
			for (var i = 0; i < response.data.data.length; i++) {
			  response.data.data[i].photo = "img/chasseveld.png";
			}
			
			return response.data.data;
        }, function(error) {
            console.error(error);
        });
    }

    function getIssue(issueId) {
        return $http.get(hostname + "/issues/" + issueId, { headers: { 'bearer': token } } ).then(function (response) {
            return response.data;
        }, function(error) {
            console.error(error);
        });
    }

    function postIssue(issue) {
        var regionId = AuthorizationFactory.getUser().region._id;
        console.log('RegionId: ' + regionId);
        console.log('Token: ' + token);
        if(issue.street === "" || issue.city === "" || issue.postalCode === "" || issue.lat === "" || issue.lng === ""){
            console.error('Not all required issue properties are set');
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else if (issue.description === "") {
            console.error('Missing the description');
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_DESCRIPTION_ERROR_ACCEPT')
            });
        } else {
            console.log('Posting issue to API');
            console.log('streetName: ' + issue.street);
            console.log('city: ' + issue.city);
            console.log('zipCode: ' + issue.postalCode);
            console.log('description: ' + issue.description);
            console.log('region: ' + regionId);
            console.log('latitude: ' + issue.lat);
            console.log('longitude: ' + issue.lng);

            var postIssue = {
                streetName: issue.street,
                city: issue.city,
                zipCode: issue.postalCode,
                description: issue.description,
                region: regionId,
                latitude: issue.lat,
                longitude: issue.lng
            };

            return $http.post(hostname + '/issues', JSON.stringify(postIssue), {headers: {'bearer': token, 'Content-Type': 'application/json'}}).then(function(response){
                console.log('API RESPONSE');
                console.log(response);
                if(response.status !== undefined){
                    console.log(response.status);
                    if(response.status === 201){
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
            }, function(error){
                console.error(error);
            });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};