(() => {
    "use strict";

    class PageNavigator {
        /**
         * PageNavigator Constructor.
         * @param {Function} pageLoadCallback
         * @param {Object} scope
         * @param {String} uriPrepend
         * @param {String} pagesExtension
         */
        constructor(pageLoadCallback, scope, uriPrepend = `Pages/`, pagesExtension = `.html`) {
            this.pageLoadCallback = pageLoadCallback;
            this.scope = scope;
            this.uriPrepend = uriPrepend;
            this.pagesExtension = pagesExtension;
        }
        /**
         * A method that can be called to route to the
         * specified format.
         * @param {String} route
         */
        go(route) {
            if(route[0] === '/') {
                route = route.substr(1);
            }
            let routeDetails = route.split('/'), routeDetailsLength = routeDetails.length;
            if(routeDetails[routeDetailsLength - 1] === '') {
                routeDetails = routeDetails.pop();
            }
            PageNavigator.setRoute(route);
            switch (routeDetailsLength) {
                case 1:
                    // Case when a root route is declared.
                    this.handleRootRoute(`${this.uriPrepend}${routeDetails[0]}${this.pagesExtension}`);
                    break;
                case 2:
                    // Case when a class' method is to be called.
                    this.handleClassMethod(routeDetails[0], routeDetails[1]);
                    break;
                case 3:
                    // When a constructor is to be called
                    // prior to calling a method from a class.
                    // Other than that, pretty much the same as case(2).
                    this.handleClassInitMethod(routeDetails[0], routeDetails[1], routeDetails[2]);
                    break;
            }

            window.dispatchEvent(window.pageLoadEvent);
        }

        handleClassInitMethod(className, methodName, constructorArgs) {
          let cClass = new window.navigatorClasses[className](this.pageLoadCallback, this.scope, constructorArgs);
          cClass[methodName]();
        }

        /**
         * Set the hash route of the page.
         * @param {String} route
         */
        static setRoute(route) {
            window.location.hash = `#route=${route}`;
        }

        /**
         * Handles the case when [data-internal-route] locates
         * to a simple HTML page.
         * @param {String} pageUri The uri of the page to load.
         */
        handleRootRoute(pageUri) {
            fetch(pageUri)
                .then((response) => {
                    return response.text();
                })
                .then((page) => {
                    this.pageLoadCallback.bind(this.scope)(page);
                });
        }

        handleClassMethod(className, staticMethodName) {
          window.navigatorClasses[className][staticMethodName](this.pageLoadCallback.bind(this.scope));
        }
    }

    window.PageNavigator = PageNavigator;
})();
