import {getRandomArrayElement, getRandomNum } from './utils.js';

// Массивы с возможными данными
const DESCRIPTIONS = [
  'Прекрасный закат над городом.',
  'Лес в утреннем тумане.',
  'Собака играет на пляже.',
  'Восхитительное блюдо, которое я приготовил.',
  'Момент с друзьями на горнолыжном курорте.',
  'Солнечный день у озера.'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Александр',
  'Мария',
  'Дмитрий',
  'Анна',
  'Сергей',
  'Елена',
  'Кирилл'
];

const POST_COUNT = 25;

// Функция для создания объекта комментария

const createComment = (id) => {
  const avatarId = getRandomNum(1, 6);
  return {
    id: id,
    avatar: `img/avatar-${avatarId}.svg`,
    message: getRandomArrayElement(MESSAGES),
    name: getRandomArrayElement(NAMES)
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
    description: getRandomArrayElement(DESCRIPTIONS),
    likes: likes,
    comments: generateComments(commentsCount)
  };
};

// Основная функция для генерации массива фотографий

const getPictures = () =>
  Array.from({ length: POST_COUNT }, (_, index) => createPicture(index + 1));




export {
  getPictures,
};
