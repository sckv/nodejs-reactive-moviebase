import rq from 'request-promise-native';
import {TranslatedText} from '@src/services/externalMoviesService/externalMovies';

const {GOOGLE_TRANSLATE_API} = process.env;
const TRANSLATE_API_PREFIX = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API}`;

const modelObject = {
  source: 'en',
  target: 'es',
  model: 'nmt',
  format: 'text',
  q: [''],
};

export const translateMovieText = async (text: string): Promise<string | null> => {
  if (!text) return null;

  const translation: TranslatedText = await rq({
    url: TRANSLATE_API_PREFIX,
    method: 'POST',
    body: {
      ...modelObject,
      q: [text],
    },
    json: true,
  });

  return translation.data.translations[0].translatedText;
};
