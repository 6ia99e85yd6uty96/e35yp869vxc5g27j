var DateFormatter = /** @class */ (function () {
    function DateFormatter(srcDate) {
        this._months = {
            'ru': [
                {
                    'и': ['январь', 'январи'],
                    'р': ['января', 'январей'],
                    'д': ['январю', 'январям'],
                    'в': ['январь', 'январи'],
                    'т': ['январём', 'январями'],
                    'п': ['январе', 'январях'],
                    'м': ['в январе', 'в январях'],
                },
                {
                    'и': ['февраль', 'феврали'],
                    'р': ['февраля', 'февралей'],
                    'д': ['февралю', 'февралям'],
                    'в': ['февраль', 'феврали'],
                    'т': ['февралём', 'февралями'],
                    'п': ['феврале', 'февралях'],
                    'м': ['в феврале', 'в февралях'],
                },
                {
                    'и': ['март', 'марты'],
                    'р': ['марта', 'мартов'],
                    'д': ['марту', 'мартам'],
                    'в': ['март', 'марты'],
                    'т': ['мартом', 'мартами'],
                    'п': ['марте', 'мартах'],
                    'м': ['в марте', 'в мартах'],
                },
                {
                    'и': ['апрель', 'апрели'],
                    'р': ['апреля', 'апрелей'],
                    'д': ['апрелю', 'апрелям'],
                    'в': ['апрель', 'апрели'],
                    'т': ['апрелем', 'апрелями'],
                    'п': ['апреле', 'апрелях'],
                    'м': ['в апреле', 'в апрелях'],
                },
                {
                    'и': ['май', 'маи'],
                    'р': ['мая', 'маев'],
                    'д': ['маю', 'маям'],
                    'в': ['май', 'маи'],
                    'т': ['маем', 'маями'],
                    'п': ['мае', 'маях'],
                    'м': ['в мае', 'в маях'],
                },
                {
                    'и': ['июнь', 'июни'],
                    'р': ['июня', 'июней'],
                    'д': ['июню', 'июням'],
                    'в': ['июнь', 'июни'],
                    'т': ['июнем', 'июнями'],
                    'п': ['июне', 'июнях'],
                    'м': ['в июне', 'в июнях'],
                },
                {
                    'и': ['июль', 'июли'],
                    'р': ['июля', 'июлей'],
                    'д': ['июлю', 'июлям'],
                    'в': ['июль', 'июли'],
                    'т': ['июлем', 'июлями'],
                    'п': ['июле', 'июлях'],
                    'м': ['в июле', 'в июлях'],
                },
                {
                    'и': ['август', 'августы'],
                    'р': ['августа', 'августов'],
                    'д': ['августу', 'августам'],
                    'в': ['август', 'августы'],
                    'т': ['августом', 'августами'],
                    'п': ['августе', 'августах'],
                    'м': ['в августе', 'в августах'],
                },
                {
                    'и': ['сентябрь', 'сентябри'],
                    'р': ['сентября', 'сентябрей'],
                    'д': ['сентябрю', 'сентябрям'],
                    'в': ['сентябрь', 'сентябри'],
                    'т': ['сентябрём', 'сентябрями'],
                    'п': ['сентябре', 'сентябрях'],
                    'м': ['в сентябре', 'в сентябрях'],
                },
                {
                    'и': ['октябрь', 'октябри'],
                    'р': ['октября', 'октябрей'],
                    'д': ['октябрю', 'октябрям'],
                    'в': ['октябрь', 'октябри'],
                    'т': ['октябрём', 'октябрями'],
                    'п': ['октябре', 'октябрях'],
                    'м': ['в октябре', 'в октябрях'],
                },
                {
                    'и': ['ноябрь', 'ноябри'],
                    'р': ['ноября', 'ноябрей'],
                    'д': ['ноябрю', 'ноябрям'],
                    'в': ['ноябрь', 'ноябри'],
                    'т': ['ноябрём', 'ноябрями'],
                    'п': ['ноябре', 'ноябрях'],
                    'м': ['в ноябре', 'в ноябрях'],
                },
                {
                    'и': ['декабрь', 'декабри'],
                    'р': ['декабря', 'декабрей'],
                    'д': ['декабрю', 'декабрям'],
                    'в': ['декабрь', 'декабри'],
                    'т': ['декабрём', 'декабрями'],
                    'п': ['декабре', 'декабрях'],
                    'м': ['в декабре', 'в декабрях'],
                },
            ],
            'en': [
                {
                    'и': ['January'],
                    'м': ['in January'],
                },
                {
                    'и': ['February'],
                    'м': ['in February'],
                },
                {
                    'и': ['March'],
                    'м': ['in March'],
                },
                {
                    'и': ['April'],
                    'м': ['in April'],
                },
                {
                    'и': ['May'],
                    'м': ['in May'],
                },
                {
                    'и': ['June'],
                    'м': ['in June'],
                },
                {
                    'и': ['July'],
                    'м': ['in July'],
                },
                {
                    'и': ['August'],
                    'м': ['in August'],
                },
                {
                    'и': ['September'],
                    'м': ['in September'],
                },
                {
                    'и': ['October'],
                    'м': ['in October'],
                },
                {
                    'и': ['November'],
                    'м': ['in November'],
                },
                {
                    'и': ['December'],
                    'м': ['in December'],
                },
            ]
        };
        this._weekDays = {
            'ru': [
                {
                    'и': ['воскресенье', 'воскресенья'],
                    'р': ['воскресенья', 'воскресений'],
                    'д': ['воскресенью', 'воскресеньям'],
                    'в': ['воскресенье', 'воскресенья'],
                    'т': ['воскресеньем', 'воскресеньями'],
                    'п': ['воскресенье', 'воскресеньях'],
                    'м': ['в воскресенье', 'в воскресеньях'],
                },
                {
                    'и': ['понедельник', 'понедельники'],
                    'р': ['понедельника', 'понедельников'],
                    'д': ['понедельнику', 'понедельникам'],
                    'в': ['понедельник', 'понедельники'],
                    'т': ['понедельником', 'понедельниками'],
                    'п': ['понедельнике', 'понедельниках'],
                    'м': ['в понедельнике', 'в понедельниках'],
                },
                {
                    'и': ['вторник', 'вторники'],
                    'р': ['вторника', 'вторников'],
                    'д': ['вторнику', 'вторникам'],
                    'в': ['вторник', 'вторники'],
                    'т': ['вторником', 'вторниками'],
                    'п': ['вторнике', 'вторниках'],
                    'м': ['в вторнике', 'в вторниках'],
                },
                {
                    'и': ['среда', 'среды'],
                    'р': ['среды', 'сред'],
                    'д': ['среде', 'средам'],
                    'в': ['среду', 'среды'],
                    'т': ['средой', 'средами'],
                    'п': ['среде', 'средах'],
                    'м': ['в среде', 'в средах'],
                },
                {
                    'и': ['четверг', 'четверги'],
                    'р': ['четверга', 'четвергов'],
                    'д': ['четвергу', 'четвергам'],
                    'в': ['четверг', 'четверги'],
                    'т': ['четвергом', 'четвергами'],
                    'п': ['четверге', 'четвергах'],
                    'м': ['в четверге', 'в четвергах'],
                },
                {
                    'и': ['пятница', 'пятницы'],
                    'р': ['пятницы', 'пятниц'],
                    'д': ['пятнице', 'пятницам'],
                    'в': ['пятницу', 'пятницы'],
                    'т': ['пятницей', 'пятницами'],
                    'п': ['пятнице', 'пятницах'],
                    'м': ['в пятнице', 'в пятницах'],
                },
                {
                    'и': ['суббота', 'субботы'],
                    'р': ['субботы', 'суббот'],
                    'д': ['субботе', 'субботам'],
                    'в': ['субботу', 'субботы'],
                    'т': ['субботой', 'субботами'],
                    'п': ['субботе', 'субботах'],
                    'м': ['в субботе', 'в субботах'],
                },
            ],
            'en': [
                {
                    'и': ['Sunday', 'Sundays'],
                    'м': ['on Sunday', 'on Sundays'],
                },
                {
                    'и': ['Monday', 'Mondays'],
                    'м': ['on Monday', 'on Mondays'],
                },
                {
                    'и': ['Tuesday', 'Tuesdays'],
                    'м': ['on Tuesday', 'on Tuesdays'],
                },
                {
                    'и': ['Wednesday', 'Wednesdays'],
                    'м': ['on Wednesday', 'on Wednesdays'],
                },
                {
                    'и': ['Thursday', 'Thursdays'],
                    'м': ['on Thursday', 'on Thursdays'],
                },
                {
                    'и': ['Friday', 'Fridays'],
                    'м': ['on Friday', 'on Fridays'],
                },
                {
                    'и': ['Saturday', 'Saturdays'],
                    'м': ['on Saturday', 'on Saturdays'],
                },
            ]
        };
        this._srcDate = srcDate;
        this._dateParser = new DateParser();
        this._language = LanguageHelper.detect();
    }
    /**
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string «digital» date on similarity 13.06.2018
     */
    DateFormatter.prototype.digitalDate = function (dateInputFormat) {
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        var result;
        var dstDate = this._dateParser.parse(dateInputFormat, this._srcDate);
        if (this._language == 'ru') {
            result =
                this.addLeadZero(dstDate.getDate()) + '.' +
                    this.addLeadZero(dstDate.getMonth() + 1) + '.' +
                    dstDate.getFullYear();
        }
        else {
            result =
                dstDate.getFullYear() + '-' +
                    this.addLeadZero(dstDate.getMonth() + 1) + '-' +
                    this.addLeadZero(dstDate.getDate());
        }
        return result;
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января 2018
     */
    DateFormatter.prototype.date = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        var result;
        if (this.wereArgumentsSwapped(linguisticInfo, dateInputFormat)) {
            dateInputFormat = [linguisticInfo, linguisticInfo = dateInputFormat][0]; // Swap them back
        }
        var linguist = new Linguist(linguisticInfo, 'р');
        this.convertGrammaticalCase(linguist, false);
        var dstDate = this._dateParser.parse(dateInputFormat, this._srcDate);
        var dictionary = this._months[this._language][dstDate.getMonth()];
        if (this._language == 'ru') {
            result = this.addLeadZero(dstDate.getDate()) + ' ' + linguist.declinate(dictionary) + ' ' + dstDate.getFullYear();
        }
        else {
            result = linguist.declinate(dictionary) + ' ' + dstDate.getDate() + ', ' + dstDate.getFullYear();
        }
        return result;
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января
     */
    DateFormatter.prototype.shortDate = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        var result;
        if (this.wereArgumentsSwapped(linguisticInfo, dateInputFormat)) {
            dateInputFormat = [linguisticInfo, linguisticInfo = dateInputFormat][0]; // Swap them back
        }
        var linguist = new Linguist(linguisticInfo, 'р');
        this.convertGrammaticalCase(linguist, false);
        var dstDate = this._dateParser.parse(dateInputFormat, this._srcDate);
        var dictionary = this._months[this._language][dstDate.getMonth()];
        if (this._language == 'ru') {
            result = this.addLeadZero(dstDate.getDate()) + ' ' + linguist.declinate(dictionary);
        }
        else {
            result = linguist.declinate(dictionary) + ' ' + dstDate.getDate();
        }
        return result;
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity январь
     */
    DateFormatter.prototype.month = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        if (this.wereArgumentsSwapped(linguisticInfo, dateInputFormat)) {
            dateInputFormat = [linguisticInfo, linguisticInfo = dateInputFormat][0]; // Swap them back
        }
        var linguist = new Linguist(linguisticInfo, 'и');
        this.convertGrammaticalCase(linguist, false);
        var dstDate = this._dateParser.parse(dateInputFormat, this._srcDate);
        var dictionary = this._months[this._language][dstDate.getMonth()];
        return linguist.declinate(dictionary);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity понедельник
     */
    DateFormatter.prototype.weekDay = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        if (this.wereArgumentsSwapped(linguisticInfo, dateInputFormat)) {
            dateInputFormat = [linguisticInfo, linguisticInfo = dateInputFormat][0]; // Swap them back
        }
        var linguist = new Linguist(linguisticInfo, 'и');
        this.convertGrammaticalCase(linguist, true);
        var dstDate = this._dateParser.parse(dateInputFormat, this._srcDate);
        var dictionary = this._weekDays[this._language][dstDate.getDay()];
        return linguist.declinate(dictionary);
    };
    DateFormatter.prototype.wereArgumentsSwapped = function (linguisticInfo, dateInputFormat) {
        return !Linguist.looksLikeLinguisticInfo(linguisticInfo)
            && (!dateInputFormat || Linguist.looksLikeLinguisticInfo(dateInputFormat));
    };
    DateFormatter.prototype.convertGrammaticalCase = function (linguist, allowPlural) {
        if (this._language == 'en') {
            if (linguist.grammaticalCase != 'м') {
                linguist.grammaticalCase = 'и';
            }
            if (!allowPlural) {
                linguist.singularOrPluralForm = Linguist.singularForm;
            }
        }
    };
    DateFormatter.prototype.addLeadZero = function (str) {
        str = str.toString();
        if (str.length == 1) {
            str = '0' + str;
        }
        return str;
    };
    return DateFormatter;
}());
