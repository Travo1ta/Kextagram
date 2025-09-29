import { getData } from './api.js';
import { renderPictures } from './picture-render.js';
import { initFormValidation } from './form-validation.js';
import { initEffects } from './image-effects.js';
import { showBigPicture } from './big-picture.js';
import { showErrorMessage, debounce } from './utils.js';
import { turnFilterOn, filterPictures } from './filters.js';



const initApp = async () => {
  const picturesContainer = document.querySelector('.pictures');

  try {
    const picturesData = await getData();

    // Оптимизированная функция отрисовки с устранением дребезга
    const debouncedRenderPictures = debounce(renderPictures);

    // Включаем фильтры и передаем функцию отрисовки
    turnFilterOn(picturesData, debouncedRenderPictures);

    // Первоначальная отрисовка с применением фильтра по умолчанию
    debouncedRenderPictures(filterPictures());

    if (picturesContainer) {
      picturesContainer.addEventListener('click', (evt) => {
        const picture = evt.target.closest('.picture');
        if (picture) {
          const pictureId = parseInt(picture.dataset.id, 10);
          const pictureData = picturesData.find((item) => item.id === pictureId);

          if (pictureData) {
            showBigPicture(pictureData);
          } else {
            showErrorMessage('Фото не найдено');
          }
        }
      });
    }
  } catch (error) {
    if (error.status === 404) {
      showErrorMessage('Сервер не найден. Проверьте адрес');
    } else if (error.status === 500) {
      showErrorMessage('Ошибка на сервере. Попробуйте позже');
    } else if (error.isNetworkError) {
      showErrorMessage('Проблемы с соединением. Проверьте интернет');
    } else {
      showErrorMessage(error.message || 'Ошибка загрузки данных с сервера');
    }
  }

  initFormValidation();
  initEffects();
};

document.addEventListener('DOMContentLoaded', initApp);
