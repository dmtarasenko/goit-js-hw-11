import axios from 'axios';
import Notiflix from 'notiflix';

const seachFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '30168834-4da4897511e2455f9943883b1';
const BASE_URL = 'https://pixabay.com/api/';
const perPage = 40;
let limitPage = 1;
let page = 1;
let searchValue = '';

seachFormEl.addEventListener('submit', onSeachFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMoreBtnClick);

function onSeachFormSubmit(e) {
  e.preventDefault();

  searchValue = e.target.elements.searchQuery.value;
  page = 1;

  galleryEl.innerHTML = '';

  getPhotos(searchValue, page)
    .then(renderMarkup)
    .then(markup => {
      galleryEl.insertAdjacentHTML('beforeend', markup);
      loadMoreBtn.classList.add('hidden');
    });
}

function onLoadMoreBtnClick(e) {
  page += 1;
  getPhotos(searchValue, page)
    .then(renderMarkup)
    .then(markup => {
      galleryEl.insertAdjacentHTML('beforeend', markup);
    });
}

async function getPhotos(searchValue, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: `${perPage}`,
        page: `${page}`,
        q: `${searchValue}`,
      },
    });

    limitPage = response.data.totalHits / perPage;

    if (!response.data.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

      return;
    }

    if (limitPage <= page) {
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.classList.remove('hidden');
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
