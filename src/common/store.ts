import Store from "electron-store";

export interface StoreItems {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresMs: number;
  fetchedTimestamp: number;
}

export default new Store<StoreItems>({
  defaults: {
    tokenExpiresMs: 0,
    fetchedTimestamp: Date.now(),
  },
});
