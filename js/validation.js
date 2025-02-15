const HASHTAG_MAX_LENGTH = 19;
const HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const HASHTAG_MASK = new RegExp( `^#[a-zа-яё0-9]{1,${HASHTAG_MAX_LENGTH}}$`, 'i' );

const imageEditFormNode = document.querySelector( '#upload-select-image' );
const imageEditBlockNode = imageEditFormNode.querySelector( '.img-upload__overlay' );
const hashtagInputNode = imageEditBlockNode.querySelector( '.text__hashtags' );
const commentInputNode = imageEditBlockNode.querySelector( '.text__description' );

const validationRules = new Pristine( imageEditFormNode, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error',
  errorTextTag: 'span',
}, true );

const createHashtagsArray = () => hashtagInputNode.value.split( /\s+/ );
const isCommentOverflow = ( value ) => value.length <= MAX_COMMENT_LENGTH;
const isHashtagOverflow = () => createHashtagsArray().length <= HASHTAG_COUNT;
const isHashtagValidValue = ( value ) => {
  if ( !value ) {
    return true;
  }
  return createHashtagsArray().every( ( item ) => HASHTAG_MASK.test( item ) );
};

const isSetDublicateHashtags = () => {
  const HASHTAGS = createHashtagsArray();
  const UNIQUE_HASHTAGS = new Set( HASHTAGS.map( ( value ) => value.toLowerCase() ) );
  return UNIQUE_HASHTAGS.size === HASHTAGS.length;
};

const addValidation = () => {
  validationRules.addValidator(
    commentInputNode,
    isCommentOverflow,
    `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов` );
  validationRules.addValidator(
    hashtagInputNode,
    isHashtagOverflow,
    `Нельзя указать больше ${HASHTAG_COUNT} хэш-тегов` );
  validationRules.addValidator(
    hashtagInputNode,
    isHashtagValidValue,
    'Хэштег должен начинаться с "#", содержать только буквы и цифры (не более 20 символов, включая #) и разделяться пробелами' );
  validationRules.addValidator(
    hashtagInputNode,
    isSetDublicateHashtags,
    'Найдены дубликаты хэштегов' );
};

addValidation();

export {
  imageEditFormNode,
  imageEditBlockNode,
  validationRules,
  hashtagInputNode,
  commentInputNode,
};
