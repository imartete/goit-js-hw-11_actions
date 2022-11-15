import './css/styles.css';
import fetchImages from './fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputFormNode = document.querySelector('.search-form');
const galleryNode = document.querySelector('.gallery');
const loadBtnNode = document.querySelector('.load-more');
let searchQuery, lightbox, currentPage, totalPages;

inputFormNode.addEventListener('submit', event => {
  event.preventDefault();

  searchQuery = event.target.elements.searchQuery.value.trim();
  currentPage = 1;

  fetchImages(searchQuery, currentPage)
    .then(data => {
      const imagesArray = data.hits;
      totalPages = Math.ceil(data.totalHits / 40);

      if (!imagesArray.length) {
        Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."'
        );
        galleryNode.textContent = '';
        loadBtnNode.classList.add('hidden');
      } else {
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
        galleryNode.innerHTML = makeGallery(imagesArray).join('');
        loadBtnNode.classList.remove('hidden');
        inputFormNode.reset();
      }
      if (imagesArray.length && currentPage >= totalPages) {
        Notify.info(
          '"We\'re sorry, but you\'ve reached the end of search results."'
        );
        loadBtnNode.classList.add('hidden');
      }
      lightbox = new SimpleLightbox('.gallery a');
    })
    .catch(error => console.log(error));
});

loadBtnNode.addEventListener('click', event => {
  event.preventDefault();

  if (event.target.click) {
    currentPage += 1;
  } else {
    currentPage = 1;
  }

  fetchImages(searchQuery, currentPage)
    .then(data => {
      galleryNode.insertAdjacentHTML(
        'beforeend',
        makeGallery(data.hits).join('')
      );
      lightbox.refresh();
      if (currentPage >= totalPages) {
        Notify.info(
          '"We\'re sorry, but you\'ve reached the end of search results."'
        );
        loadBtnNode.classList.add('hidden');
      }
    })
    .catch(error => console.log(error));
});

function makeGallery(array) {
  return array.map(el => {
    return `
    <a href="${el.largeImageURL}">
    <div class="photo-card">
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
  </div>
  </a>`;
  });
}
