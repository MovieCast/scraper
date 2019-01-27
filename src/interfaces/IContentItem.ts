import { IContentItemTorrent } from "./IContentItemTorrent";

export interface IContentItem {
    imdbId: string;

    torrents: IContentItemTorrent[];
}