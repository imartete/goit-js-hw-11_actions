import './css/styles.css';
import fetchImages from './fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputFormNode = document.querySelector('.search-form');
const galleryNode = document.querySelector('.gallery');
const loadBtnNode = document.querySelector('.load-more');
let enteredText, searchQuery, currentPage, totalPages;

let scrolledToBottom = false;

inputFormNode.addEventListener('submit', event => {
  event.preventDefault();
  enteredText = event.target.elements.searchQuery.value.trim();

  if (enteredText !== searchQuery) {
    loadBtnNode.classList.add('hidden');
    searchQuery = enteredText;
    currentPage = 1;
    galleryNode.textContent = '';
    loadGallery();
    scrolledToBottom = false;
  }
});

loadBtnNode.addEventListener('click', event => {
  event.preventDefault();
  loadGallery();
});

window.addEventListener('scroll', () => {
  if (!scrolledToBottom) onEndOfSearch();
});

function onEndOfSearch() {
  if (
    currentPage > totalPages &&
    window.innerHeight + Math.ceil(window.pageYOffset) >=
      document.body.offsetHeight
  ) {
    scrolledToBottom = true;
    Notify.info("We're sorry, but you've reached the end of search results.");
    loadBtnNode.classList.add('hidden');
  }
}

async function loadGallery() {
  try {
    const data = await fetchImages(searchQuery, currentPage);

    const imagesArray = data.hits;
    totalPages = Math.ceil(data.totalHits / 40);

    if (imagesArray.length == 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      galleryNode.insertAdjacentHTML(
        'beforeend',
        makeGallery(imagesArray).join('')
      );
      loadBtnNode.classList.remove('hidden');
      inputFormNode.reset();
      new SimpleLightbox('.gallery a').refresh();

      if (totalPages <= 1) {
        loadBtnNode.classList.add('hidden');
      }

      if (currentPage == 1) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    }
    currentPage += 1;
  } catch {
    console.log(error);
  }
}

function makeGallery(array) {
  return array.map(el => {
    return `
    <a href="${el.largeImageURL}" class="photo-card">
    <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes ${el.likes}</b>
      </p>
      <p class="info-item">
        <b>Views ${el.views}</b>
      </p>
      <p class="info-item">
        <b>Comments ${el.comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads ${el.downloads}</b>
      </p>
    </div>
  </a>`;
  });
}
