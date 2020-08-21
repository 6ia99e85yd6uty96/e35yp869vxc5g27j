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
