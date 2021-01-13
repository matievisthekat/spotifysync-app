import Store from "electron-store";

export interface StoreItems {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresMs: number;
  fetchedTimestamp: number;
  connectionUrl?: string;
}

export default new Store<StoreItems>({
  defaults: {
    tokenExpiresMs: 0,
    fetchedTimestamp: Date.now(),
  },
});
