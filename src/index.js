import './css/styles.css';
import fetchImages from './fetchImages.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const inputFormNode = document.querySelector('.search-form');
const galleryNode = document.querySelector('.gallery');
const loadBtnNode = document.querySelector('.load-more');

inputFormNode.addEventListener('submit', event => {
  event.preventDefault();

  const searchQuery = event.target.elements.searchQuery.value.trim();
  let currentPage = 1;

  fetchImages(searchQuery, currentPage)
    .then(data => {
      // console.log(data);
      const imagesArray = data.hits;
      const totalPages = Math.ceil(data.totalHits / 40);

      if (!imagesArray.length) {
        galleryNode.textContent = '';
        Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."'
        );
      } else {
        galleryNode.innerHTML = makeGallery(imagesArray).join('');
        loadBtnNode.classList.remove('hidden');
        inputFormNode.reset();
        Notify.success(`"Hooray! We found ${data.totalHits} images."`);
      }
      if (imagesArray.length && currentPage >= totalPages) {
        Notify.info(
          '"We\'re sorry, but you\'ve reached the end of search results."'
        );
        loadBtnNode.classList.add('hidden');
      }

      loadBtnNode.addEventListener('click', event => {
        event.preventDefault();

        if (event.target.click) {
          currentPage += 1;
        }

        fetchImages(searchQuery, currentPage).then(data => {
          galleryNode.insertAdjacentHTML(
            'beforeend',
            makeGallery(data.hits).join('')
          );
          // if (inputFormNode.submit) {
          //   currentPage = 1;
          // }
          console.log(currentPage);
        });
      });
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

new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
}).refresh();
