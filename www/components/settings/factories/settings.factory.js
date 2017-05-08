module.exports = function ($http, $localStorage, AuthorizationFactory) {

    var token = AuthorizationFactory.getAuthToken();

    function getMe() {
        return $http.get("https://zb-api.herokuapp.com/users/me", { headers: { 'bearer': token } } ).then(function (response) {
            $localStorage.user = response.data;
        }, function(error) {
            console.error(error);
        });
    }

    return {
        getMe: getMe
    };
};
