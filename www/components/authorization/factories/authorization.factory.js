module.exports = function (hostname, $http, $localStorage, $ionicPopup, $translate) {

    function login(credentials) {
        return $http.post(hostname + "/login", JSON.stringify(credentials), {headers: {'Content-Type': 'application/json'}})
            .then(function (response) {
                return response.data;
            }, function (error) {
                // console.error(error.status);
                showAlert();
            });
    }

    function getUser() {
        return $localStorage.user;
    }

    function setUser(user) {
        $localStorage.user = user;
    }

    function clearUser() {
        delete $localStorage.user;
    }

    function getUsername() {
        if ($localStorage.user) {
            return $localStorage.user.local.username;
        }
    }

    function getAuthToken() {
        return $localStorage.authToken;
    }

    function setAuthToken(token) {
        $localStorage.authToken = token;
    }

    function clearAuthToken() {
        delete $localStorage.authToken;
    }

    function showAlert() {
        $ionicPopup.alert({
            title: $translate.instant('LOGIN_ERROR_TITLE'),
            template: $translate.instant('LOGIN_ERROR_EXPLANATION'),
            okText: $translate.instant('LOGIN_ERROR_ACCEPT')
        });
    }

    return {
        login: login,
        /*logout: logout,*/
        getUser: getUser,
        setUser: setUser,
        clearUser: clearUser,
        getUsername: getUsername,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        clearAuthToken: clearAuthToken
    };
};
