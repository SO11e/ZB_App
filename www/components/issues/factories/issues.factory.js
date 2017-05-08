module.exports = function ($http) {

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OTBlMzk4N2NjNDIyNzAwMDRlZDQ0NTAiLCJlbWFpbCI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkLjg1bHJzVUFYYS5KTGFMaVlOajFVTzVYaHZmNHBkWGRrL1dvejhRT2J1bWw5QUthOTB4MUcifQ.iVq_k4Xw6G4vPbs8arf3LfILeifglrVPKIvaHXS9uKE";

    function getIssues() {
        return $http.get("https://zb-api.herokuapp.com/issues", { headers: { 'bearer': token } } ).then(function (response) {
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

    return {
        getIssues: getIssues,
        getIssue: getIssue
    };
};
