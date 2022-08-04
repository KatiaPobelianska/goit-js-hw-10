export default function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1/';

  return fetch(
    `${BASE_URL}name/${name}?fields=name,capital,population,flags,languages`
  ).then(responce => {
    if (!responce.ok) {
      throw new Error(responce.status);
    }
    return responce.json();
  });
}
