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
