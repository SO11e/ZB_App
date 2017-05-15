module.exports = function () {
    var routesWalked = [
        {
            userId: "1",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.688513,
                    longitude: 5.287445
                },
                {
                    latitude: 51.689298,
                    longitude: 5.287756
                },
                {
                    latitude: 51.689604,
                    longitude: 5.286731
                },
                {
                    latitude: 51.690953,
                    longitude: 5.287195
                }
            ]
        },
        {
            userId: "2",
            regionId: "1",
            waypoints:[
                {
                    latitude: 51.686144,
                    longitude: 5.289735
                },
                {
                    latitude: 51.685944,
                    longitude: 5.290808
                },
                {
                    latitude: 51.688418,
                    longitude: 5.291827
                },
                {
                    latitude: 51.688591,
                    longitude: 5.290808
                },
                {
                    latitude: 51.689249,
                    longitude: 5.291001
                }
            ]
        }
    ];

    function getRoutesWalked() {
        return routesWalked;

        /*return $http.get("HIER KOMT DE LINK NAAR DE API").then(function (routesWalked) {
         return routesWalked;
         });*/
    }

    return {
        getRoutesWalked: getRoutesWalked
    };
};
