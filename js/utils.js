//Функция, возвращающая случайное целое число из переданного диапазона включительно

const getRandomNum = (start, end) => {
  if (start < 0 || end < 0) {
    throw new TypeError('Допускаются только положительные числа!');
  }

  if (isNaN(start) || isNaN(end)) {
    throw new TypeError('Параметры могут быть только числами!');
  }

  if (start === end) {
    throw new TypeError('Невозможно сформировать разные числа!');
  }

  if (start > end) {
    [start, end] = [end, start];
  }

  start = Math.ceil(start);
  end = Math.floor(end);

  return Math.floor(Math.random() * (end - start + 1)) + start;
};

//функция для получения рандомного элемента массива

const getRandomArrayElement = (array) => array[getRandomNum(0, array.length - 1)];

//функция  проверки нажатой клавиши 'Escape'

const isEscapeKey = (evt) => evt.key === 'Escape';

//Функция для проверки максимальной длины строки.

//const isLengthLimit = (string, maxLength) =>  string.length <= maxLength;

//isLengthLimit();

//Функция для показа сообщения
const showMessage = (templateId, messageText) => {
  const template = document.querySelector(`#${templateId}`);

  if (!template) {
    throw new Error(`Шаблон с ID ${templateId} не найден`);
  }

  const messageFragment = template.content.cloneNode(true);
  const messageElement = messageFragment.querySelector('div');

  if (messageText) {
    const textElement = messageElement.querySelector('.message__text');
    if (textElement) {
      textElement.textContent = messageText;
    }
  }

  document.body.appendChild(messageElement);
  document.body.classList.add('modal-open');

  const removeMessage = () => {
    messageElement.remove();
    document.body.classList.remove('modal-open');
    document.removeEventListener('keydown', onDocumentKeydown);
  };

  const onDocumentKeydown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      removeMessage();
    }
  };

  const onMessageClick = (evt) => {
    if (evt.target.closest('.success__button') || evt.target.closest('.error__button')) {
      removeMessage();
    }

    if (!evt.target.closest('.success__inner') && !evt.target.closest('.error__inner')) {
      removeMessage();
    }
  };

  messageElement.addEventListener('click', onMessageClick);
  document.addEventListener('keydown', onDocumentKeydown);
};

//Функция для показа сообщения об успехе
const showSuccessMessage = (message) => {
  showMessage('success', message);
};

//Функция для показа сообщения об ошибке
const showErrorMessage = (message) => {
  showMessage('error', message);
};


export {
  getRandomNum,
  getRandomArrayElement,
  isEscapeKey,
  showSuccessMessage,
  showErrorMessage
};
