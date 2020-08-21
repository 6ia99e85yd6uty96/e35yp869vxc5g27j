class OrderForm {
    private static _originalHtmlStyle;
    private static _originalBodyStyle;
    private readonly _formAction: string;
    private readonly _queryParams: { [name: string]: string };

    public constructor() {
        this._formAction = (promoRouter.domainWithProtocol || '') + '/successful';
        this._queryParams = this.parseQueryString(promoRouter.queryString || '');
        let pixel;
        if (promoRouter.promoType == promoRouter.promoTypeWhitePage && !this._queryParams['p'] && (pixel = this.parsePixelFromCookies())) {
            this._queryParams['p'] = pixel;
        }
    }

    private parseQueryString(queryString: string): { [name: string]: string } {
        let result = {};
        if (queryString.length > 0 && queryString.charAt(0) == '?') {
            queryString = queryString.substring(1);
        }
        let paramPattern = /([^&=]+)=?([^&]*)/g;
        let decode = function (s) {
            return decodeURIComponent(s.replace(/\+/g, ' '));
        };
        let match;
        while (match = paramPattern.exec(queryString)) {
            result[decode(match[1])] = decode(match[2]);
        }
        return result;
    }

    private parsePixelFromCookies() {
        let result = null;
        let match;
        if (match = document.cookie.match(/(^|\s)p=(\d+)(;|$)/)) {
            result = match[2];
        }
        return result;
    }

    public init() {
        let forms = document.getElementsByTagName('form');
        for (let i = 0; i < forms.length; ++i) {
            let form = forms[i];
            if (!form.getAttribute('data-upgraded')) {
                if (!form.elements['name'] || (!form.elements['phone'] && !form.elements['phoneNumber'])) {
                    this.reportAnUnknownForm(form)
                } else {
                    this.upgradeForm(form);
                }
                form.setAttribute('data-upgraded', '1');
            }
        }
    }

    public listenMessages() {
        window.addEventListener('message', (e) => {
            if (e.data == 'hideSuccessful') {
                this.hideSuccessful();
            }
        });
    }

    private reportAnUnknownForm(form) {
        console.error('Unknown form:');
        console.error(form);
    }

    private upgradeForm(form) {
        form.setAttribute('method', 'post');
        form.setAttribute('action', this._formAction);
        this.upgradeInput(form.elements['name']);
        this.upgradeInput(form.elements['phone'] || form.elements['phoneNumber'], 'tel');
        form.onsubmit = () => this.onSubmit(form);
        let queryParamKeys = Object.keys(this._queryParams).reverse();
        for (let keyOfKey in queryParamKeys) {
            let name = queryParamKeys[keyOfKey];
            let value = this._queryParams[name];
            if (value) {
                this.addHiddenInput(form, name, value);
            }
        }
        let oldInputsContainer = form.getElementsByClassName('old-inputs-container')[0];
        if (oldInputsContainer) {
            this.prependChild(form, oldInputsContainer);
        }
    }

    private upgradeInput(input: HTMLInputElement, inputType: string = 'text') {
        input.required = true;
        input.type = inputType;
        input.maxLength = 127;
        input.setAttribute('onchange', 'OrderForm.inputValueChanged(this)');
    }

    public static inputValueChanged(input: HTMLInputElement) {
        input.value = input.value.trim();
    }

    private onSubmit(form) {
        let name = form.elements['name'];
        let phone = form.elements['phone'] || form.elements['phoneNumber'];
        if (!phone.value) {
            this.requireValue(phone);
            return false;
        } else if (!name.value) {
            this.requireValue(name);
            return false;
        }
        let xhr = new XMLHttpRequest();
        xhr.open('POST', this._formAction + '/default/ajax', true);
        xhr.onload = () => this.onLoad(xhr);
        xhr.onerror = () => this.onError();
        xhr.send(new FormData(form));
        return false;
    }

    private onLoad(xhr) {
        try {
            let data = JSON.parse(xhr.responseText);
            if (!data.isSuccess) {
                return this.onError();
            }
            this.blurAll();
            if (data.pixels) {
                for (let i in data.pixels) {
                    this.showPixel(data.pixels[i]);
                }
            }
            this.showSuccessful(data.url);
        } catch (e) {
            this.onError();
        }
    }

    private blurAll() {
        try {
            if (document.activeElement instanceof HTMLInputElement) {
                let tmp = document.createElement('input');
                document.activeElement.parentNode.insertBefore(tmp, document.activeElement);
                tmp.focus();
                tmp.parentNode.removeChild(tmp);
            }
        } catch (e) {
            console.error(e);
        }
    }

    private showPixel(pixel) {
        let jsToEval = this.generatePixelJsCode(pixel);
        if (frameMode.openInFrame()) {
            frameMode.postMessage(jsToEval);
        } else {
            let script = document.createElement('script');
            script.innerHTML = jsToEval;
            document.body.append(script);
        }
    }

    private generatePixelJsCode(pixel) {
        pixel += ''; // to make string
        let result;
        let matches = pixel.match(/^(AW-\d+)\/[\w\-]+$/);
        if (matches) {
            result =
                `var script = document.createElement('script');
                script.src = 'https://www.googletagmanager.com/gtag/js?id=` + matches[1] + `';
                script.async = true;
                document.body.append(script);

                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '` + matches[1] + `');
                gtag('event', 'conversion', {
                    'send_to': '` + pixel + `',
                    'transaction_id': ''
                });`;
        } else if (/^\w{20}$/.test(pixel)) {
            result =
                `(function() {
                    var ta = document.createElement('script');
                    ta.type = 'text/javascript';
                    ta.async = true;
                    ta.src = 'https://analytics.tiktok.com/i18n/pixel/sdk.js?sdkid=` + pixel + `';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ta, s);
                })();`;
        } else {
            result =
                `!function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '` + pixel + `');
                fbq('track', 'Lead');`;
        }
        return result;
    }

    private showSuccessful(url) {
        let frame = document.createElement('iframe');
        frame.id = 'successfulFrame';
        frame.src = url;
        frame.setAttribute('style', `position: fixed;
            border: none;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999999;
            background: white;`);
        OrderForm._originalHtmlStyle = document.documentElement.getAttribute('style') || '';
        OrderForm._originalBodyStyle = document.body.getAttribute('style') || '';
        let htmlStyles = `transform: none;
            perspective: none;
            filter: none;
            will-change: none;`;
        document.documentElement.setAttribute('style', htmlStyles);
        document.body.setAttribute('style', 'margin: 0; padding: 0; overflow: hidden; ' + htmlStyles);
        document.body.appendChild(frame);
    }

    public hideSuccessful() {
        let frame = document.getElementById('successfulFrame');
        frame.parentElement.removeChild(frame);
        document.documentElement.setAttribute('style', OrderForm._originalHtmlStyle);
        document.body.setAttribute('style', OrderForm._originalBodyStyle);
    }

    private onError() {
        console.error('Error while requiring successful page');
        alert('Error while requiring successful page');
    }

    private requireValue(input) {
        input.style.WebkitAppearance = 'none';
        input.style.WebkitBoxShadow = input.style.MozBoxShadow = input.style.boxShadow = '0 0 2px 2px red';
        setTimeout(function() {
            input.style.WebkitAppearance = null;
            input.style.WebkitBoxShadow = input.style.MozBoxShadow = input.style.boxShadow = null;
        }, 500);
        input.focus();
    }

    private addHiddenInput(form, name, value) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', name);
        input.setAttribute('value', value);
        this.prependChild(form, input);
    }

    private prependChild(parent, child) {
        if (parent.childNodes.length == 0) {
            parent.appendChild(child);
        } else {
            parent.insertBefore(child, parent.childNodes[0]);
        }
    }
}