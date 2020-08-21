class DefaultForm {
    public static readonly messages = {
        oldPrice: {
            en: 'Regular price',
            ru: 'Цена товара',
            ro: 'Preț obișnuit',
            cs: 'Cena zboží',
            id: 'Harga reguler',
            es: 'Precio habitual',
            hi: 'नियमित मूल्य',
            hu: 'Megszokott ár',
        },
        price: {
            en: 'Special price',
            ru: 'Специальная цена',
            ro: 'Preț special',
            cs: 'Speciální cena',
            id: 'Harga spesial',
            es: 'Precio especial',
            hi: 'विशेष मूल्य',
            hu: 'Különleges ár',
        },
        name: {
            en: 'Enter your name',
            ru: 'Введите ваше имя',
            ro: 'Introduceți numele dvs.',
            cs: 'Zadejte své jméno',
            id: 'Masukkan nama Anda',
            es: 'Introduce tu nombre',
            hi: 'अपना नाम दर्ज करें',
            hu: 'Add meg a neved',
        },
        phoneNumber: {
            en: 'Enter phone number',
            ru: 'Введите номер телефона',
            ro: 'Introduceți numărul dvs. de telefon',
            cs: 'Zadejte telefonní číslo',
            id: 'Masukkan nomor telepon',
            es: 'Introduce tu número de teléfono',
            hi: 'फोन नंबर दर्ज करें',
            hu: 'Add meg a telefonszámod',
        },
        makeOrderButton: {
            en: 'Order Now',
            ru: 'Заказать',
            ro: 'Comandați acum',
            cs: 'Objednat nyní',
            id: 'Pesan Sekarang',
            es: 'Comprar ya',
            hi: 'अभी ऑर्डर करें',
            hu: 'Rendelj most',
        },
        closeButton: {
            en: 'Close',
            ru: 'Закрыть',
            ro: 'Închideți',
            cs: 'Zavřít',
            id: 'Dekat',
            es: 'Cerrar',
            hi: 'बंद करें',
            hu: 'Bezárás',
        },
    };
    public static readonly targetHash = '#defaultForm';

    private readonly _language: string;
    public resetHash: () => any;

    private readonly _defaultFormOverlay: HTMLElement;

    public constructor() {
        this._language = LanguageHelper.detect(['en', 'ru', 'ro', 'cs', 'id', 'es', 'hi', 'hu']);
        this._defaultFormOverlay = this.createDefaultFormOverlay();
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    private createDefaultFormOverlay() {
        let result = document.createElement('a');
        result.setAttribute('id', 'defaultFormOverlay');
        result.setAttribute('class', 'default-form-overlay');
        result.setAttribute('href', '#');
        result.setAttribute('onclick', 'defaultForm.onClose(arguments[0])');
        return result;
    }

    private init() {
        document.body.appendChild(this._defaultFormOverlay);
        document.body.appendChild(this.generateForm());
    }

    public generateForm(isStatic: boolean = false): HTMLElement {
        let result = document.createElement('div');
        result.setAttribute('class', 'default-form-popup' + (!isStatic ? ' fixed' : ''));
        result.innerHTML =
            `<div class='default-form-prices default-form-clearfix'>
                <div class='default-form-old-price'>
                    <div class='default-form-label'>${DefaultForm.messages.oldPrice[this._language]}:</div>
                    <span class='default-form-money'>${this.escapeHtml(macros.oldPrice())}</span>
                    <span class='default-form-currency'>${this.escapeHtml(macros.currency())}</span>
                </div>
                <div class='default-form-price'>
                    <div class='default-form-label'>${DefaultForm.messages.price[this._language]}:</div>
                    <span class='default-form-money'>${this.escapeHtml(macros.price())}</span>
                    <span class='default-form-currency'>${this.escapeHtml(macros.currency())}</span>
                </div>
            </div>
            <form class='default-form-form'>
                <input type='text' name='name' class='default-form-input' placeholder='${DefaultForm.messages.name[this._language]}'>
                <input type='text' name='phoneNumber' class='default-form-input' placeholder='${DefaultForm.messages.phoneNumber[this._language]}'>
                <button type='submit' class='default-form-make-order'>${DefaultForm.messages.makeOrderButton[this._language]}</button>
            </form>
            ${!isStatic ? "<a href='#' onclick='defaultForm.onClose(arguments[0])' class='default-form-close' title='" + DefaultForm.messages.closeButton[this._language] + "'></a>" : ""}`;
        return result;
    }

    private escapeHtml(string) {
        let span = document.createElement('span');
        span.innerText = string;
        return span.innerHTML;
    }

    public onClose(event: Event) {
        this._defaultFormOverlay.className = this._defaultFormOverlay.className.replace(/\bshown\b/, '').trim();
        this.addAnimatedClassIfNecessary();
        if (event) {
            event.preventDefault();
            this.resetHash();
        }
    }

    public show(isInitialization: boolean) {
        this._defaultFormOverlay.className += ' shown';
        if (!isInitialization) {
            this.addAnimatedClassIfNecessary();
        }
    }

    private addAnimatedClassIfNecessary() {
        if (!/\banimated\b/.test(this._defaultFormOverlay.className)) {
            this._defaultFormOverlay.className += ' animated';
        }
    }

    public isShown(): boolean {
        return /\bshown\b/.test(this._defaultFormOverlay.className);
    }

    public hide() {
        this.onClose(null);
    }
}

let defaultForm = new DefaultForm();