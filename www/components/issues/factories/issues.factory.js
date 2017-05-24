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
                console.log('API SUCCESS RESPONSE');
                console.log(response.data);

//                 if(issue.photoPath !== ""){
//                     console.log('photoPath: ' + issue.photoPath);
                    
//                     if(response.data._id !== null){
//                         //Variables for file transfer
//                         var server = "plaats hier de server URL";
//                         var targetPath = issue.photoPath;
//                         var trustHosts = true;
//                         var options = {};
//                         options.fileName = "hier komt de bestandsnaam";

//                         $cordovaFileTransfer.upload(server, targetPath, options, trustAllHosts)
//                             .then(function(result) {
//                                 // Success!
//                                 console.log("FILETRANSFER SUCCESS" );
//                                 console.log(result);

//                                 $ionicPopup.alert({
//                                     title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
//                                     template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
//                                     okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
//                                 });
//                             }, function(err) {
//                                 // Error
//                                 console.log("FILETRANSFER ERROR" );
//                                 console.error(err);

//                                 $ionicPopup.alert({
//                                     title: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_TITLE'),
//                                     template: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_EXPLANATION'),
//                                     okText: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_ACCEPT')
//                                 });
//                             }, function (progress) {
//                                 // constant progress updates
//                                 console.log("FILETRANSFER PROGRESS");
//                                 console.log(progress);
//                         });
//                     } else {
//                         console.log("Response from API had no issue _id");
//                         $ionicPopup.alert({
//                             title: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_TITLE'),
//                             template: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_EXPLANATION'),
//                             okText: $translate.instant('ISSUE_POST_PHOTO_UPLOAD_ERROR_ACCEPT')
//                         });
//                     }
// 
//                     
//                 } else {
                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                        template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                    });
//                 }

                return response.data;
            }, function(error) {
                $ionicPopup.alert({
                    title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                    template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                    okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
                });
                console.log('API ERROR RESPONSE');
                console.log(error);
            });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};
