/* eslint-disable camelcase */

import ContentModel from '../ContentModel';

export default class ShowModel extends ContentModel {
  /**
   * The tvdb id of the show.
   * @type {number}
   */
  tvdb_id

  /**
   * The country of the show.
   * @type {string}
   */
  country

  /**
   * The network of the show.
   * @type {string}
   */
  network

  /**
   * The air day of the show.
   * @type {string}
   */
  air_day

  /**
   * The air time of the show.
   * @type {number}
   */
  air_time

  /**
   * The status of the show.
   * @type {string}
   */
  status

  /**
   * The number of seasons of the show.
   * @type {number}
   */
  num_seasons

  /**
   * The time the show was last updated.
   * @type {number}
   */
  last_updated

  /**
   * The latest episode of the show.
   * @type {number}
   */
  latest_episode

  /**
   * The episodes of the show.
   * @type {Array<Object>}
   */
  episodes

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
    tvdb_id,
    country,
    network,
    air_day,
    air_time,
    status,
    num_seasons,
    last_updated,
    latest_episode = 0,
    episodes
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
      genres,
    });

    this.tvdb_id = tvdb_id;
    this.country = country;
    this.network = network;
    this.air_day = air_day;
    this.air_time = air_time;
    this.status = status;
    this.num_seasons = num_seasons;
    this.last_updated = last_updated;
    this.latest_episode = latest_episode;
    this.episodes = episodes;
  }
}
