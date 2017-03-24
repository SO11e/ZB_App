var mapModule = angular.module('zonnebloem.map', []);

mapModule.controller("MapController", require("./controllers/map.controller"));

module.exports = mapModule;