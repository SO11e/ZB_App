var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("IssueMapController", require("./controllers/issue.map.controller.js"));
mapModule.controller('MapController', require('./controllers/map.controller.js'));
mapModule.factory("IssuesFactory", require("./../issues/factories/issues.factory.js"));
mapModule.factory("RoutesWalkedFactory", require("./factories/routesWalked.factory.js"));

mapModule.config(require("./map.routes.js"));
module.exports = mapModule;