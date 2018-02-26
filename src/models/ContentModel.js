/* eslint-disable camelcase */

import { Model } from 'mongoose';

export default class ContentModel extends Model {
  /**
   * The id of the content.
   * @type {string}
   */
  _id

  /**
   * The imdb id of the content.
   * @type {string}
   */
  imdb_id

  /**
   * The title of the content.
   * @type {string}
   */
  title

  /**
   * The year of the content.
   * @type {number}
   */
  year

  /**
   * The slug of the content.
   * @type {string}
   */
  slug

  /**
   * The synopsis of the content.
   * @type {string}
   */
  synopsis

  /**
   * The runtime of the content
   * @type {number}
   */
  runtime

  /**
   * The rating of the content
   * @type {Object}
   */
  rating

  /**
   * The images of the content
   * @type {Object}
   */
  images

  /**
   * The genres of the content
   * @type {Array<string>}
   */
  genres

  constructor({
    imdb_id,
    title,
    year,
    slug,
    synopsis,
    runtime,
    rating,
    images,
    genres
  } = {}) {
    super();

    this._id = imdb_id;
    this.imdb_id = imdb_id;
    this.title = title;
    this.year = year;
    this.slug = slug;
    this.synopsis = synopsis;
    this.runtime = runtime;
    this.rating = rating;
    this.images = images;
    this.genres = genres;
  }
}
