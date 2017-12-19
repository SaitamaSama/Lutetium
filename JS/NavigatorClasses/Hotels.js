;(() => {
  "use strict";

  const HOTEL_LIST_URI = 'Data/HotelList.json';
  const HOTEL_LIST_PAGE_URI = 'Pages/HotelList.html';
  const HOTEL_PAGE_URI = 'Pages/Hotel.html';

  class Hotels {
    static all(callback) {
      Hotels._getListHTMLPage((pageHTML) => {
        callback(pageHTML);
        Hotels._getList((list) => {
          list.forEach((entry, id) => {
            let entryRow = document.createElement('tr'),
              entry_name = document.createElement('td'),
              entry_location = document.createElement('td'),
              entry_facilities = document.createElement('td'),
              entry_cost = document.createElement('td'),
              entry_book = document.createElement('td');

            let facilityHTML = '';

            entry['facilities'].forEach((facility) => {
              facilityHTML += `<span class="facility">${facility}</span>`;
            });

            entry_name.textContent = entry['name'];
            entry_location.textContent = entry['location'],
            entry_cost.textContent = `\$${entry['cost']}`;
            entry_book.innerHTML = `<button class="btn text-light" data-internal-route="/Hotels/view/${id}">Book Now!</button>`;
            entry_facilities.innerHTML = facilityHTML;

            entryRow.appendChild(entry_name);
            entryRow.appendChild(entry_location);
            entryRow.appendChild(entry_facilities);
            entryRow.appendChild(entry_cost);
            entryRow.appendChild(entry_book);

            document.querySelector('#list-body').appendChild(entryRow);

            Array.from(document.querySelectorAll('[data-internal-route]')).forEach(attachPageNavigation);
          });
        });
      });
    }

    static _getList(cb) {
      fetch(HOTEL_LIST_URI)
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          cb(responseJson);
        });
    }

    static _getListHTMLPage(cb) {
      fetch(HOTEL_LIST_PAGE_URI)
        .then((response) => {
          return response.text();
        })
        .then((responseHTML) => {
          cb(responseHTML);
        });
    }

    static _getHotelHTMLPage(cb) {
      fetch(HOTEL_PAGE_URI)
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
      Hotels._getList((data) => {
        let hotel = data[this.id];
        Hotels._getHotelHTMLPage((page) => {
          this.pageLoadCallback.bind(this.callbackScope)(page);

          let nameE = document.createElement('section'),
            locationE = document.createElement('time'),
            costE = document.createElement('section'),
            facilitiesE = document.createElement('section');

          nameE.classList.add('destination');
          locationE.classList.add('duration');
          costE.classList.add('cost');
          facilitiesE.classList.add('class');

          nameE.textContent = `Stay at: ${hotel['name']}`;
          locationE.textContent = `${hotel['location']}`;
          costE.textContent = `${hotel['cost']}`;
          facilitiesE.textContent = `Facilities: ${hotel['facilities'].join(', ').replace(/,+$/,'')}`;

          nameE.innerHTML = `<div class="material-icons fl-icon">hotel</div>` + nameE.innerHTML;
          costE.innerHTML = `<span class="dolla">$</span>` + costE.innerHTML;

          let formHtml = `
          <h1 class="big-title">Confirm Booking</h1>
          <form class="book-form">
            <input class="text" type="text" placeholder="Your Name">
            <input class="text" type="number" placeholder="Your Age">
            <button class="btn">Submit</button>
          </form>`;

          document.querySelector('[data-details]').appendChild(nameE);
          document.querySelector('[data-details]').appendChild(document.createElement('br'));
          nameE.appendChild(locationE);
          document.querySelector('[data-details]').appendChild(costE);
          document.querySelector('[data-details]').appendChild(facilitiesE);
          document.querySelector('[data-details]').innerHTML += formHtml;
        });
      });
    }
  }

  window.navigatorClasses.Hotels = Hotels;
})();
