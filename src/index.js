import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getRefs } from './js/refs';
import { renderMarkup } from './js/renderCard';
import { fetchImages } from './js/fetchImages';
import { noMorePages } from './js/end';
// import * as btn from './js/btn_up';

const { formElement, galleryElement, textElement, btnUpElement } = getRefs();

let page = null;
let nameImg = '';
const perPage = 40;

const Lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  animationSpeed: 250,
  preloading: false,
  docClose: false,
  widthRatio: 1,
  doubleTapZoom: 1.5,
});

formElement.addEventListener('submit', getGallery);

async function getGallery(event) {
  event.preventDefault();
  galleryElement.innerHTML = '';
  nameImg = event.target.searchQuery.value.toLowerCase();
  page = 1;
  try {
    const img = await fetchImages(nameImg);
    const imgData = img.data;
    console.log(imgData);
    if (imgData.total === 0) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    console.log(imgData.totalHits)
    textElement.innerHTML = '';

    Notify.success(`Hooray! We found ${imgData.totalHits} images.`);
    renderMarkup(imgData.hits);
    
    noMorePages(imgData);

    Lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

async function onClickMoreImg() {
  try {
    if (page > 0) {
      page += 1;
      const img = await fetchImages(nameImg);
      const imgData = img.data;
      renderMarkup(imgData.hits);
      noMorePages(imgData);
      Lightbox.refresh();
    }
  } catch (error) {
    console.log(error.message);
  }
}

export { perPage, page, nameImg };

// window.addEventListener('scroll', () => {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   // console.log('top', documentRect.top);
//   console.log('bottom', documentRect.bottom);
//   if(documentRect.bottom < document.documentElement.clientHeight + 150) {
//     console.log('DONE')
//     // page++
//     page += 1;
//     onClickMoreImg()
    
//   }
// })

const options = {
  rootMargin: '100px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {

      // Делаем HTTP-запрос
      // fetchImages();

      // Добавляем разметку
      onClickMoreImg();

    }
  });
}, options);

observer.observe(document.querySelector('.scroll-guard'));



// Кнопка UP

btnUpElement.addEventListener('click', onClickBtnUp)

function onClickBtnUp () {
  galleryElement.scrollIntoView({block: "start", behavior: "smooth"})
}

window.addEventListener('scroll', sizeScrol)

function sizeScrol () {
  if(scrollY > 400) {
    btnUpElement.classList.remove('is-hidden')
  } else {
    btnUpElement.classList.add('is-hidden')
  }
}

