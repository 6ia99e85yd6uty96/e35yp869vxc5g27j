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
}