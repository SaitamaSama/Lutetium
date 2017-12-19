;(() => {
  "use strict";

  window.navigatorClasses = {};

  /**  @param {HTMLElement} handle*/
  const attachPageNavigation = (handle) => {
      /** @param {MouseEvent} ev */
      handle.addEventListener('click', (ev) => {
          ev.preventDefault();

          pageNavigator.go(handle.getAttribute('data-internal-route'));
          return true;
      });
  };

  window.attachPageNavigation = attachPageNavigation;

  let pageLoadEvent = new Event("page-load");
  window.pageLoadEvent = pageLoadEvent;
})();
