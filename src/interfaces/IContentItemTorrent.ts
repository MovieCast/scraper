export interface IContentItemTorrent {
    hash: string;
    size: number;
    peers: number;
    seeds: number;
    provider: string;
    quality: string;
}