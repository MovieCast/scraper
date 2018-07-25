import YtsAPI from '@moviecast/yts-api';
import EztvAPI from '@moviecast/eztv-api';

import YTSProvider from './movie/YTSProvider';
import EZTVProvider from './show/EZTVProvider';

import MovieHelper from '../helpers/MovieHelper';
import ShowHelper from '../helpers/ShowHelper';
import { Movie, Show } from '../models';

module.exports = [
  {
    name: 'YTS',
    api: YtsAPI,
    model: Movie,
    provider: YTSProvider,
    helper: MovieHelper,
    query: { limit: 50 }
  },
  {
    name: 'EZTV',
    api: EztvAPI,
    model: Show,
    provider: EZTVProvider,
    helper: ShowHelper,
    query: { limit: 100 }
  }
];
