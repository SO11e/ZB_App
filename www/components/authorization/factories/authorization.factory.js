module.exports = function (hostname, $http, $localStorage, $ionicPopup, $translate) {

    function login(credentials) {
        return $http.post(hostname + "/login", JSON.stringify(credentials), { headers: { 'Content-Type': 'application/json' } })
            .then(function (response) {
                return response.data;
            }, function (error) {
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

    function getAuthToken() {
        return $localStorage.authToken;
    }

    function setAuthToken(token) {
        $localStorage.authToken = token;
    }

    function clearAuthToken() {
        delete $localStorage.authToken;
    }

    function getUserRegion() {
        if ($localStorage.user) {
            return $localStorage.user.region._id;
        }
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
        getUser: getUser,
        setUser: setUser,
        clearUser: clearUser,
        getAuthToken: getAuthToken,
        setAuthToken: setAuthToken,
        clearAuthToken: clearAuthToken,
        getUserRegion: getUserRegion
    };
};
