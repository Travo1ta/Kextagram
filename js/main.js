//import './render-posts.js';
//import './form.js';
//import './utils.js';
//import './data.js';
import { getPictures } from './data.js';
import { renderPictures } from './picture-render.js';

// Получаем массив фотографий
const pictures = getPictures();
//console.log(pictures);

// Отрисовываем фотографии
renderPictures(pictures);


