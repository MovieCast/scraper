import Trakt from 'trakt.tv';
import Tmdb from 'tmdbapi';
import Fanart from 'fanart.tv';

export const trakt = new Trakt({
  client_id: process.env.TRAKT_KEY
});

export const tmdb = new Tmdb({
  apiv3: process.env.TMDB_KEY
});

export const fanart = new Fanart(process.env.FANART_KEY);
