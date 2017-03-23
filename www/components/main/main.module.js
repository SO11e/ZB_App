var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;