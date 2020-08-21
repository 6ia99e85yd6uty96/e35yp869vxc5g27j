class LanguageHelper {
    public static readonly defaultLanguage = 'en';
    public static readonly implemented = ['en', 'ru'];
    private static readonly _related = {
        uk: 'ru', // украинский
        be: 'ru', // белорусский
        kk: 'ru', // казахский
        ky: 'ru', // киргизский
        mo: 'ru', // молдавский
        ab: 'ru', // абхазский

        uz: 'ru', // узбекский
        ka: 'ru', // грузинский
        az: 'ru', // азербайджанский
        tg: 'ru', // таджикский
        hy: 'ru', // армянский
        tk: 'ru', // туркменский

        ba: 'ru', //башкирский
        //': 'ru', //бурятский
        sah: 'ru', //якутский
        kv: 'ru', //коми
        os: 'ru', //осетинский
        ce: 'ru', //чеченский
        cv: 'ru', //чувашский
        tt: 'ru', //татарский
        av: 'ru', //аварский
    };

    public static detect(implemented: string[] = null) {
        implemented = implemented || LanguageHelper.implemented;
        let result, lang;
        if ((lang = LanguageHelper.parseLanguage()) && (implemented.indexOf(lang) != -1 || (lang = LanguageHelper._related[lang]))) {
            result = lang;
        } else {
            result = LanguageHelper.defaultLanguage;
        }
        return result;
    }

    private static parseLanguage() {
        let result = null;
        let acceptLanguage = window.navigator['language'] || window.navigator['userLanguage'];
        let matches;
        if (acceptLanguage && (matches = acceptLanguage.match(/^([a-z]{2,3})([^a-z]|$)/i))) {
            result = matches[1].toLowerCase();
        }
        return result;
    }
}