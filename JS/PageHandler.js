(() => {
    "use strict";

    class PageHandler {
        /**
         * PageHandler constructor.
         * @param {HTMLElement} contentHolder
         * @param {boolean} changeTitle
         */
        constructor(contentHolder, changeTitle = false) {
            this.contentHolder = contentHolder;
            this.changeTitle = changeTitle;
        }

        /**
         * A public callback provider for the callback
         * required by {PageNavigator}.
         * @returns {Function}
         */
        getNavigatorCallback() {
            return this._handleIncomingPage;
        }

        /**
         * Handles the HTML text returned from
         * PageNavigator.
         * @param {String} pageHTML
         * @returns {boolean}
         * @private
         */
        _handleIncomingPage(pageHTML) {
            PageHandler._checkHTML(pageHTML);
            this.contentHolder.innerHTML = pageHTML;

            return true;
        }

        /**
         * Checks if the string provided is in compliance
         * to the format required by this application by parsing
         * it into a DOMParser.
         * @param {String} html
         * @returns {boolean}
         * @private
         */
        static _checkHTML(html) {
            let parser = new DOMParser();
            parser.parseFromString(html, 'text/html');

            console.log(parser);
        }
    }

    window.PageHandler = PageHandler;
})();
