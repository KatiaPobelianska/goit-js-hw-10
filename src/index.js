import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries.js';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const { searchInput, countryList, countryInfo } = refs;

searchInput.addEventListener('input', debounce(handleSearch, DEBOUNCE_DELAY));

function handleSearch(ev) {
  const searchKey = ev.target.value.trim();

  if (searchKey === '') {
    clearCountryList();
    clearCountryInfo();
  } else {
    fetchCountries(searchKey)
      .then(data => {
        if (data.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name'
          );
          clearCountryList();
          clearCountryInfo();
        } else if (data.length >= 2 && data.length <= 10) {
          clearCountryInfo();
          countryList.innerHTML = countryListMarkup(data);
        } else {
          clearCountryList();
          countryInfo.innerHTML = countryInfoMarkup(data);
        }
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oops, there is no country with that name');
      });
  }
}

function countryListMarkup(countryArray) {
  return countryArray
    .map(({ name, flags }) => {
      return `<li class="country-list__item"><img src="${flags.svg}" alt="${name.common}" class="country-list_img"><span class="country-list__name">${name.common}</span></li>`;
    })
    .join('');
}

function countryInfoMarkup(countryArray) {
  return countryArray
    .map(({ name, flags, capital, population, languages }) => {
      return `<div class="country-info__name"><img src="${flags.svg}" alt="${
        name.common
      }" class="country-info__img" />${name.official}</div>
        <p><span class="country-info__bold">Capital: </span>${capital}</p>
        <p><span class="country-info__bold">Population: </span>${population}</p>
        <p><span class="country-info__bold">Languages: </span>${Object.values(
          languages
        ).join(', ')}</p>`;
    })
    .join('');
}

function clearCountryList() {
  countryList.innerHTML = '';
}

function clearCountryInfo() {
  countryInfo.innerHTML = '';
}
