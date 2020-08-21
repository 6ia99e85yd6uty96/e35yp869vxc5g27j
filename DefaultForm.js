var DefaultForm = /** @class */ (function () {
    function DefaultForm() {
        var _this = this;
        this._language = LanguageHelper.detect(['en', 'ru', 'ro', 'cs', 'id', 'es', 'hi', 'hu']);
        this._defaultFormOverlay = this.createDefaultFormOverlay();
        document.addEventListener('DOMContentLoaded', function () { return _this.init(); });
    }
    DefaultForm.prototype.createDefaultFormOverlay = function () {
        var result = document.createElement('a');
        result.setAttribute('id', 'defaultFormOverlay');
        result.setAttribute('class', 'default-form-overlay');
        result.setAttribute('href', '#');
        result.setAttribute('onclick', 'defaultForm.onClose(arguments[0])');
        return result;
    };
    DefaultForm.prototype.init = function () {
        document.body.appendChild(this._defaultFormOverlay);
        document.body.appendChild(this.generateForm());
    };
    DefaultForm.prototype.generateForm = function (isStatic) {
        if (isStatic === void 0) { isStatic = false; }
        var result = document.createElement('div');
        result.setAttribute('class', 'default-form-popup' + (!isStatic ? ' fixed' : ''));
        result.innerHTML =
            "<div class='default-form-prices default-form-clearfix'>\n                <div class='default-form-old-price'>\n                    <div class='default-form-label'>" + DefaultForm.messages.oldPrice[this._language] + ":</div>\n                    <span class='default-form-money'>" + this.escapeHtml(macros.oldPrice()) + "</span>\n                    <span class='default-form-currency'>" + this.escapeHtml(macros.currency()) + "</span>\n                </div>\n                <div class='default-form-price'>\n                    <div class='default-form-label'>" + DefaultForm.messages.price[this._language] + ":</div>\n                    <span class='default-form-money'>" + this.escapeHtml(macros.price()) + "</span>\n                    <span class='default-form-currency'>" + this.escapeHtml(macros.currency()) + "</span>\n                </div>\n            </div>\n            <form class='default-form-form'>\n                <input type='text' name='name' class='default-form-input' placeholder='" + DefaultForm.messages.name[this._language] + "'>\n                <input type='text' name='phoneNumber' class='default-form-input' placeholder='" + DefaultForm.messages.phoneNumber[this._language] + "'>\n                <button type='submit' class='default-form-make-order'>" + DefaultForm.messages.makeOrderButton[this._language] + "</button>\n            </form>\n            " + (!isStatic ? "<a href='#' onclick='defaultForm.onClose(arguments[0])' class='default-form-close' title='" + DefaultForm.messages.closeButton[this._language] + "'></a>" : "");
        return result;
    };
    DefaultForm.prototype.escapeHtml = function (string) {
        var span = document.createElement('span');
        span.innerText = string;
        return span.innerHTML;
    };
    DefaultForm.prototype.onClose = function (event) {
        this._defaultFormOverlay.className = this._defaultFormOverlay.className.replace(/\bshown\b/, '').trim();
        this.addAnimatedClassIfNecessary();
        if (event) {
            event.preventDefault();
            this.resetHash();
        }
    };
    DefaultForm.prototype.show = function (isInitialization) {
        this._defaultFormOverlay.className += ' shown';
        if (!isInitialization) {
            this.addAnimatedClassIfNecessary();
        }
    };
    DefaultForm.prototype.addAnimatedClassIfNecessary = function () {
        if (!/\banimated\b/.test(this._defaultFormOverlay.className)) {
            this._defaultFormOverlay.className += ' animated';
        }
    };
    DefaultForm.prototype.isShown = function () {
        return /\bshown\b/.test(this._defaultFormOverlay.className);
    };
    DefaultForm.prototype.hide = function () {
        this.onClose(null);
    };
    DefaultForm.messages = {
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
    DefaultForm.targetHash = '#defaultForm';
    return DefaultForm;
}());
var defaultForm = new DefaultForm();
