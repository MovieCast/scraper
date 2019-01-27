import { CancellationToken } from "../CancellationToken";
import { IProviderConfig } from "./IProviderConfig";

export interface IProvider<T extends IProviderConfig<any>> {
    provide(config: T, token: CancellationToken): Promise<any>;
}