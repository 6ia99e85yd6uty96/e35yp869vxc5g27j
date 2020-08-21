var LanguageHelper = /** @class */ (function () {
    function LanguageHelper() {
    }
    LanguageHelper.detect = function (implemented) {
        if (implemented === void 0) { implemented = null; }
        implemented = implemented || LanguageHelper.implemented;
        var result, lang;
        if ((lang = LanguageHelper.parseLanguage()) && (implemented.indexOf(lang) != -1 || (lang = LanguageHelper._related[lang]))) {
            result = lang;
        }
        else {
            result = LanguageHelper.defaultLanguage;
        }
        return result;
    };
    LanguageHelper.parseLanguage = function () {
        var result = null;
        var acceptLanguage = window.navigator['language'] || window.navigator['userLanguage'];
        var matches;
        if (acceptLanguage && (matches = acceptLanguage.match(/^([a-z]{2,3})([^a-z]|$)/i))) {
            result = matches[1].toLowerCase();
        }
        return result;
    };
    LanguageHelper.defaultLanguage = 'en';
    LanguageHelper.implemented = ['en', 'ru'];
    LanguageHelper._related = {
        uk: 'ru',
        be: 'ru',
        kk: 'ru',
        ky: 'ru',
        mo: 'ru',
        ab: 'ru',
        uz: 'ru',
        ka: 'ru',
        az: 'ru',
        tg: 'ru',
        hy: 'ru',
        tk: 'ru',
        ba: 'ru',
        //': 'ru', //бурятский
        sah: 'ru',
        kv: 'ru',
        os: 'ru',
        ce: 'ru',
        cv: 'ru',
        tt: 'ru',
        av: 'ru',
    };
    return LanguageHelper;
}());
