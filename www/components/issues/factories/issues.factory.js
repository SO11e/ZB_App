module.exports = function ($http, $ionicPopup, $translate) {
    var issues = [
        {
            id: 0,
            straat: "Zorgvlietstraat",
            huisnummer: 491,
            postcode: "4834 NH",
            plaats: "Breda",
            toelichting: "Te hoge stoeprand",
            foto: "img/locatie.png",
            datum_gemeld: "2017-02-20",
            datum_opgelost: null,
            latitude: 51.573438,
            longitude: 4.812773
        },
        {
            id: 1,
            straat: "Chasseveld",
            huisnummer: null,
            postcode: "4811 DH",
            plaats: "Breda",
            toelichting: "Hek op de stoep",
            foto: "img/chasseveld.png",
            datum_gemeld: "2017-01-04",
            datum_opgelost: "2017-02-15",
            latitude: 51.588875,
            longitude: 4.785663
        }
    ];

    function getIssues() {
        return issues;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (issues) {
            return issues;
        });*/
    }

    function getIssue(issueId) {
        for (var i = 0; i < issues.length; i++) {
            if (issues[i].id === parseInt(issueId)) {
                return issues[i];
            }
        }
        return null;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (report) {
            return report;
        });*/
    }

    var token = '';
    function postIssue(issue) {
        if(issue.street === '' || issue.city === '' || issue.postalCode === '' || issue.description === '' || issue.lat === '' || issue.lng === ''){
            $ionicPopup.alert({
                title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
            });
        } else {
            var req = {
                method: 'POST',
                url: 'https://zb-api.herokuapp.com/issues',
                header: {
                    'Content-Type': 'application/json',
                    'bearer': token
                },
                data: {
                    'streetName': issue.street,
                    'place': issue.city,
                    'postalCode': issue.postalCode,
                    'description': issue.description,
                    'latitude': issue.lat,
                    'longitude': issue.lng
                }
            };
            console.log(req);

            return $http(req)
                .then(function (response) {
                    console.log(response);

                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_SUCCESS_TITLE'),
                        template: $translate.instant('ISSUE_POST_SUCCESS_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_SUCCESS_ACCEPT')
                    });
                }, function (error) {
                    console.log(error);

                    $ionicPopup.alert({
                        title: $translate.instant('ISSUE_POST_ERROR_TITLE'),
                        template: $translate.instant('ISSUE_POST_ERROR_EXPLANATION'),
                        okText: $translate.instant('ISSUE_POST_ERROR_ACCEPT')
                    });
                });
        }
    }

    return {
        getIssues: getIssues,
        getIssue: getIssue,
        postIssue: postIssue
    };
};
