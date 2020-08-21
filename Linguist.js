var Linguist = /** @class */ (function () {
    function Linguist(linguisticInfo, defaultGrammaticalCase) {
        linguisticInfo = (linguisticInfo || "").trim();
        var matches;
        if ((matches = (linguisticInfo || "").match(Linguist._linguisticInfoRegExp)) == null) {
            throw new Error("Invalid linguistic information \"" + linguisticInfo + "\"");
        }
        if (this.grammaticalCase = matches[1].toLowerCase()) {
            if (!Linguist.isGrammaticalCase(this.grammaticalCase)) {
                throw new Error("Unknown grammatical case \"" + this.grammaticalCase + "\"");
            }
        }
        else {
            this.grammaticalCase = defaultGrammaticalCase;
        }
        this.singularOrPluralForm = matches[2] ? Linguist.pluralForm : Linguist.singularForm;
    }
    Linguist.looksLikeLinguisticInfo = function (linguisticInfo) {
        return Linguist._linguisticInfoRegExp.test(linguisticInfo);
    };
    Linguist.decompressGrammaticalCases = function (dictionary) {
        if (!dictionary['basis']) {
            throw new Error('Can\'t find basis');
        }
        var splittedBasis = dictionary['basis'].split(' ');
        for (var i in this._grammaticalCases) {
            var grammaticalCase = this._grammaticalCases[i];
            if (dictionary[grammaticalCase] === undefined) {
                throw new Error("Grammatical case " + grammaticalCase + " not found in dictionary " + JSON.stringify(dictionary));
            }
            var splittedGrammaticalCase = dictionary[grammaticalCase].split(' ');
            for (var j in splittedGrammaticalCase) {
                splittedGrammaticalCase[j] = splittedBasis[j] + splittedGrammaticalCase[j];
            }
            dictionary[grammaticalCase] = splittedGrammaticalCase.join(' ');
        }
        delete dictionary.basis;
        dictionary['м'] = "\u0432 " + dictionary['м'];
        return dictionary;
    };
    Linguist.isGrammaticalCase = function (grammaticalCase) {
        return Linguist._grammaticalCases.indexOf(grammaticalCase) != -1;
    };
    Linguist.prototype.declinate = function (dictionary) {
        if (dictionary[this.grammaticalCase] == undefined || dictionary[this.grammaticalCase][this.singularOrPluralForm - 1] == undefined) {
            throw new Error("Can't declinate");
        }
        return dictionary[this.grammaticalCase][this.singularOrPluralForm - 1];
    };
    Linguist._linguisticInfoRegExp = /^([а-я]?)(\+?)$/i;
    Linguist._grammaticalCases = [
        'и',
        'р',
        'д',
        'в',
        'т',
        'п',
        'м',
    ];
    Linguist.singularForm = 1;
    Linguist.pluralForm = 2;
    return Linguist;
}());
