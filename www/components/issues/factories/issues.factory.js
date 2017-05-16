module.exports = function (hostname, $http, AuthorizationFactory, $ionicPopup, $translate) {
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
        /* for (var i = 0; i < issues.length; i++) {
            if (issues[i].id === parseInt(issueId)) {
                return issues[i];
            }
        }
        return null; */

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (report) {
            return report;
        });*/
    }

    function postIssue(issue) {
        console.log('Token: ' + token);

        if(issue.street === '' || issue.city === '' || issue.postalCode === '' || issue.description === '' || issue.lat === '' || issue.lng === ''){
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else {
            return $http.post(hostname + "/issues", {
                data: {    
                    'streetName': issue.street,
                    'place': issue.city,
                    'postalCode': issue.postalCode,
                    'description': issue.description,
                    'latitude': issue.lat,
                    'longitude': issue.lng
                }}, { 
                    headers: { 
                        'bearer': token 
                    }}).then(function (response) {
                
                console.log('API RESPONSE: ' + response.data.data);
                return response.data.data;
            }, function(error) {
                console.log('API ERROR: ' + error);
            });

            // var req = {
            //     method: 'POST',
            //     url: 'https://zb-api.herokuapp.com/issues',
            //     header: {
            //         'Content-Type': 'application/json',
            //         'bearer': token
            //     },
            //     data: {
            //         'streetName': issue.street,
            //         'place': issue.city,
            //         'postalCode': issue.postalCode,
            //         'description': issue.description,
            //         'latitude': issue.lat,
            //         'longitude': issue.lng
            //     }
            // };
            // console.log(req);

            // return $http(req)
            //     .then(function (response) {
            //         console.log(response);

            //         $ionicPopup.alert({
            //             title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
            //             template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
            //             okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
            //         });
            //     }, function (error) {
            //         console.log(error);

            //         $ionicPopup.alert({
            //             title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
            //             template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
            //             okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            //         });
            //     });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};