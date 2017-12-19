let pageHandler = new PageHandler(document.querySelector('main[data-content-holder]'));
let pageNavigator = new PageNavigator(pageHandler.getNavigatorCallback(), pageHandler);
let buttonHandler = new ButtonHandlers(
    document.querySelector('[data-drop-down]'),
    document.querySelector('[data-drop-down="content"]')
);
let searchHandler = new SearchHandler(document.querySelector('[data-search]'));

searchHandler.attachEvents();

buttonHandler.attachToDropDownButton();

Array.from(document.querySelectorAll('[data-internal-route]')).forEach(attachPageNavigation);

window.onload = () => {
  if(window.location.hash.length !== 0) {
    let hash = window.location.hash.substr(1);
    hash = hash.split('=');
    if(hash[0] === 'route') {
      pageNavigator.go(hash[1]);
    }
  } else {
    pageNavigator.go('/home');
  }
};
