var jsdom = require('jsdom');

var exports = null;
if (jsdom) {
    exports = jsdom.jsdom('<html><body><div id="test"></div></body></html>').parentWindow;
} else {
    exports = window;
}

module.exports = exports;
