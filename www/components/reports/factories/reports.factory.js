module.exports = function () {
  var reports = [
    {
      id: 0,
      straat: "Zorgvlietstraat",
      huisnummer: 491,
      postcode: "4834 NH",
      plaats: "Breda",
      toelichting: "Te hoge stoeprand",
      foto: "img/locatie.png",
      datum_gemeld: "2017-02-20",
      datum_opgelost: null
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
      datum_opgelost: "2017-02-15"
    }
  ];

  function getReports() {
    return reports;
  }

  function getReport(reportId) {
    for(var i = 0; i < reports.length; i++) {
      if (reports[i].id === parseInt(reportId)) {
        return reports[i];
      }
    }
    return null;
  }

  return {
    getReports: getReports,
    getReport: getReport
  };
};
