module.exports = function ($http) {

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OTBlMzk4N2NjNDIyNzAwMDRlZDQ0NTAiLCJlbWFpbCI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmEkMDgkLjg1bHJzVUFYYS5KTGFMaVlOajFVTzVYaHZmNHBkWGRrL1dvejhRT2J1bWw5QUthOTB4MUcifQ.iVq_k4Xw6G4vPbs8arf3LfILeifglrVPKIvaHXS9uKE";

    function getMe() {
        return $http.get("https://zb-api.herokuapp.com/users/me", { headers: { 'bearer': token } } ).then(function (response) {
            return response.data;
        }, function(error) {
            console.error(error);
        });
    }

    return {
        getMe: getMe
    };
};
