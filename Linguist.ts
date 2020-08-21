class Linguist {
    private static readonly _linguisticInfoRegExp = /^([а-я]?)(\+?)$/i;

    private static readonly _grammaticalCases = [
        'и', // Именительный. Кто, что?
        'р', // Родительный. Кого, чего?
        'д', // Дательный. Кому, чему?
        'в', // Винительный. Кого, что?
        'т', // Творительный. Кем, чем?
        'п', // Предложный. О ком, о чём?
        'м', // Местный. Где?
    ];
    public static singularForm = 1;
    public static pluralForm = 2;

    public grammaticalCase: string;
    public singularOrPluralForm: number;

    public static looksLikeLinguisticInfo(linguisticInfo: string): boolean {
        return Linguist._linguisticInfoRegExp.test(linguisticInfo);
    }

    public static decompressGrammaticalCases(dictionary: { [grammaticalCase: string]: string }) {
        if (!dictionary['basis']) {
            throw new Error('Can\'t find basis');
        }
        let splittedBasis = dictionary['basis'].split(' ');
        for (let i in this._grammaticalCases) {
            let grammaticalCase = this._grammaticalCases[i];
            if (dictionary[grammaticalCase] === undefined) {
                throw new Error(`Grammatical case ${grammaticalCase} not found in dictionary ${JSON.stringify(dictionary)}`);
            }
            let splittedGrammaticalCase = dictionary[grammaticalCase].split(' ');
            for (let j in splittedGrammaticalCase) {
                splittedGrammaticalCase[j] = splittedBasis[j] + splittedGrammaticalCase[j];
            }
            dictionary[grammaticalCase] = splittedGrammaticalCase.join(' ');
        }
        delete dictionary.basis;
        dictionary['м'] = `в ${dictionary['м']}`;
        return dictionary;
    }

    private static isGrammaticalCase(grammaticalCase: string): boolean {
        return Linguist._grammaticalCases.indexOf(grammaticalCase) != -1;
    }

    public constructor(linguisticInfo: string, defaultGrammaticalCase: string) {
        linguisticInfo = (linguisticInfo || "").trim();
        let matches;
        if ((matches = (linguisticInfo || "").match(Linguist._linguisticInfoRegExp)) == null) {
            throw new Error(`Invalid linguistic information "${linguisticInfo}"`);
        }
        if (this.grammaticalCase = matches[1].toLowerCase()) {
            if (!Linguist.isGrammaticalCase(this.grammaticalCase)) {
                throw new Error(`Unknown grammatical case "${this.grammaticalCase}"`);
            }
        } else {
            this.grammaticalCase = defaultGrammaticalCase;
        }
        this.singularOrPluralForm = matches[2] ? Linguist.pluralForm : Linguist.singularForm;
    }

    public declinate(dictionary: { [grammaticalCase: string]: string[] }): string {
        if (dictionary[this.grammaticalCase] == undefined || dictionary[this.grammaticalCase][this.singularOrPluralForm-1] == undefined) {
            throw new Error("Can't declinate");
        }
        return dictionary[this.grammaticalCase][this.singularOrPluralForm-1];
    }
}