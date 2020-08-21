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
