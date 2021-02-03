export interface BruteForceStore {
    [username: string]: BruteForceStoreObj;
}

export interface BruteForceStoreObj {
    username: string;
    attempts: number;
    blockExpiration?: number;
    isBlocked?: boolean;
}
