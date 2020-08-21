class FrameMode {
    public openInFrame() {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    }

    public postMessage(jsToEval) {
        window.parent.postMessage({jsToEval: jsToEval}, '*');
    }
}
let frameMode = new FrameMode();