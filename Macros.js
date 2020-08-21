var Macros = /** @class */ (function () {
    function Macros() {
        this._htmlSpecialChars = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        this._numericRegExp = /^[+-]?\d+([\.,]\d+)?$/;
        this.__regionDictionary = null;
        this._dateFormatter = new DateFormatter(new Date());
        var splittedQueryString = (promoRouter.queryString || '').replace(/\+/g, '%20').split('&');
        this._queryStringParams = this.parseSplittedParts(splittedQueryString);
    }
    Object.defineProperty(Macros.prototype, "_regionDictionary", {
        get: function () {
            if (this.__regionDictionary === null) {
                if (/=/.test(this._queryStringParams['region'])) {
                    var dictionary1 = Linguist.decompressGrammaticalCases(this.parseSplittedParts(this._queryStringParams['region'].split('&')));
                    if (dictionary1.key) {
                        delete dictionary1.key;
                    }
                    this.__regionDictionary = {};
                    for (var grammaticalCase in dictionary1) {
                        var value = dictionary1[grammaticalCase];
                        this.__regionDictionary[grammaticalCase] = [value, value];
                    }
                }
                else { // Simple case
                    this.__regionDictionary = (this._queryStringParams['region'] || '').toString();
                }
            }
            return this.__regionDictionary;
        },
        enumerable: true,
        configurable: true
    });
    Macros.prototype.parseSplittedParts = function (splittedParts) {
        var result = {};
        for (var i = 0; i < splittedParts.length; i++) {
            var pair = splittedParts[i].split('=');
            var key = void 0;
            if (pair.length >= 2 && pair[0] && (key = decodeURIComponent(pair[0]))) {
                result[key] = pair[1] ? decodeURIComponent(pair[1]) : "";
            }
        }
        return result;
    };
    Macros.prototype.city = function (needToEscape) {
        if (needToEscape === void 0) { needToEscape = false; }
        return this.processParam('city', '', needToEscape);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param needToEscape
     * @return string region on similarity в Северо-Казахстанской области
     */
    Macros.prototype.region = function (linguisticInfo, needToEscape) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (needToEscape === void 0) { needToEscape = false; }
        var result;
        if (typeof this._regionDictionary == 'string') {
            result = this._regionDictionary;
        }
        else {
            var linguist = new Linguist(linguisticInfo, 'и');
            result = linguist.declinate(this._regionDictionary);
        }
        if (needToEscape) {
            result = this.escapeHtml(result);
        }
        return result;
    };
    Macros.prototype.oldPrice = function () {
        return this.processParam('oldPrice', 0);
    };
    Macros.prototype.price = function () {
        return this.processParam('price', 0);
    };
    Macros.prototype.currency = function (needToEscape) {
        if (needToEscape === void 0) { needToEscape = false; }
        return this.processParam('cur', '', needToEscape);
    };
    Macros.prototype.discount = function () {
        var result = 0;
        var oldPrice = this.oldPrice();
        if (oldPrice != 0) {
            result = Math.round((1 - this.price() / oldPrice) * 100);
        }
        return result;
    };
    Macros.prototype.processParam = function (paramName, defaultValue, needToEscape) {
        if (needToEscape === void 0) { needToEscape = false; }
        var result = (this._queryStringParams[paramName] || defaultValue).toString();
        if (needToEscape) {
            result = this.escapeHtml(result);
        }
        if (typeof defaultValue == 'number') {
            if (this._numericRegExp.test(result)) {
                result = parseFloat(result) || 0;
                if (result % 1 != 0) {
                    result = result.toFixed(2);
                }
            }
            else {
                result = defaultValue;
            }
        }
        return result;
    };
    Macros.prototype.escapeHtml = function (text) {
        var _this = this;
        return text.replace(/[&<>"']/g, function (m) {
            return _this._htmlSpecialChars[m];
        });
    };
    /**
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string «digital» date on similarity 13.06.2018
     */
    Macros.prototype.digitalDate = function (dateInputFormat) {
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        return this._dateFormatter.digitalDate(dateInputFormat);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января 2018
     */
    Macros.prototype.date = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        return this._dateFormatter.date(linguisticInfo, dateInputFormat);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января
     */
    Macros.prototype.shortDate = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        return this._dateFormatter.shortDate(linguisticInfo, dateInputFormat);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity январь
     */
    Macros.prototype.month = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        return this._dateFormatter.month(linguisticInfo, dateInputFormat);
    };
    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity понедельник
     */
    Macros.prototype.weekDay = function (linguisticInfo, dateInputFormat) {
        if (linguisticInfo === void 0) { linguisticInfo = ""; }
        if (dateInputFormat === void 0) { dateInputFormat = ""; }
        return this._dateFormatter.weekDay(linguisticInfo, dateInputFormat);
    };
    /**
     * @return html code of form
     */
    Macros.prototype.form = function () {
        return defaultForm.generateForm(true).outerHTML;
    };
    /**
     * @param language language code
     * @return html code on policy page
     */
    Macros.prototype.policy = function (language) {
        if (language === void 0) { language = null; }
        if (!language || LanguageHelper.implemented.indexOf(language) == -1) {
            language = LanguageHelper.detect();
        }
        return "<a href='/wp-includes/policy/" + language + ".htm' target='_blank' style='color: inherit'>" + CookieConsent.messages.policyBottomLink[language] + "</a>";
    };
    Macros.prototype.comeback = function (text) {
        promoRouter.enableComeback(text);
    };
    return Macros;
}());
var macros = new Macros();
