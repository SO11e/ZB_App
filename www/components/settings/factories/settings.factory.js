module.exports = function ($rootScope, $translate, $localStorage) {
    
    function switchLanguage(language) {
        $translate.use(language);
        $localStorage.lang = language;
        $rootScope.lang = $localStorage.lang;
    };

    return {
        switchLanguage: switchLanguage
    };
};
