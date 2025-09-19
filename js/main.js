

import { getData } from './api.js';
import { renderPictures } from './picture-render.js';
import { initFormValidation } from './form-validation.js';
import { initEffects } from './image-effects.js';
import { showBigPicture } from './big-picture.js';
import { showErrorMessage } from './utils.js';

const initApp = async () => {
  const picturesContainer = document.querySelector('.pictures');

  try {
    const picturesData = await getData();
    renderPictures(picturesData);

    if (picturesContainer) {
      picturesContainer.addEventListener('click', (evt) => {
        const picture = evt.target.closest('.picture');
        if (picture) {
          const pictureData = picturesData.find(item => item.id === parseInt(picture.dataset.id, 10));
          pictureData && showBigPicture(pictureData);
        }
      });
    }
  } catch (error) {
    showErrorMessage('Ошибка загрузки данных с сервера');
  }

  initEffects();
  initFormValidation();
};

document.addEventListener('DOMContentLoaded', initApp);
