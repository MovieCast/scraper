import YtsAPI from '@moviecast/yts-api';

import YTSProvider from './movie/YTSProvider';
import MovieHelper from '../helpers/MovieHelper';
import { Movie } from '../../models';

module.exports = [
  {
    name: 'YTS',
    api: YtsAPI,
    model: Movie,
    provider: YTSProvider,
    helper: MovieHelper,
    query: { limit: 50 }
  },
  // {
  //     name: "Mock",
  //     provider: MockProvider,
  //     helper: MockHelper,
  //     config: {}
  // }
];
