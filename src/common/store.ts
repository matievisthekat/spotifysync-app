import Store from "electron-store";
import { PlayingType } from "./types";

export interface StoreItems {
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresMs: number;
  fetchedTimestamp: number;
  connectionUrl?: string;
  codeVerifier?: string;
  track: string;
  artist: string;
  progress: number;
  duration: number;
  isPlaying: boolean;
  playingType: PlayingType;
  connected: boolean;
}

export default new Store<StoreItems>({
  defaults: {
    tokenExpiresMs: 0,
    fetchedTimestamp: Date.now(),
    isPlaying: false,
    progress: 0,
    duration: 0,
    track: "Unknown",
    artist: "Spotify",
    playingType: "unknown",
    connected: false,
  },
});
