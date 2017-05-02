module.exports = function ($http) {

    token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1OGZkZDBiYTMxNmRkMTE3YTBjN2Q3ZDQiLCJlbWFpbCI6InRlc3QiLCJwYXNzd29yZCI6IiQyYSQwOCR1SkNYNUkuNXBwRzkxMEhXeGg0M1R1TW9VVE9aU2xZejMuZjRDQ0dmaTBLcDFyQlY4b0E5aSJ9.0rjL5cYscwiDc1DnxSWN0E3LMfckTazh2tGoBLk-5k4";

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
