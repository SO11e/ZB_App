var mainModule = angular.module('zonnebloem.main', []);

mainModule.config(require("./main.routes"));

module.exports = mainModule;