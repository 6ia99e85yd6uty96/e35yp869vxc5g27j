declare var defaultForm: DefaultForm;

abstract class AbstractPromoRouter {
    public readonly promoTypeWhitePage = 'w';
    protected readonly _promoTypePreLanding = 'p';
    protected readonly _promoTypeLanding = 'l';

    protected _isLocked = false;
    protected _needToPushComebackHistory = false;
    protected _comebackAlertShown = false;
    protected _comebackTimer;

    private readonly _landingHash = '#switch';
    private readonly _landingHashRegExp = /^#(switch)(:(.+))?$/;

    public abstract get promoType(): string;
    protected set _promoType(value: string) {
        throw new Error('Method set _promoType not overridden');
    }

    public abstract get queryString(): string;

    public get domainWithProtocol(): string {
        return null;
    }

    public init() {
        if (this.promoType == this.promoTypeWhitePage) {
            return;
        }  else if (this.promoType == this._promoTypePreLanding && (window.history.state == null || !window.history.state.hasOwnProperty('promoType'))) {
            this._needToPushComebackHistory = true;
        } else if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && this.promoType == this._promoTypeLanding && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }
        defaultForm.resetHash = () => this.replaceStateInHistory(this.promoType, document.title, {}, true);
        window.addEventListener('popstate', event => this.popState(event.state));
        this.popState(null, true);
    }

    private popState(state, isInitialization: boolean = false) {
        this._isLocked = false;
        clearTimeout(this._comebackTimer);
        let matches;
        if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && (matches = window.location.hash.match(this._landingHashRegExp))) {
            this.switchToLanding(decodeURIComponent(matches[3] || ''));
        } else {
            let isBackForwardNavigation = true;
            if (state == null || !state.promoType) {
                state = this.setUpStateDataAgain();
                isBackForwardNavigation = false;
            }
            if (document.getElementById('successfulFrame') && isBackForwardNavigation) {
                window.postMessage('hideSuccessful', '*');
                window.history.go(1);
            } else if (state.comebackText) { // comeback
                this.alertComeback(state.comebackText);
                window.history.go(1);
            } else if ((this instanceof SingleUrlPromoRouter || this instanceof AjaxPromoRouter) && this.promoType != state.promoType) {
                this._promoType = state.promoType;
                this.reload();
            } else if (window.location.hash == DefaultForm.targetHash && !defaultForm.isShown()) {
                defaultForm.show(isInitialization);
            } else if (defaultForm.isShown() && isBackForwardNavigation) {
                defaultForm.hide();
            }
        }
    }

    protected abstract switchToLanding(clickType: string);

    protected resetLandingHash() {
        if (navigator.userAgent.match('CriOS')) { // Chrome on iOS
            this.replaceStateInHistory(this._promoTypeLanding, 'Loading...', {}, true);
        } else {
            this.replaceStateInHistory(this._promoTypeLanding, 'Loading...');
        }
    }

    protected abstract reload();

    private alertComeback(comebackText) {
        if (this._comebackAlertShown) {
            return;
        }
        this._comebackAlertShown = true;
        this.waitAndDo(() => {
            alert(comebackText);
            this._comebackAlertShown = false;
            this._comebackTimer = setTimeout(() => this.switchByComeback(), 100);
        });
    }

    private waitAndDo(resolve) {
        this._isLocked = true;
        let timer = setInterval(() => {
            if (!this._isLocked) {
                clearInterval(timer);
                resolve();
            }
        }, 25);
    }

    protected switchByComeback() {
        window.location.hash = this._landingHash + ':comeback';
    }

    protected replaceStateInHistory(promoType: string, title: string, data: any = {}, pushState: boolean = false, url = null) {
        data.promoType = promoType;
        if (!url) {
            url = window.location.pathname + window.location.search + (promoType == this._promoTypePreLanding ? '#' : '');
        }
        if (pushState) {
            window.history.pushState(data, title, url);
        } else {
            window.history.replaceState(data, title, url);
        }
    }

    private setUpStateDataAgain() { // Sometimes the Firefox loses state or navigation by hashes resets state
        this.replaceStateInHistory(this.promoType, document.title, {}, false, this.getLocationHref());
        return window.history.state;
    }

    public enableComeback(text: string) {
        if (this._needToPushComebackHistory) {
            let url = this.getLocationHref();
            this.replaceStateInHistory(this.promoType, document.title, {comebackText: text}, false, window.location.pathname + window.location.search + '#');
            this.replaceStateInHistory(this.promoType, document.title, {comebackText: text}, true, window.location.pathname + window.location.search);
            this.replaceStateInHistory(this.promoType, document.title, {}, true, url);
            this._needToPushComebackHistory = false;
        }
    }

    private getLocationHref()
    {
        let result = window.location.href;
        if (this.promoType == this._promoTypePreLanding && result.indexOf('#') == -1) {
            result += '#';
        }
        return result;
    }
}

class SingleUrlPromoRouter extends AbstractPromoRouter {
    private readonly _promoTypeCookieName = this._cookieNamePrefix + '_mrc'; // Magic Router Cookie
    private readonly _clickTypeCookieName = this._promoTypeCookieName + '_ct';

    private get _cookieNamePrefix(): number {
        if (this.__cookieNamePrefix === undefined) {
            let path = window.location.pathname;
            this.__cookieNamePrefix = 0;
            for (let i = 0; i < path.length; i++) {
                if (/^[\w-\/]$/i.test(path.charAt(i))) {
                    this.__cookieNamePrefix = (this.__cookieNamePrefix + path.charCodeAt(i)) % 10240;
                }
            }
        }
        return this.__cookieNamePrefix;
    }
    private __cookieNamePrefix: number;

    private _thrown = false;
    public get promoType(): string {
        let result = this.getCookie(this._promoTypeCookieName);
        if (!result) {
            result = this.promoTypeWhitePage;
            if (!this._thrown) {
                this._thrown = true;
                setTimeout(() => {
                    throw new Error('There is no magic router cookie');
                }, 100);
            }
        }
        return result;
    }
    protected set _promoType(value: string) {
        this.setCookie(this._promoTypeCookieName, value);
    }

    private get _promoUrl(): string {
        let result = null;
        if (this.promoType == this._promoTypePreLanding || this.promoType == this._promoTypeLanding) {
            result = this.getCookie(this._promoTypeCookieName + '_' + this.promoType);
        }
        return result;
    }

    public get queryString(): string {
        let result = null;
        let promoUrl = this._promoUrl;
        let questionMarkPos;
        if (promoUrl && (questionMarkPos = promoUrl.indexOf('?')) != -1) {
            result = promoUrl.substr(questionMarkPos + 1);
        }
        return result;
    }

    private getCookie(name: string): string {
        let result = null;
        let matches = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
        if (matches) {
            result = decodeURIComponent(matches[1]);
        }
        return result;
    }

    private setCookie(name: string, value: string) {
        document.cookie = name + '=' + encodeURIComponent(value) + '; path=/';
    }

    protected switchToLanding(clickType: string) {
        if (clickType) {
            this.setCookie(this._clickTypeCookieName, clickType);
        }
        if (this.promoType != this._promoTypeLanding) {
            this.resetLandingHash();
            try {
                window.stop();
            } catch (e) {}
            this._promoType = this._promoTypeLanding;
            this.reload();
        }
    }

    protected reload() {
        window.location.reload(true);
    }
}

class IframePromoRouter extends AbstractPromoRouter {
    public static readonly preLandingPattern = /^\/(iframe|track)\/pln\//;
    public static readonly landingPattern = /^\/(iframe|track)\/ln\//;

    private _thrown = false;
    public get promoType(): string {
        let result;
        if (IframePromoRouter.preLandingPattern.test(window.location.pathname)) {
            result = this._promoTypePreLanding;
        } else if (IframePromoRouter.landingPattern.test(window.location.pathname)) {
            result = this._promoTypeLanding;
        } else {
            result = this.promoTypeWhitePage;
            if (!this._thrown) {
                this._thrown = true;
                setTimeout(() => {
                    throw new Error('Can\'t determine promo type');
                }, 100);
            }
        }
        return result;
    }

    public get queryString(): string {
        return window.location.search.substr(1);
    }

    protected switchToLanding(clickType: string) {
        throw new Error('Method switchToLanding not supported');
    }

    protected reload() {
        throw new Error('Method switchToLanding not supported');
    }

    protected switchByComeback() {
        let matches = window.location.pathname.match(/^\/(iframe|track)\//);
        window.location.href = '/' + matches[1] + '/switch' + (window.location.search ? window.location.search + '&' : '?') + 'clickType=comeback';
    }
}

class AjaxPromoRouter extends AbstractPromoRouter {
    private _thrown = false;
    private __promoType;
    public get promoType(): string {
        let result;
        if (this.__promoType) {
            result = this.__promoType;
        } else {
            result = this.promoTypeWhitePage;
            if (!this._thrown) {
                this._thrown = true;
                setTimeout(() => {
                    throw new Error('Can\'t determine promo type');
                }, 100);
            }
        }
        return result;
    }
    protected set _promoType(value: string) {
        this.__promoType = value;
    }

    private readonly _queryString;
    public get queryString(): string {
        return this._queryString || '';
    }

    private readonly _domainWithProtocol;
    public get domainWithProtocol(): string {
        return this._domainWithProtocol;
    }

    public constructor(data) {
        super();
        this._promoType = data['promoType'];
        this._queryString = data['queryString'];
        this._domainWithProtocol = data['domainWithProtocol'];
    }

    protected switchToLanding(clickType: string) {
        if (this.promoType != this._promoTypeLanding) {
            this.resetLandingHash();
            this._promoType = this._promoTypeLanding;
            this.reload(clickType);
        }
    }

    public makeExternalRedirect(url) {
        this._promoType = this._promoTypePreLanding;
        this.replaceStateInHistory(this.promoType, document.title);
        window.location.href = url;
    }

    protected reload(clickType = null) {
        if (this.promoType == this._promoTypePreLanding) {
            window['ajaxPromoIntegration'].p(this._domainWithProtocol);
        } else if (this.promoType == this._promoTypeLanding) {
            let queryString = this.queryString + (clickType ? '&clickType=' + clickType : '');
            window['ajaxPromoIntegration'].l(this._domainWithProtocol, queryString);
        } else {
            throw new Error('Unknown promo type');
        }
    }
}

let promoRouter;
if (IframePromoRouter.preLandingPattern.test(window.location.pathname) || IframePromoRouter.landingPattern.test(window.location.pathname)) {
    promoRouter = new IframePromoRouter();
} else if (window['ajaxPromoRouterData']) {
    promoRouter = new AjaxPromoRouter(window['ajaxPromoRouterData']);
} else {
    promoRouter = new SingleUrlPromoRouter();
}
promoRouter.init();