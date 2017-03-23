var reportsModule = angular.module('zonnebloem.reports', ['ionic', 'ngCordova']);

reportsModule.controller("ReportsController", require("./controllers/reports.controller"));
reportsModule.controller("ReportController", require("./controllers/report.controller"));

reportsModule.factory("ReportsFactory", require("./factories/reports.factory"));

reportsModule.config(require("./reports.routes"));

module.exports = reportsModule;