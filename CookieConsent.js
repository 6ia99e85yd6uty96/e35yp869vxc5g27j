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
