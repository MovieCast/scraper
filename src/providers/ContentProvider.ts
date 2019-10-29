import { IProvider } from "../interfaces/IProvider";
import { CancellationToken } from "../CancellationToken";
import { IProviderConfig } from "../interfaces/IProviderConfig";
import * as pTimes from "p-times";
import pMap from "p-map";
import { IContentItem } from "../interfaces/IContentItem";

export abstract class ContentProvider<T extends IProviderConfig<any>> implements IProvider<T> {

    protected abstract async normalizeItem(item: any, token: CancellationToken): Promise<IContentItem>;

    protected abstract async getPageRawItems(pageNumber: number, config: T, token: CancellationToken): Promise<any[]>;

    protected abstract async getTotalPages(config: T, token: CancellationToken): Promise<number>;

    private async getAllRawItems(totalPages: number, config: T, token: CancellationToken) {
        token.throwIfCancelled();

        const items = [];

        await pTimes(totalPages, async pageNumber => {
            token.throwIfCancelled();
            console.debug(`Started fetching page ${pageNumber + 1} out of ${totalPages}`);
            items.push(...await this.getPageRawItems(pageNumber, config, token));
        }, { concurrency: 5 });

        return items;
    }

    async provide(config: T, token: CancellationToken): Promise<any> {
        token.throwIfCancelled();

        const totalPages = await this.getTotalPages(config, token);

        const rawItems = await this.getAllRawItems(totalPages, config, token);

        return await pMap(rawItems, async item => {
            token.throwIfCancelled();

            return await this.normalizeItem(item, token);
        });
    }
}