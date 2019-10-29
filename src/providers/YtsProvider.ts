import { YtsApi, IYtsMoviesQuery, IYtsMovie } from '@moviecast/yts-api';

import { CancellationToken } from "../CancellationToken";
import { IProviderConfig } from '../interfaces/IProviderConfig';
import { ContentProvider } from './ContentProvider';

import { isDevelopment } from '../utils/environment';
import { IContentItem } from '../interfaces/IContentItem';
import { IContentItemTorrent } from '../interfaces/IContentItemTorrent';

export interface IYtsProviderConfig extends IProviderConfig<IYtsMoviesQuery> {

}

export class YtsProvider extends ContentProvider<IYtsProviderConfig> {
    private api = new YtsApi();

    protected async normalizeItem(item: IYtsMovie, token: CancellationToken): Promise<IContentItem> {
        token.throwIfCancelled();

        const torrents: IContentItemTorrent[] = item.torrents.map<IContentItemTorrent>(torrent => ({
            hash: torrent.hash,
            size: parseInt(torrent.size_bytes), // TODO: make size_bytes a number instead in @moviecast/yts-api
            peers: torrent.peers,
            seeds: torrent.seeds,
            quality: torrent.quality,
            provider: 'YTS'
        }))

        return {
            imdbId: item.imdb_code,
            torrents
        };
    }

    protected async getPageRawItems(pageNumber: number, config: IYtsProviderConfig, token: CancellationToken) {
        token.throwIfCancelled();

        const { data } = await this.api.getMovieList({
            ...config.query,
            page: pageNumber + 1
        });

        return data.movies || [];
    }

    protected async getTotalPages(config: IYtsProviderConfig, token: CancellationToken) {
        token.throwIfCancelled();

        if(isDevelopment()) {
            return 10;
        }

        const { data } = await this.api.getMovieList(config.query);

        return Math.ceil(data.movie_count / data.limit);
    }
}