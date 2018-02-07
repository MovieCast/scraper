import config from 'config';
import Trakt from 'trakt.tv';
import Tmdb from 'tmdbapi';
import Fanart from 'fanart.tv';

export const trakt = new Trakt({
  client_id: config.trakt.client_id,
  client_secret: config.trakt.client_secret,
});

export const tmdb = new Tmdb({
  apiv3: config.tmdb.key
});

export const fanart = new Fanart(config.fanart.key);
