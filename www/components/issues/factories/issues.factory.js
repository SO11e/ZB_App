module.exports = function (hostname, $http, AuthorizationFactory) {
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

    return {
        getIssues: getIssues,
        getIssue: getIssue
    };
};