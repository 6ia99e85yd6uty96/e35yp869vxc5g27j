var Logger = /** @class */ (function () {
    function Logger() {
        this._relativeUrl = "/successful/default/log";
    }
    Logger.prototype.init = function () {
        //window.onerror = (message: string, url: string, lineNumber: number, columnNumber: number, errorObj: Error) => this.onError(message, url, lineNumber, columnNumber, errorObj);
    };
    Logger.prototype.onError = function (message, url, lineNumber, columnNumber, errorObj) {
        if (!url || url.indexOf('bundle.js') == -1) {
            return;
        }
        var source = this.concatSource(url, lineNumber, columnNumber);
        var dataObject = this.createDataObject(source, message, errorObj);
        dataObject['v'] = 7;
        this.send(dataObject);
        return false;
    };
    Logger.prototype.concatSource = function (url, lineNumber, columnNumber) {
        url = url || "unknown";
        lineNumber = lineNumber || 0;
        columnNumber = columnNumber || 0;
        try {
            return url + ":" + lineNumber + ":" + columnNumber;
        }
        catch (e) {
            return "invalid source";
        }
    };
    Logger.prototype.createDataObject = function (source, message, errorObj) {
        try {
            if (errorObj) {
                errorObj = {
                    fileName: errorObj.fileName || null,
                    lineNumber: errorObj.lineNumber || null,
                    columnNumber: errorObj.columnNumber || null,
                    message: errorObj.message || null,
                    stack: errorObj.stack || null
                };
            }
            else {
                errorObj = null;
            }
            return {
                message: message,
                source: source,
                errorObj: errorObj,
                locationHref: window.location.href,
                navigator: this.cloneObject(window.navigator),
            };
        }
        catch (e) {
            return {
                message: "Unknown error while creating data object",
                source: "Logger.createDataObject",
            };
        }
    };
    Logger.prototype.cloneObject = function (obj) {
        var result = {};
        try {
            for (var key in navigator) {
                try {
                    result[key] = obj[key];
                }
                catch (e) { }
            }
        }
        catch (e) { }
        return result;
    };
    Logger.prototype.send = function (dataObject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this._relativeUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(dataObject));
        }
        catch (e) { }
    };
    return Logger;
}());
(new Logger()).init();
var FrameMode = /** @class */ (function () {
    function FrameMode() {
    }
    FrameMode.prototype.openInFrame = function () {
        try {
            return window.self !== window.top;
        }
        catch (e) {
            return true;
        }
    };
    FrameMode.prototype.postMessage = function (jsToEval) {
        window.parent.postMessage({ jsToEval: jsToEval }, '*');
    };
    return FrameMode;
}());
var frameMode = new FrameMode();
if (!window['ajaxPromoIntegration']) {
    window['ajaxPromoIntegration'] = (function () {
        var s; // style
        var b; // blank
        var l; // local storage key
        var d; // sid
        var r; // referrer
        var t; // token
        var q; // query string

        function A() {
            l = location.host + (location.pathname + location.search).length;
            d = localStorage[l] || a();
            r = localStorage[l + ':r'] || a2();
            q = location.search.replace(/(\?|&)utm_content=([^&]+)(&|$)/, function(m0, m1, m2, m3) {
                t = m2;
                return m3 ? m1 : '';
            });
        }

        function a() {
            localStorage[l] = (Math.random()+'').substr(2) + (Math.random()+'').substr(2);
            return localStorage[l];
        }

        function a2() {
            localStorage[l + ':r'] = document.referrer;
            return localStorage[l + ':r'];
        }

        A.prototype.p = function (u) {
            if (d != l && t) { // d == l означает, что трекер отдал вайт и таким образом этот ответ кешируется на стороне этого скрипта
                c(u + '/ajax/entry/' + t + '?__referrer=' + encodeURIComponent(r) + '&__sid=' + d + q.replace(/^\?/, '&'));
            }
        };
        A.prototype.l = function (u, queryString) {
            if (d != l && t) { // d == l означает, что трекер отдал вайт и таким образом этот ответ кешируется на стороне этого скрипта
                c(u + '/ajax/switch/' + t + '?__sid=' + d + '&' + queryString);
            }
        };

        function c(url) {
            e();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = function() {
                g();
                try {
                    var data = JSON.parse(xhr.responseText);
                    if (data.js) {
                        eval(data.js);
                    } else if (data.html) {
                        var title = document.title;
                        document.open();
                        document.write(data.html);
                        document.close();
                        document.title = title;
                    } else {
                        h(xhr, data);
                    }
                } catch (e) {
                    h(xhr, e);
                }
            };
            xhr.onerror = function() {
                g();
                h();
            };
            xhr.send();
        }

        function e() {
            b = document.createElement('div');
            b.className = 'b' + d;

            s = document.createElement('style');
            s.type = 'text/css';
            s.innerHTML = f(b.className);

            document.getElementsByTagName('head')[0].appendChild(s);
            document.body.appendChild(b);
        }

        function f(bClassName) {
            return 'html, body {\n' +
                'margin: 0 !important;\n' +
                'padding: 0 !important;\n' +
                'transform: none !important;\n' +
                'perspective: none !important;\n' +
                'filter: none !important;\n' +
                'will-change: none !important;\n' +
                '}\n' +
                'body { overflow: hidden !important; }\n' +
                '.' + bClassName + ' {\n' +
                'position: fixed;\n' +
                'top: 0;\n' +
                'right: 0;\n' +
                'bottom: 0;\n' +
                'left: 0;\n' +
                'width: 100%;\n' +
                'height: 100%;\n' +
                'background: white;\n' +
                'z-index: 9999999;\n' +
                '}\n';
        }

        function g() {
            s.parentElement.removeChild(s);
            b.parentElement.removeChild(b);
        }

        function h() {
            console.error(arguments);
        }

        return new A;
    }());

    /**
     * Следующий блок нужен только для вставки в шопифай
     */
    // document.addEventListener('DOMContentLoaded', function() {
    //     window['ajaxPromoIntegration'].p('http://promo.loc');
    // });
}var LanguageHelper = /** @class */ (function () {
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var AbstractPromoRouter = /** @class */ (function () {
    function AbstractPromoRouter() {
        this.promoTypeWhitePage = 'w';
        this._promoTypePreLanding = 'p';
        this._promoTypeLanding = 'l';
        this._isLocked = false;
        this._needToPushComebackHistory = false;
        this._comebackAlertShown = false;
        this._landingHash = '#switch';
        this._landingHashRegExp = /^#(switch)(:(.+))?$/;
    }
    Object.defineProperty(AbstractPromoRouter.prototype, "_promoType", {
        set: function (value) {
            throw new Error('Method set _promoType not overridden');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AbstractPromoRouter.prototype, "domainWithProtocol", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    AbstractPromoRouter.prototype.init = function () {
        var _this = this;
        if (this.promoType == this.promoTypeWhitePage) {
            return;
        }
        else if (this.promoType == this._promoTypePreLanding && (window.history.state == null || !window.history.state.hasOwnProperty('promoType'))) {
            this._needToPushComebackHistory = true;
        }
        else if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && this.promoType == this._promoTypeLanding && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        defaultForm.resetHash = function () { return _this.replaceStateInHistory(_this.promoType, document.title, {}, true); };
        window.addEventListener('popstate', function (event) { return _this.popState(event.state); });
        this.popState(null, true);
    };
    AbstractPromoRouter.prototype.popState = function (state, isInitialization) {
        if (isInitialization === void 0) { isInitialization = false; }
        this._isLocked = false;
        clearTimeout(this._comebackTimer);
        var matches;
        if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && (matches = window.location.hash.match(this._landingHashRegExp))) {
            this.switchToLanding(decodeURIComponent(matches[3] || ''));
        }
        else {
            var isBackForwardNavigation = true;
            if (state == null || !state.promoType) {
                state = this.setUpStateDataAgain();
                isBackForwardNavigation = false;
            }
            if (document.getElementById('successfulFrame') && isBackForwardNavigation) {
                window.postMessage('hideSuccessful', '*');
                window.history.go(1);
            }
            else if (state.comebackText) { // comeback
                this.alertComeback(state.comebackText);
                window.history.go(1);
            }
            else if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && this.promoType != state.promoType) {
                this._promoType = state.promoType;
                this.reload();
            }
            else if (window.location.hash == DefaultForm.targetHash && !defaultForm.isShown()) {
                defaultForm.show(isInitialization);
            }
            else if (defaultForm.isShown() && isBackForwardNavigation) {
                defaultForm.hide();
            }
        }
    };
    AbstractPromoRouter.prototype.resetLandingHash = function () {
        if (navigator.userAgent.match('CriOS')) { // Chrome on iOS
            this.replaceStateInHistory(this._promoTypeLanding, 'Loading...', {}, true);
        }
        else {
            this.replaceStateInHistory(this._promoTypeLanding, 'Loading...');
        }
    };
    AbstractPromoRouter.prototype.alertComeback = function (comebackText) {
        var _this = this;
        if (this._comebackAlertShown) {
            return;
        }
        this._comebackAlertShown = true;
        this.waitAndDo(function () {
            alert(comebackText);
            _this._comebackAlertShown = false;
            _this._comebackTimer = setTimeout(function () { return _this.switchByComeback(); }, 100);
        });
    };
    AbstractPromoRouter.prototype.waitAndDo = function (resolve) {
        var _this = this;
        this._isLocked = true;
        var timer = setInterval(function () {
            if (!_this._isLocked) {
                clearInterval(timer);
                resolve();
            }
        }, 25);
    };
    AbstractPromoRouter.prototype.switchByComeback = function () {
        window.location.hash = this._landingHash + ':comeback';
    };
    AbstractPromoRouter.prototype.replaceStateInHistory = function (promoType, title, data, pushState, url) {
        if (data === void 0) { data = {}; }
        if (pushState === void 0) { pushState = false; }
        if (url === void 0) { url = null; }
        data.promoType = promoType;
        if (!url) {
            url = window.location.pathname + window.location.search + (promoType == this._promoTypePreLanding ? '#' : '');
        }
        if (pushState) {
            window.history.pushState(data, title, url);
        }
        else {
            window.history.replaceState(data, title, url);
        }
    };
    AbstractPromoRouter.prototype.setUpStateDataAgain = function () {
        this.replaceStateInHistory(this.promoType, document.title, {}, false, this.getLocationHref());
        return window.history.state;
    };
    AbstractPromoRouter.prototype.enableComeback = function (text) {
        if (this._needToPushComebackHistory) {
            var url = this.getLocationHref();
            this.replaceStateInHistory(this.promoType, document.title, { comebackText: text }, false, window.location.pathname + window.location.search + '#');
            this.replaceStateInHistory(this.promoType, document.title, { comebackText: text }, true, window.location.pathname + window.location.search);
            this.replaceStateInHistory(this.promoType, document.title, {}, true, url);
            this._needToPushComebackHistory = false;
        }
    };
    AbstractPromoRouter.prototype.getLocationHref = function () {
        var result = window.location.href;
        if (this.promoType == this._promoTypePreLanding && result.indexOf('#') == -1) {
            result += '#';
        }
        return result;
    };
    return AbstractPromoRouter;
}());
var SingleUrlPromoRouter = /** @class */ (function (_super) {
    __extends(SingleUrlPromoRouter, _super);
    function SingleUrlPromoRouter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._promoTypeCookieName = _this._cookieNamePrefix + '_mrc'; // Magic Router Cookie
        _this._clickTypeCookieName = _this._promoTypeCookieName + '_ct';
        _this._thrown = false;
        return _this;
    }
    Object.defineProperty(SingleUrlPromoRouter.prototype, "_cookieNamePrefix", {
        get: function () {
            if (this.__cookieNamePrefix === undefined) {
                var path = window.location.pathname;
                this.__cookieNamePrefix = 0;
                for (var i = 0; i < path.length; i++) {
                    if (/^[\w-\/]$/i.test(path.charAt(i))) {
                        this.__cookieNamePrefix = (this.__cookieNamePrefix + path.charCodeAt(i)) % 10240;
                    }
                }
            }
            return this.__cookieNamePrefix;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleUrlPromoRouter.prototype, "promoType", {
        get: function () {
            var result = this.getCookie(this._promoTypeCookieName);
            if (!result) {
                result = this.promoTypeWhitePage;
                if (!this._thrown) {
                    this._thrown = true;
                    setTimeout(function () {
                        throw new Error('There is no magic router cookie');
                    }, 100);
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleUrlPromoRouter.prototype, "_promoType", {
        set: function (value) {
            this.setCookie(this._promoTypeCookieName, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleUrlPromoRouter.prototype, "_promoUrl", {
        get: function () {
            var result = null;
            if (this.promoType == this._promoTypePreLanding || this.promoType == this._promoTypeLanding) {
                result = this.getCookie(this._promoTypeCookieName + '_' + this.promoType);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SingleUrlPromoRouter.prototype, "queryString", {
        get: function () {
            var result = null;
            var promoUrl = this._promoUrl;
            var questionMarkPos;
            if (promoUrl && (questionMarkPos = promoUrl.indexOf('?')) != -1) {
                result = promoUrl.substr(questionMarkPos + 1);
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    SingleUrlPromoRouter.prototype.getCookie = function (name) {
        var result = null;
        var matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
        if (matches) {
            result = decodeURIComponent(matches[1]);
        }
        return result;
    };
    SingleUrlPromoRouter.prototype.setCookie = function (name, value) {
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
    };
    SingleUrlPromoRouter.prototype.switchToLanding = function (clickType) {
        if (clickType) {
            this.setCookie(this._clickTypeCookieName, clickType);
        }
        if (this.promoType != this._promoTypeLanding) {
            this.resetLandingHash();
            try {
                window.stop();
            }
            catch (e) { }
            this._promoType = this._promoTypeLanding;
            this.reload();
        }
    };
    SingleUrlPromoRouter.prototype.reload = function () {
        window.location.reload(true);
    };
    return SingleUrlPromoRouter;
}(AbstractPromoRouter));
var IframePromoRouter = /** @class */ (function (_super) {
    __extends(IframePromoRouter, _super);
    function IframePromoRouter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._thrown = false;
        return _this;
    }
    Object.defineProperty(IframePromoRouter.prototype, "promoType", {
        get: function () {
            var result;
            if (IframePromoRouter.preLandingPattern.test(window.location.pathname)) {
                result = this._promoTypePreLanding;
            }
            else if (IframePromoRouter.landingPattern.test(window.location.pathname)) {
                result = this._promoTypeLanding;
            }
            else {
                result = this.promoTypeWhitePage;
                if (!this._thrown) {
                    this._thrown = true;
                    setTimeout(function () {
                        throw new Error('Can\'t determine promo type');
                    }, 100);
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IframePromoRouter.prototype, "queryString", {
        get: function () {
            return window.location.search.substr(1);
        },
        enumerable: true,
        configurable: true
    });
    IframePromoRouter.prototype.switchToLanding = function (clickType) {
        throw new Error('Method switchToLanding not supported');
    };
    IframePromoRouter.prototype.reload = function () {
        throw new Error('Method switchToLanding not supported');
    };
    IframePromoRouter.prototype.switchByComeback = function () {
        var matches = window.location.pathname.match(/^\/(iframe|track)\//);
        window.location.href = '/' + matches[1] + '/switch' + (window.location.search ? window.location.search + '&' : '?') + 'clickType=comeback';
    };
    IframePromoRouter.preLandingPattern = /^\/(iframe|track)\/pln\//;
    IframePromoRouter.landingPattern = /^\/(iframe|track)\/ln\//;
    return IframePromoRouter;
}(AbstractPromoRouter));
var AjaxPromoRouter = /** @class */ (function (_super) {
    __extends(AjaxPromoRouter, _super);
    function AjaxPromoRouter(data) {
        var _this = _super.call(this) || this;
        _this._thrown = false;
        _this._promoType = data['promoType'];
        _this._queryString = data['queryString'];
        _this._domainWithProtocol = data['domainWithProtocol'];
        return _this;
    }
    Object.defineProperty(AjaxPromoRouter.prototype, "promoType", {
        get: function () {
            var result;
            if (this.__promoType) {
                result = this.__promoType;
            }
            else {
                result = this.promoTypeWhitePage;
                if (!this._thrown) {
                    this._thrown = true;
                    setTimeout(function () {
                        throw new Error('Can\'t determine promo type');
                    }, 100);
                }
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AjaxPromoRouter.prototype, "_promoType", {
        set: function (value) {
            this.__promoType = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AjaxPromoRouter.prototype, "queryString", {
        get: function () {
            return this._queryString || '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AjaxPromoRouter.prototype, "domainWithProtocol", {
        get: function () {
            return this._domainWithProtocol;
        },
        enumerable: true,
        configurable: true
    });
    AjaxPromoRouter.prototype.switchToLanding = function (clickType) {
        if (this.promoType != this._promoTypeLanding) {
            this.resetLandingHash();
            this._promoType = this._promoTypeLanding;
            this.reload(clickType);
        }
    };
    AjaxPromoRouter.prototype.makeExternalRedirect = function (url) {
        this._promoType = this._promoTypePreLanding;
        this.replaceStateInHistory(this.promoType, document.title);
        window.location.href = url;
    };
    AjaxPromoRouter.prototype.reload = function (clickType) {
        if (clickType === void 0) { clickType = null; }
        if (this.promoType == this._promoTypePreLanding) {
            window['ajaxPromoIntegration'].p(this._domainWithProtocol);
        }
        else if (this.promoType == this._promoTypeLanding) {
            var queryString = this.queryString + (clickType ? '&clickType=' + clickType : '');
            window['ajaxPromoIntegration'].l(this._domainWithProtocol, queryString);
        }
        else {
            throw new Error('Unknown promo type');
        }
    };
    return AjaxPromoRouter;
}(AbstractPromoRouter));
var promoRouter;
if (IframePromoRouter.preLandingPattern.test(window.location.pathname) || IframePromoRouter.landingPattern.test(window.location.pathname)) {
    promoRouter = new IframePromoRouter();
}
else if (window['ajaxPromoRouterData']) {
    promoRouter = new AjaxPromoRouter(window['ajaxPromoRouterData']);
}
else {
    promoRouter = new SingleUrlPromoRouter();
}
promoRouter.init();
var DateParser = /** @class */ (function () {
    function DateParser() {
        this._weekDays = {
            'sun': 0,
            'mon': 1,
            'tue': 2,
            'wed': 3,
            'thu': 4,
            'fri': 5,
            'sat': 6
        };
        this._timeUnits = {
            'yea': 'FullYear',
            'mon': 'Month',
            'day': 'Date',
            'hou': 'Hours',
            'min': 'Minutes',
            'sec': 'Seconds'
        };
        this._weekDaysPattern = 'sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
            '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?';
        this._timesPattern = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
            '|' + this._weekDaysPattern + ')';
        this._plusMinusPattern = '(([+-]\\s?)?\\d+)\\s?' + this._timesPattern;
        this._plusMinusRegExp = new RegExp(this._plusMinusPattern);
        this._plusMinusGlobalRegExp = new RegExp(this._plusMinusPattern, 'g');
        this._plusMinusFullRegExp = new RegExp('(' + this._plusMinusPattern + '\\s?)+');
        this._lastNextRegExp = new RegExp('^(last|next)\\s(' + this._weekDaysPattern + ')$');
    }
    DateParser.prototype.parse = function (dateInputFormat, date) {
        if (date === void 0) { date = null; }
        if (date) {
            date = new Date(date.getTime()); // clone data
        }
        else {
            date = new Date();
        }
        dateInputFormat = this.removeUnnecessarySpaces(dateInputFormat);
        var matches;
        if (dateInputFormat) {
            if (dateInputFormat == 'now') {
                // nothing
            }
            else if (dateInputFormat == 'yesterday') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() - 1);
            }
            else if (dateInputFormat == 'today') {
                date.setHours(0, 0, 0, 0);
            }
            else if (dateInputFormat == 'tomorrow') {
                date.setHours(0, 0, 0, 0);
                date.setDate(date.getDate() + 1);
            }
            else if (this._plusMinusFullRegExp.test(dateInputFormat)) {
                matches = dateInputFormat.match(this._plusMinusGlobalRegExp);
                for (var i in matches) {
                    var matches2 = void 0, timeValue = void 0;
                    if ((matches2 = matches[i].match(this._plusMinusRegExp)) == null || isNaN(timeValue = parseInt(matches2[1].replace(/([+-])\s/, '$1'), 10))) {
                        throw new Error("Unknown error while parsing date input format \"" + dateInputFormat + "\"");
                    }
                    this.processPlusMinus(date, timeValue, matches2[3]);
                }
            }
            else if (matches = dateInputFormat.match(this._lastNextRegExp)) {
                this.processLastNext(date, matches[1], matches[2]);
            }
            else {
                throw new Error("Date input format \"" + dateInputFormat + "\" is invalid");
            }
        }
        return date;
    };
    DateParser.prototype.removeUnnecessarySpaces = function (text) {
        return (text || "").replace(/^\s+|\s+$/g, '')
            .replace(/\s{2,}/g, ' ')
            .replace(/[\t\r\n]/g, '')
            .toLowerCase();
    };
    DateParser.prototype.processPlusMinus = function (date, timeValue, timeUnit) {
        var shortTimeUnit = timeUnit.substring(0, 3);
        if (this._timeUnits[shortTimeUnit] && !/^mon(day|\.)?$/.test(timeUnit)) {
            date['set' + this._timeUnits[shortTimeUnit]](date['get' + this._timeUnits[shortTimeUnit]]() + timeValue);
        }
        else if (shortTimeUnit === 'wee') { // week
            date.setDate(date.getDate() + timeValue * 7);
        }
        else {
            throw new Error("Error while processing plus/minus expression");
        }
    };
    DateParser.prototype.processLastNext = function (date, type, timeUnit) {
        var shortTimeUnit = timeUnit.substring(0, 3);
        if (this._weekDays[shortTimeUnit] != undefined) {
            var diff = this._weekDays[shortTimeUnit] - date.getDay();
            if (diff === 0) {
                diff = 7 * (type === 'last' ? -1 : 1);
            }
            else if (diff > 0 && type === 'last') {
                diff -= 7;
            }
            else if (diff < 0 && type === 'next') {
                diff += 7;
            }
            date.setDate(date.getDate() + diff);
        }
        else {
            throw new Error("Error while processing last/next expression");
        }
    };
    return DateParser;
}());
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
var CookieConsent = /** @class */ (function () {
    function CookieConsent() {
        this._language = LanguageHelper.detect();
    }
    CookieConsent.prototype.init = function () {
        var isWhitePage = promoRouter.promoType == promoRouter.promoTypeWhitePage && !/^promo-sandbox\./.test(location.hostname);
        if ((isWhitePage || /(\?|&)cookieinfo=[^&]+/i.test(promoRouter.queryString)) && !localStorage.cookieConsentClosed) {
            this.appendPlate();
        }
        if (isWhitePage) {
            this.addPolicyBottomLink();
        }
    };
    CookieConsent.prototype.appendPlate = function () {
        var container = document.createElement('div');
        container.setAttribute('style', 'position: fixed; bottom: 0; left: 0; right: 0; min-height: 20px; z-index: 2147483647; background: black; color: white; line-height: 20px; padding: 8px 18px; font-family: verdana, arial, sans-serif; font-size: 14px; text-align: left; cursor: pointer');
        container.setAttribute('onclick', 'CookieConsent.onClick(this, arguments[0])');
        container.innerHTML =
            "<div style='float: right; display: block; padding: 5px 20px; margin-left: 5px; color: black; background: white; text-align: center'>" + CookieConsent.messages.closeButton[this._language] + "</div>\n            <div style='padding: 5px 0'>" + CookieConsent.messages.plate[this._language] + "</div>";
        document.body.appendChild(container);
    };
    CookieConsent.onClick = function (container, event) {
        if (!event || (event.target instanceof HTMLAnchorElement) == false) {
            localStorage.cookieConsentClosed = 1;
            container.parentNode.removeChild(container);
        }
    };
    CookieConsent.prototype.addPolicyBottomLink = function () {
        var container = document.createElement('div');
        container.setAttribute('style', 'margin-top: 5px; text-align: center');
        var link = document.createElement('a');
        link.setAttribute('href', '/wp-includes/policy/' + this._language + '.htm');
        link.setAttribute('target', '_blank');
        link.setAttribute('style', 'text-decoration: underline; color: black; text-shadow: 0 0 2px white');
        link.text = CookieConsent.messages.policyBottomLink[this._language];
        container.appendChild(link);
        document.body.appendChild(container);
    };
    CookieConsent.messages = {
        closeButton: {
            en: 'Close',
            ru: 'Закрыть',
        },
        plate: {
            en: 'Our services use «cookies» and other similar technologies, such as pixels or local storage, to customize advertising and analyze site traffic. By clicking «Close» you are agreeing to our privacy policy. <a href="/wp-includes/policy/en.htm" target="_blank" style="text-decoration: underline; color: white; padding: 5px; margin: 0 -5px">More info</a>.',
            ru: 'Мы используем файлы «cookies» и другие подобные технологии, такие как пиксели или локальное хранилище, для индивидуальной настройки рекламы и анализа трафика сайта. Нажимая «Закрыть», Вы соглашаетесь c нашими условиями. <a href="/wp-includes/policy/ru.htm" target="_blank" style="text-decoration: underline; color: white; padding: 5px; margin: 0 -5px">Подробнее</a>.',
        },
        policyBottomLink: {
            en: 'Privacy Policy',
            ru: 'Политика конфиденциальности',
        }
    };
    return CookieConsent;
}());
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
var OrderForm = /** @class */ (function () {
    function OrderForm() {
        this._formAction = (promoRouter.domainWithProtocol || '') + '/successful';
        this._queryParams = this.parseQueryString(promoRouter.queryString || '');
        var pixel;
        if (promoRouter.promoType == promoRouter.promoTypeWhitePage && !this._queryParams['p'] && (pixel = this.parsePixelFromCookies())) {
            this._queryParams['p'] = pixel;
        }
    }
    OrderForm.prototype.parseQueryString = function (queryString) {
        var result = {};
        if (queryString.length > 0 && queryString.charAt(0) == '?') {
            queryString = queryString.substring(1);
        }
        var paramPattern = /([^&=]+)=?([^&]*)/g;
        var decode = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        };
        var match;
        while (match = paramPattern.exec(queryString)) {
            result[decode(match[1])] = decode(match[2]);
        }
        return result;
    };
    OrderForm.prototype.parsePixelFromCookies = function () {
        var result = null;
        var match;
        if (match = document.cookie.match(/(^|\s)p=(\d+)(;|$)/)) {
            result = match[2];
        }
        return result;
    };
    OrderForm.prototype.init = function () {
        var forms = document.getElementsByTagName('form');
        for (var i = 0; i < forms.length; ++i) {
            var form = forms[i];
            if (!form.getAttribute('data-upgraded')) {
                if (!form.elements['name'] || (!form.elements['phone'] && !form.elements['phoneNumber'])) {
                    this.reportAnUnknownForm(form);
                }
                else {
                    this.upgradeForm(form);
                }
                form.setAttribute('data-upgraded', '1');
            }
        }
    };
    OrderForm.prototype.listenMessages = function () {
        var _this = this;
        window.addEventListener('message', function (e) {
            if (e.data == 'hideSuccessful') {
                _this.hideSuccessful();
            }
        });
    };
    OrderForm.prototype.reportAnUnknownForm = function (form) {
        console.error('Unknown form:');
        console.error(form);
    };
    OrderForm.prototype.upgradeForm = function (form) {
        var _this = this;
        form.setAttribute('method', 'post');
        form.setAttribute('action', this._formAction);
        this.upgradeInput(form.elements['name']);
        this.upgradeInput(form.elements['phone'] || form.elements['phoneNumber'], 'tel');
        form.onsubmit = function () { return _this.onSubmit(form); };
        var queryParamKeys = Object.keys(this._queryParams).reverse();
        for (var keyOfKey in queryParamKeys) {
            var name_1 = queryParamKeys[keyOfKey];
            var value = this._queryParams[name_1];
            if (value) {
                this.addHiddenInput(form, name_1, value);
            }
        }
        var oldInputsContainer = form.getElementsByClassName('old-inputs-container')[0];
        if (oldInputsContainer) {
            this.prependChild(form, oldInputsContainer);
        }
    };
    OrderForm.prototype.upgradeInput = function (input, inputType) {
        if (inputType === void 0) { inputType = 'text'; }
        input.required = true;
        input.type = inputType;
        input.maxLength = 127;
        input.setAttribute('onchange', 'OrderForm.inputValueChanged(this)');
    };
    OrderForm.inputValueChanged = function (input) {
        input.value = input.value.trim();
    };
    OrderForm.prototype.onSubmit = function (form) {
        var _this = this;
        var name = form.elements['name'];
        var phone = form.elements['phone'] || form.elements['phoneNumber'];
        if (!phone.value) {
            this.requireValue(phone);
            return false;
        }
        else if (!name.value) {
            this.requireValue(name);
            return false;
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', this._formAction + '/default/ajax', true);
        xhr.onload = function () { return _this.onLoad(xhr); };
        xhr.onerror = function () { return _this.onError(); };
        xhr.send(new FormData(form));
        return false;
    };
    OrderForm.prototype.onLoad = function (xhr) {
        try {
            var data = JSON.parse(xhr.responseText);
            if (!data.isSuccess) {
                return this.onError();
            }
            this.blurAll();
            if (data.pixels) {
                for (var i in data.pixels) {
                    this.showPixel(data.pixels[i]);
                }
            }
            this.showSuccessful(data.url);
        }
        catch (e) {
            this.onError();
        }
    };
    OrderForm.prototype.blurAll = function () {
        try {
            if (document.activeElement instanceof HTMLInputElement) {
                var tmp = document.createElement('input');
                document.activeElement.parentNode.insertBefore(tmp, document.activeElement);
                tmp.focus();
                tmp.parentNode.removeChild(tmp);
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    OrderForm.prototype.showPixel = function (pixel) {
        var jsToEval = this.generatePixelJsCode(pixel);
        if (frameMode.openInFrame()) {
            frameMode.postMessage(jsToEval);
        }
        else {
            var script = document.createElement('script');
            script.innerHTML = jsToEval;
            document.body.append(script);
        }
    };
    OrderForm.prototype.generatePixelJsCode = function (pixel) {
        pixel += ''; // to make string
        var result;
        var matches = pixel.match(/^(AW-\d+)\/[\w\-]+$/);
        if (matches) {
            result =
                "var script = document.createElement('script');\n                script.src = 'https://www.googletagmanager.com/gtag/js?id=" + matches[1] + "';\n                script.async = true;\n                document.body.append(script);\n\n                window.dataLayer = window.dataLayer || [];\n                function gtag(){dataLayer.push(arguments);}\n                gtag('js', new Date());\n                gtag('config', '" + matches[1] + "');\n                gtag('event', 'conversion', {\n                    'send_to': '" + pixel + "',\n                    'transaction_id': ''\n                });";
        }
        else if (/^\w{20}$/.test(pixel)) {
            result =
                "(function() {\n                    var ta = document.createElement('script');\n                    ta.type = 'text/javascript';\n                    ta.async = true;\n                    ta.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=" + pixel + "';\n                    var s = document.getElementsByTagName('script')[0];\n                    s.parentNode.insertBefore(ta, s);\n                })();";
        }
        else {
            result =
                "!function(f,b,e,v,n,t,s)\n                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?\n                n.callMethod.apply(n,arguments):n.queue.push(arguments)};\n                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';\n                n.queue=[];t=b.createElement(e);t.async=!0;\n                t.src=v;s=b.getElementsByTagName(e)[0];\n                s.parentNode.insertBefore(t,s)}(window, document,'script',\n                'https://connect.facebook.net/en_US/fbevents.js');\n                fbq('init', '" + pixel + "');\n                fbq('track', 'Lead');";
        }
        return result;
    };
    OrderForm.prototype.showSuccessful = function (url) {
        var frame = document.createElement('iframe');
        frame.id = 'successfulFrame';
        frame.src = url;
        frame.setAttribute('style', "position: fixed;\n            border: none;\n            top: 0;\n            right: 0;\n            bottom: 0;\n            left: 0;\n            width: 100%;\n            height: 100%;\n            z-index: 9999999;\n            background: white;");
        OrderForm._originalHtmlStyle = document.documentElement.getAttribute('style') || '';
        OrderForm._originalBodyStyle = document.body.getAttribute('style') || '';
        var htmlStyles = "transform: none;\n            perspective: none;\n            filter: none;\n            will-change: none;";
        document.documentElement.setAttribute('style', htmlStyles);
        document.body.setAttribute('style', 'margin: 0; padding: 0; overflow: hidden; ' + htmlStyles);
        document.body.appendChild(frame);
    };
    OrderForm.prototype.hideSuccessful = function () {
        var frame = document.getElementById('successfulFrame');
        frame.parentElement.removeChild(frame);
        document.documentElement.setAttribute('style', OrderForm._originalHtmlStyle);
        document.body.setAttribute('style', OrderForm._originalBodyStyle);
    };
    OrderForm.prototype.onError = function () {
        console.error('Error while requiring successful page');
        alert('Error while requiring successful page');
    };
    OrderForm.prototype.requireValue = function (input) {
        input.style.WebkitAppearance = 'none';
        input.style.WebkitBoxShadow = input.style.MozBoxShadow = input.style.boxShadow = '0 0 2px 2px red';
        setTimeout(function () {
            input.style.WebkitAppearance = null;
            input.style.WebkitBoxShadow = input.style.MozBoxShadow = input.style.boxShadow = null;
        }, 500);
        input.focus();
    };
    OrderForm.prototype.addHiddenInput = function (form, name, value) {
        var input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        this.prependChild(form, input);
    };
    OrderForm.prototype.prependChild = function (parent, child) {
        if (parent.childNodes.length == 0) {
            parent.appendChild(child);
        }
        else {
            parent.insertBefore(child, parent.childNodes[0]);
        }
    };
    return OrderForm;
}());
