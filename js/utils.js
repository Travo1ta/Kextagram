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

const getRandomArrayElement = (array) => array[getRandomNum(0, array.length - 1)];

const isEscapeKey = (evt) => evt.key === 'Escape';

const showMessage = (templateId, message) => {
  const template = document.querySelector(`#${templateId}`);

  if (!template) {
    return;
  }

  const messageFragment = template.content.cloneNode(true);
  const messageElement = messageFragment.querySelector('div');

  if (message) {
    const textElement = messageElement.querySelector('.message__text');
    if (textElement) {
      textElement.textContent = message;
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

const showSuccessMessage = (message) => {
  showMessage('success', message);
};

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
