import { IProvider } from "./interfaces/IProvider";
import { CancellationToken, CancellationTokenSource } from "./CancellationToken";

export class Context {
    private provider: IProvider<any>;
    private tokenSource: CancellationTokenSource;

    setProvider(provider: IProvider<any>) {
        if(this.tokenSource) {
            this.tokenSource.cancel();
        }

        this.tokenSource = new CancellationTokenSource();
        this.provider = provider;
    }

    async process(token: CancellationToken, config: any) {
        token.throwIfCancelled();
        token.register(() => this.tokenSource.cancel());

        return await this.provider.provide(config, this.tokenSource.token);
    }
}