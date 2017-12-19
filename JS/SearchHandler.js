;((attachPageNavigation) => {
  "use strict";

  class SearchHandler {
    constructor(searchInputElement) {
      this.searchInputElement = searchInputElement;
    }

    attachEvents() {
      this.addToLocalStorage(() => this.searchInputElement.addEventListener('keypress', this.keyPressHandler.bind(this)));
      this.inputFocusCheckIntervalId = setInterval(() => {
        if(this.searchInputElement !== document.activeElement) {
          setTimeout(() => {
            this.removeSuggestionBox();
          }, 1000);
        }
      }, 100);
    }

    keyPressHandler(ev) {
      if(this.searchInputElement.value.trim().length === 0) {
        return;
      }
      if(ev.ctrlKey && ev.metaKey && ev.altKey && ev.which === 8) {
        return;
      }

      let term = this.searchInputElement.value.trim();
      // Change the value here... yky
      /*if(term.length < 1) {
        return;
      }*/

      let data = JSON.parse(window.localStorage.allData);

      this.createSuggestionBox();

      // Search for flights First
      this.searchForFlights(term, data).forEach((result) => {
        this.insertResult('flight', `To: ${result['destination']}`, `/Flights/view/${result["id"]}`);
      });

      // Then hotels
      this.searchForHotels(term, data).forEach((result) => {
        this.insertResult('hotel', `Stay at: ${result['name']}, ${result['location']}`, `/Hotels/view/${result["id"]}`);
      });

      this.attachInternalRouteHandlerRE();
    }

    addToLocalStorage(callback) {
      fetch('Data/all.json')
        .then((response) => {
          return response.text();
        })
        .then((data) => {
          window.localStorage.allData = data;
          callback();
        });
    }

    searchForFlights(term, data) {
      let results = [];
      data.flights.forEach((flight, id) => {
        let destination = flight['destination'];
        if(destination.toLowerCase().indexOf(term.toLowerCase()) !== -1) {
          flight.id = id;
          results.push(flight);
        }
      });
      return results;
    }

    searchForHotels(term, data) {
      let results = [];
      data.hotels.forEach((hotel, id) => {
        let location = hotel['location'];
        if(location.toLowerCase().indexOf(term) !== -1) {
          hotel.id = id;
          results.push(hotel);
        }
      });
      return results;
    }

    createSuggestionBox() {
      // Remove previous one, if present
      this.removeSuggestionBox();

      let boundingRect = this.searchInputElement.getBoundingClientRect();
      let suggestionBoxWidth = boundingRect.width,
        suggestionPositionLeft = boundingRect.left,
        suggestionPositionTop = boundingRect.top + boundingRect.height;

      let suggestionBox = document.createElement('section');
      suggestionBox.classList.add('suggestion-box');
      suggestionBox.style.width = suggestionBoxWidth + 'px';
      suggestionBox.style.left = suggestionPositionLeft + 'px';
      suggestionBox.style.top = suggestionPositionTop + 'px';
      document.body.appendChild(suggestionBox);

      this.suggestionBox = suggestionBox;
      return suggestionBox;
    }

    insertResult(type, text, link) {
      let icon = '';
      switch (type) {
        case "flight":
          icon = '<i class="material-icons" style="color: #9e2a2b;">flight</i>';
          break;
        case "hotel":
          icon = `<i class="material-icons" style="color: #0a8754;">hotel</i>`;
          break;
      }
      this.suggestionBox.innerHTML += `<section class="result" data-internal-route="${link}">
        <section class="icon">${icon}</section>
        <section class="text">${text}</section>
      </section>`;
    }

    removeSuggestionBox() {
      if(typeof this.suggestionBox !== "undefined") {
        this.suggestionBox.remove();
      }
    }

    attachInternalRouteHandlerRE() {
      Array.from(document.querySelectorAll('[data-internal-route]')).forEach(attachPageNavigation);
    }
  }

  window.SearchHandler = SearchHandler;
})(attachPageNavigation);
