var mainModule = angular.module('zonnebloem.main', []);

mainModule.value('hostname', "https://zb-api.herokuapp.com");

mainModule.config(require("./main.routes"));
mainModule.config(require("./main.translation"));

module.exports = mainModule;