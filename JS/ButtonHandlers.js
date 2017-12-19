;(() => {
    "use strict";

    class ButtonHandlers {
        constructor(dropDownButton = null, dropDownContent = null) {
            this.dropDownButton = dropDownButton;
            this.dropDownContent = dropDownContent;
        }

        attachToDropDownButton() {
            this.dropDownContent.addEventListener('click', (ev) => {
                ev.preventDefault();
                ev.stopPropagation();
            });
            this.dropDownButton.addEventListener('click', (ev) => {
                if(!this.dropDownButton.classList.contains('active')) {
                    this.dropDownButton.classList.add('active');
                } else {
                    this.dropDownButton.classList.remove('active');
                }
            });
            window.addEventListener('page-load', () => {
              this.dropDownButton.classList.remove('active');
            });
        }
    }

    window.ButtonHandlers = ButtonHandlers;
})();
