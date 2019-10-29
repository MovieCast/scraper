import { IProvider } from "./interfaces/IProvider";
import { Context } from "./Context";
import { CancellationToken } from "./CancellationToken";
import { IProviderConfig } from "./interfaces/IProviderConfig";
import { YtsProvider } from "./providers/YtsProvider";
import pMap from "p-map";
import { ContentProvider } from "./providers/ContentProvider";

export class Scraper {
    private contentProviders = new Map<IProvider<any>, any[]>();
    private metaProviders = new Map<IProvider<any>, any[]>();
    private context = new Context();

    use<T extends IProviderConfig<any>>(provider: IProvider<T>, ...configs: T[]) {
        if(provider instanceof ContentProvider) {
            this.contentProviders.set(provider, configs);
            return;
        }

        throw new Error('Unsupported provider');
    }

    async scrape(token: CancellationToken) {
        token.throwIfCancelled();

        const items = [];

        await pMap(this.contentProviders.entries(), async ([provider, configs]) => {
            token.throwIfCancelled();

            this.context.setProvider(provider);
            await pMap(configs, async config => {
                token.throwIfCancelled();

                items.push(...await this.context.process(token, config));
            });
        });

        console.dir(items, { depth: null });
    }
}