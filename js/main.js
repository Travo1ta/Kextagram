//import './upload-photo.js';


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

const getRandomElement = (array) => array[getRandomNum(0, array.length - 1)];

//Функция для проверки максимальной длины строки.

//const isLengthLimit = (string, maxLength) =>  string.length <= maxLength;

//isLengthLimit();

// Массивы с возможными данными
const descriptions = [
  'Прекрасный закат над городом.',
  'Лес в утреннем тумане.',
  'Собака играет на пляже.',
  'Восхитительное блюдо, которое я приготовил.',
  'Момент с друзьями на горнолыжном курорте.',
  'Солнечный день у озера.'
];

const messages = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const names = [
  'Александр',
  'Мария',
  'Дмитрий',
  'Анна',
  'Сергей',
  'Елена',
  'Кирилл'
];

// Функция для генерации комментария
const createComment = (id) => {
  const avatarId = getRandomNum(1, 6);
  return {
    id: id,
    avatar: `img/avatar-${avatarId}.svg`,
    message: getRandomElement(messages),
    name: getRandomElement(names)
  };
};

// Функция для генерации массива комментариев
const generateComments = (count) =>
  Array.from({ length: count }, (_, index) => createComment(index + 1));


// Функция для создания объекта фотографии

const createPicture = (id) => {
  const likes = getRandomNum(15, 200);
  const commentsCount = getRandomNum(1, 5); // количество комментариев от 1 до 5
  return {
    id: id,
    url: `photos/${id}.jpg`,
    description: getRandomElement(descriptions),
    likes: likes,
    comments: generateComments(commentsCount)
  };
};

// Основная функция для генерации массива фотографий

const getPictures = () =>
  Array.from({ length: 25 }, (_, index) => createPicture(index + 1));

// Генерация массива из 25 фотографий
const photosArray = getPictures();
console.log(photosArray);
