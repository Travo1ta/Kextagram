import { renderPictures } from './picture-render.js';
import { getPictures } from './data.js';
import { initFormValidation } from './form-validation.js';
import { initEffects, initScale, resetEffects } from './image-effects.js';
import { showBigPicture } from './big-picture.js';

// Инициализация приложения
const initApp = () => {
  // 1. Загрузка и отрисовка данных
  const picturesData = getPictures();
  renderPictures(picturesData);

  // 2. Инициализация редактора изображений
  initScale();
  initEffects();
  resetEffects();

  // 3. Инициализация формы
  initFormValidation();

  // 4. Делегирование событий для просмотра фото
  document.querySelector('.pictures').addEventListener('click', (evt) => {
    const pictureElement = evt.target.closest('.picture');
    if (pictureElement) {
      const pictureData = picturesData.find(
        (item) => item.id === parseInt(pictureElement.dataset.id, 10)
      );
      if (pictureData) {
        showBigPicture(pictureData);
      }
    }
  });
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспорт для тестирования
export { initApp };
