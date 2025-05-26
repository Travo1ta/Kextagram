//import './render-posts.js';
//import './form.js';
//import './utils.js';
//import './data.js';
import { getPictures } from './data.js';
import { renderPictures } from './picture-render.js';
import { renderThumbnails } from './thumbnails.js';

// Получаем массив фотографий
const pictures = getPictures();
//console.log(pictures);

// Отрисовываем фотографии
renderPictures(pictures);

// отрисовываем миниатюры
renderThumbnails(pictures);

