var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller('MapController', require('./controllers/map.controller.js'));

mapModule.factory("MapFactory", require("./factories/issue.map.factory.js"));
mapModule.factory("RoutesWalkedFactory", require("./factories/routesWalked.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;