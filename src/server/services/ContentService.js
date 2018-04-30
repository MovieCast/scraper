import { Model } from 'mongoose'; // eslint-disable-line

export default class ContentService {
  /**
   * The mongodb content model
   * @type {Model}
   */
  model

  /**
   * Projection which defines what content to show
   * @type {Object}
   */
  projection

  /**
   * Amount of content items per page
   * @type {number}
   */
  pageSize

  /**
   * @type {Object}
   */
  query

  /**
   *
   */
  constructor({
    model,
    projection,
    pageSize = 50,
    query
  } = {}) {
    this.model = model;
    this.projection = projection;
    this.pageSize = pageSize;
    this.query = query;
  }

  /**
   *
   * @param {string} s
   * @param {string} o
   */
  sortContent({
    sort,
    order,
    score = false
  } = {}) {
    const result = {};

    if (score) {
      result.score = {
        $meta: 'textScore'
      };
    }

    switch (sort.toLowerCase()) {
      case 'title':
      case 'name':
        return {
          ...result,
          title: order
        };
      case 'rating':
        return {
          ...result,
          'rating.votes': order,
          'rating.percentage': order
        };
      case 'released':
      case 'updated':
        return {
          ...result,
          released: order,
          latest_episode: order
        };
      case 'trending':
        return {
          ...result,
          'rating.watching': order
        };
      case 'year':
        return {
          ...result,
          year: order
        };
      default:
        return {
          ...result,
          'rating.votes': order,
          'rating.precentage': order,
          'rating.watching': order
        };
    }
  }

  async getPages() {
    const totalResults = await this.model.count(this.query);
    return {
      totalPages: Math.ceil(totalResults / this.pageSize),
      totalResults
    };
  }

  /**
   * Get a formatted page object
   * @param {number} p - The page number
   * @param {Object} sort - The sort object
   * @param {Object} query - The query
   */
  async getPage(p, sort, query = { ...this.query }) {
    const page = Number.isNaN(p) ? 0 : Number(p) - 1;
    const offset = page * this.pageSize;

    let aggregateQuery = [{
      $match: query,
    }, {
      $project: this.projection
    }];

    if (sort) {
      aggregateQuery = [...aggregateQuery, {
        $sort: sort
      }];
    }

    // FIXES SORT ISSUE
    aggregateQuery = [...aggregateQuery, {
      $skip: offset
    }, {
      $limit: this.pageSize
    }];

    const results = await this.model.aggregate(aggregateQuery);
    const totalResults = await this.model.count(query);

    return {
      page: page + 1,
      totalPages: Math.ceil(totalResults / this.pageSize),
      totalResults,
      results
    };
  }
}
