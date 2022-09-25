import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '30168834-4da4897511e2455f9943883b1';
const BASE_URL = 'https://pixabay.com/api/';

const seachFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

seachFormEl.addEventListener('submit', onSeachFormSubmit);

function onSeachFormSubmit(e) {
  e.preventDefault();

  const searchValue = e.target.elements.searchQuery.value;

  getPhotos(searchValue)
    .then(renderMarkup)
    .then(markup => {
      galleryEl.insertAdjacentHTML('beforeend', markup);
    });
}

async function getPhotos(searchValue) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        q: `${searchValue}`,
      },
    });

    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    return response.data.hits;
  } catch (error) {
    console.log(error);
  }
}

function renderMarkup(cardsArray) {
  let markup = '';
  cardsArray.map(card => {
    const {
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    } = card;

    markup += `<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
        <b>Likes ${likes}</b>
        </p>
        <p class="info-item">
        <b>Views ${views}</b>
        </p>
        <p class="info-item">
        <b>Comments ${comments}</b>
        </p>
        <p class="info-item">
        <b>Downloads ${downloads}</b>
        </p>
    </div>
    </div>`;
  });
  return markup;
}
