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
