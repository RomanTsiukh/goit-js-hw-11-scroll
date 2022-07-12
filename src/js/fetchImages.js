import axios from 'axios';
import { perPage, page } from '../index';

export async function fetchImages(nameImage) {
  axios.defaults.baseURL = 'https://pixabay.com/api/';
  const KEY = '28251298-ba7573d558705083124fcae2c';

  const options = new URLSearchParams({
    key: KEY,
    q: nameImage,
    image_type: 'photo',
    orientation: 'horisontal',
    safesearch: true,
    per_page: perPage,
    page,
  });

  return await axios.get(`?${options}`);
}