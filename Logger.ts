class Logger {
    private readonly _relativeUrl = "/successful/default/log";

    public init() {
        //window.onerror = (message: string, url: string, lineNumber: number, columnNumber: number, errorObj: Error) => this.onError(message, url, lineNumber, columnNumber, errorObj);
    }

    private onError(message: string, url: string, lineNumber: number, columnNumber: number, errorObj: Error) {
        if (!url || url.indexOf('bundle.js') == -1) {
            return;
        }
        let source = this.concatSource(url, lineNumber, columnNumber);
        let dataObject = this.createDataObject(source, message, errorObj);
        dataObject['v'] = 7;
        this.send(dataObject);
        return false;
    }

    private concatSource(url: string, lineNumber: number, columnNumber: number) {
        url = url || "unknown";
        lineNumber = lineNumber || 0;
        columnNumber = columnNumber || 0;
        try {
            return url + ":" + lineNumber + ":" + columnNumber;
        } catch (e) {
            return "invalid source";
        }
    }

    private createDataObject(source: string, message: string, errorObj: any) {
        try {
            if (errorObj) {
                errorObj = {
                    fileName: errorObj.fileName || null,
                    lineNumber: errorObj.lineNumber || null,
                    columnNumber: errorObj.columnNumber || null,
                    message: errorObj.message || null,
                    stack: errorObj.stack || null
                };
            } else {
                errorObj = null
            }
            return {
                message: message,
                source: source,
                errorObj: errorObj,
                locationHref: window.location.href,
                navigator: this.cloneObject(window.navigator),
            };
        } catch (e) {
            return {
                message: "Unknown error while creating data object",
                source: "Logger.createDataObject",
            };
        }
    }

    private cloneObject(obj: any): any {
        let result = {};
        try {
            for (let key in navigator) {
                try {
                    result[key] = obj[key];
                } catch (e) {}
            }
        } catch (e) {}
        return result;
    }

    private send(dataObject: any) {
        try {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', this._relativeUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(dataObject));
        } catch (e) {}
    }
}
(new Logger()).init();