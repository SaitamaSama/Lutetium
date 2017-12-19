;(() => {
  "use strict"
  const FLIGHT_LIST_URI = 'Data/FlightList.json';
  const FLIGHT_LIST_PAGE_URI = 'Pages/FlightList.html';
  const FLIGHT_PAGE_URI = 'Pages/Flight.html';

  class Flights {
    static all(callback) {
      Flights._getListHTMLPage((pageHTML) => {
        callback(pageHTML);
        Flights._getList((list) => {
          list.forEach((entry, id) => {
            let entryRow = document.createElement('tr'),
              entry_class = document.createElement('td'),
              entry_destination = document.createElement('td'),
              entry_duration = document.createElement('td'),
              entry_cost = document.createElement('td'),
              entry_book = document.createElement('td');

            entry_class.textContent = entry['class'];
            entry_destination.textContent = entry['destination'],
            entry_duration.textContent = entry['duration'],
            entry_cost.textContent = `\$${entry['cost']}`;
            entry_book.innerHTML = `<button class="btn text-light" data-internal-route="/Flights/view/${id}">Book Now!</button>`;

            entryRow.appendChild(entry_class);
            entryRow.appendChild(entry_destination);
            entryRow.appendChild(entry_duration);
            entryRow.appendChild(entry_cost);
            entryRow.appendChild(entry_book);

            document.querySelector('#list-body').appendChild(entryRow);
          });

          Array.from(document.querySelectorAll('[data-internal-route]')).forEach(attachPageNavigation);
        });
      });
    }

    static _getList(cb) {
      fetch(FLIGHT_LIST_URI)
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          cb(responseJson);
        });
    }

    static _getListHTMLPage(cb) {
      fetch(FLIGHT_LIST_PAGE_URI)
        .then((response) => {
          return response.text();
        })
        .then((responseHTML) => {
          cb(responseHTML);
        });
    }

    static _getFlightHTMLPage(cb) {
      fetch(FLIGHT_PAGE_URI)
        .then((response) => {
          return response.text();
        })
        .then((responseHTML) => {
          cb(responseHTML);
        });
    }

    constructor(pageLoadCallback, callbackScope, id) {
      this.id = id;
      this.pageLoadCallback = pageLoadCallback;
      this.callbackScope = callbackScope;
    }

    view() {
      Flights._getList((data) => {
        let flight = data[this.id];
        Flights._getFlightHTMLPage((page) => {
          this.pageLoadCallback.bind(this.callbackScope)(page);

          let destinationE = document.createElement('section'),
            durationE = document.createElement('time'),
            costE = document.createElement('section'),
            classE = document.createElement('section');

          destinationE.classList.add('destination');
          durationE.classList.add('duration');
          costE.classList.add('cost');
          classE.classList.add('class');

          destinationE.textContent = `Destination: ${flight['destination']}`;
          durationE.textContent = `${flight['duration']} hours to reach the destination`;
          costE.textContent = `${flight['cost']}`;
          classE.textContent = `Class: ${flight['class']}`;

          destinationE.innerHTML = `<div class="material-icons fl-icon">flight</div>` + destinationE.innerHTML;
          costE.innerHTML = `<span class="dolla">$</span>` + costE.innerHTML;

          let formHtml = `
          <h1 class="big-title">Confirm Booking</h1>
          <form class="book-form">
            <input class="text" type="text" placeholder="Your Name">
            <input class="text" type="number" placeholder="Your Age">
            <button class="btn">Submit</button>
          </form>`;

          document.querySelector('[data-details]').appendChild(destinationE);
          document.querySelector('[data-details]').appendChild(document.createElement('br'));
          destinationE.appendChild(durationE);
          document.querySelector('[data-details]').appendChild(costE);
          document.querySelector('[data-details]').appendChild(classE);
          document.querySelector('[data-details]').innerHTML += formHtml;
        });
      });
    }
  }

  window.navigatorClasses.Flights = Flights;
})();
