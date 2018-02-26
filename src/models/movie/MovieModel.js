import ContentModel from '../ContentModel';

export default class MovieModel extends ContentModel {
  /**
   * The language of the movie
   * @type {string}
   */
  language

  /**
   * The release date of the movie
   * @type {number}
   */
  released

  /**
   * The trailer of the movie
   * @type {string}
   */
  trailer

  /**
   * The certification of the movie
   * @type {string}
   */
  certification

  /**
   * The torrents of the movie
   * @type {Array<Object>}
   */
  torrents

  constructor({
    imdb_id,
    title,
    year,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres,
    language = 'en',
    released,
    trailer,
    certification,
    torrents
  } = {}) {
    super({
      imdb_id,
      title,
      year,
      slug,
      synopsis,
      runtime,
      rating,
      images,
      genres
    });

    this.language = language;
    this.released = released;
    this.rating = rating;
    this.trailer = trailer;
    this.certification = certification;
    this.torrents = torrents;
  }
}
