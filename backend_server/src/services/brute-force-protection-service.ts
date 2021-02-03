import { BruteForceStore, BruteForceStoreObj } from '../interfaces/brute-force-types';

export class BruteForceProtectionService {
    private _store: BruteForceStore = {};

    public setBruteForceData(data: BruteForceStoreObj): void {
        const { username } = data;
        this._store[username] = {... data};
    }

    public getBruteForceData(username: string): BruteForceStoreObj {
        return this._store[username];
    }

    public deleteBruteForceData(username: string): void {
        delete this._store[username];
    }
}
