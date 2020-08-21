class Macros {
    private readonly _htmlSpecialChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    private readonly _numericRegExp = /^[+-]?\d+([\.,]\d+)?$/;

    private readonly _dateFormatter: DateFormatter;
    private readonly _queryStringParams: { [name: string]: string };

    private get _regionDictionary(): { [grammaticalCase: string]: string[] } | string {
        if (this.__regionDictionary === null) {
            if (/=/.test(this._queryStringParams['region'])) {
                let dictionary1 = Linguist.decompressGrammaticalCases(this.parseSplittedParts(this._queryStringParams['region'].split('&')));
                if (dictionary1.key) {
                    delete dictionary1.key;
                }
                this.__regionDictionary = {};
                for (let grammaticalCase in dictionary1) {
                    let value = dictionary1[grammaticalCase];
                    this.__regionDictionary[grammaticalCase] = [value, value];
                }
            } else { // Simple case
                this.__regionDictionary = (this._queryStringParams['region'] || '').toString();
            }
        }
        return this.__regionDictionary;
    }
    private __regionDictionary: { [grammaticalCase: string]: string[] } | string = null;

    public constructor() {
        this._dateFormatter = new DateFormatter(new Date());
        let splittedQueryString = (promoRouter.queryString || '').replace(/\+/g,'%20').split('&');
        this._queryStringParams = this.parseSplittedParts(splittedQueryString);
    }

    private parseSplittedParts(splittedParts: string[]): { [key: string]: string } {
        let result = {};
        for (let i = 0; i < splittedParts.length; i++) {
            let pair = splittedParts[i].split('=');
            let key;
            if (pair.length >= 2 && pair[0] && (key = decodeURIComponent(pair[0]))) {
                result[key] = pair[1] ? decodeURIComponent(pair[1]) : "";
            }
        }
        return result;
    }

    public city(needToEscape: boolean = false): string {
        return <string>this.processParam('city', '', needToEscape);
    }

    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param needToEscape
     * @return string region on similarity в Северо-Казахстанской области
     */
    public region(linguisticInfo: string = "", needToEscape: boolean = false): string {
        let result;
        if (typeof this._regionDictionary == 'string') {
            result = this._regionDictionary;
        } else {
            let linguist = new Linguist(linguisticInfo, 'и');
            result = linguist.declinate(this._regionDictionary);
        }
        if (needToEscape) {
            result = this.escapeHtml(result);
        }
        return result;
    }

    public oldPrice(): number {
        return <number>this.processParam('oldPrice', 0);
    }

    public price(): number {
        return <number>this.processParam('price', 0);
    }

    public currency(needToEscape: boolean = false): string {
        return <string>this.processParam('cur', '', needToEscape);
    }

    public discount(): number {
        let result = 0;
        let oldPrice = this.oldPrice();
        if (oldPrice != 0) {
            result = Math.round((1 - this.price() / oldPrice) * 100);
        }
        return result;
    }

    private processParam(paramName: string, defaultValue: string|number, needToEscape: boolean = false): string|number {
        let result: string|number = (this._queryStringParams[paramName] || defaultValue).toString();
        if (needToEscape) {
            result = this.escapeHtml(result);
        }
        if (typeof defaultValue == 'number') {
            if (this._numericRegExp.test(<string>result)) {
                result = parseFloat(<string>result) || 0;
                if (result % 1 != 0) {
                    result = result.toFixed(2);
                }
            } else {
                result = defaultValue;
            }
        }
        return result;
    }

    private escapeHtml(text) {
        return text.replace(/[&<>"']/g, (m) => {
            return this._htmlSpecialChars[m];
        });
    }


    /**
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string «digital» date on similarity 13.06.2018
     */
    public digitalDate(dateInputFormat: string = ""): string {
        return this._dateFormatter.digitalDate(dateInputFormat);
    }

    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января 2018
     */
    public date(linguisticInfo: string = "", dateInputFormat: string = "") {
        return this._dateFormatter.date(linguisticInfo, dateInputFormat);
    }

    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity 28 января
     */
    public shortDate(linguisticInfo: string = "", dateInputFormat: string = "") {
        return this._dateFormatter.shortDate(linguisticInfo, dateInputFormat);
    }

    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity январь
     */
    public month(linguisticInfo: string = "", dateInputFormat: string = "") {
        return this._dateFormatter.month(linguisticInfo, dateInputFormat);
    }

    /**
     * @param linguisticInfo concatination the grammatical case and symbol + (optional)
     * @param dateInputFormat first argument of method DateParser.parse()
     * @return string date on similarity понедельник
     */
    public weekDay(linguisticInfo: string = "", dateInputFormat: string = "") {
        return this._dateFormatter.weekDay(linguisticInfo, dateInputFormat);
    }


    /**
     * @return html code of form
     */
    public form(): string {
        return defaultForm.generateForm(true).outerHTML;
    }

    
    /**
     * @param language language code
     * @return html code on policy page
     */
    public policy(language: string = null): string {
        if (!language || LanguageHelper.implemented.indexOf(language) == -1) {
            language = LanguageHelper.detect();
        }
        return `<a href='/wp-includes/policy/${language}.htm' target='_blank' style='color: inherit'>${CookieConsent.messages.policyBottomLink[language]}</a>`;
    }

    public comeback(text: string) {
        promoRouter.enableComeback(text);
    }
}

let macros = new Macros();