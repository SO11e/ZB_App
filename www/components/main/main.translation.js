module.exports = function ($translateProvider) {

    $translateProvider
        .useStaticFilesLoader({
            prefix: 'locales/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['nl'], {
            'nl' : 'nl',
            'nl_NL': 'nl'
        })
        .preferredLanguage('nl')
        .fallbackLanguage('nl')
};