import { perPage, page } from '../index';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function noMorePages(response) {
  const totalPage = Math.ceil(response.totalHits / perPage);
  if (page === totalPage) {
     Notify.failure('Were sorry, but youve reached the end of search results.')
  }
}