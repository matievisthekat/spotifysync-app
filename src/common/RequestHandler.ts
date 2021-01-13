import Axios from "axios";
import { BrowserWindow } from "electron";
import qs from "querystring";
import Spotify from "./spotify-api";
import store from "./store";

const API = "https://api.spotify.com/v1";

export interface RequestHandlerOptions {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export default class RequestHandler {
  public verbose = false;
  private basic?: string;
  private clientId?: string;
  private clientSecret?: string;
  private redirectUri?: string;
  private scope?: string[];
  private loginWindow?: BrowserWindow;
  private code?: string;

  constructor(opts: RequestHandlerOptions) {
    this.clientId = opts.clientId;
    this.clientSecret = opts.clientSecret;
    this.basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");
    this.redirectUri = opts.redirectUri;
    this.scope = opts.scope;
  }

  public login() {
    return new Promise<boolean>((resolve, reject) => {
      this.loginWindow = new BrowserWindow({
        width: 550,
        height: 650,
        alwaysOnTop: true,
        autoHideMenuBar: true,
        show: true,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          nodeIntegrationInWorker: false,
          enableRemoteModule: false,
          experimentalFeatures: false,
          allowRunningInsecureContent: false,
        },
      });

      this.loginWindow.loadURL(this.authUrl);

      this.loginWindow.on("close", () => {
        if (this.code) resolve(true);
        else resolve(false);
      });
    });
  }

  public closeLoginWindow() {
    if (this.loginWindow) this.loginWindow.close();
  }

  public init(code: string, refresh?: boolean) {
    return new Promise<void>((resolve, reject) => {
      const data = {
        grant_type: refresh ? "refresh_token" : "authorization_code",
        redirect_uri: this.redirectUri as string,
        [refresh ? "refresh_token" : "code"]: refresh ? (this.refreshToken as string) : code,
      };

      Axios.post<TokenResponse>("https://accounts.spotify.com/api/token", qs.stringify(data), {
        headers: {
          Authorization: `Basic ${this.basic}`,
        },
      })
        .then((res) => {
          this.log(refresh ? "Refreshed tokens" : "Fetched tokens");

          this.accessToken = res.data.access_token;
          this.tokenExpiresMs = res.data.expires_in * 1000;
          this.fetchedTimestamp = Date.now();

          resolve();
        })
        .catch(reject);
    });
  }

  public getUser() {
    return new Promise<Spotify.UserObjectPrivate>(async (resolve, reject) => {
      if (this.tokenExpired) await this.init("", true);
      Axios.get<Spotify.UserObjectPrivate>(`${API}/me`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  }

  public next() {
    return new Promise<void>(async (resolve, reject) => {
      if (this.tokenExpired) await this.init("", true);
      Axios.post(
        `${API}/me/player/next`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(() => resolve())
        .catch(reject);
    });
  }

  public pushTrackToQueue(uri: string) {
    return new Promise<void>(async (resolve, reject) => {
      if (this.tokenExpired) await this.init("", true);
      Axios.post<Spotify.UserObjectPrivate>(`${API}/me/player/queue`, qs.stringify({ uri }), {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      })
        .then(() => resolve())
        .catch(reject);
    });
  }

  public pause() {
    return new Promise<void>(async (resolve, reject) => {
      if (this.tokenExpired) await this.init("", true);
      Axios.put(
        `${API}/me/player/pause`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(() => resolve())
        .catch(reject);
    });
  }

  public resume() {
    return new Promise<void>(async (resolve, reject) => {
      if (this.tokenExpired) await this.init("", true);
      Axios.put(
        `${API}/me/player/play`,
        {},
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      )
        .then(() => resolve())
        .catch(reject);
    });
  }

  public setCode(code: string) {
    this.code = code;
  }

  private log(msg: string) {
    if (this.verbose) console.log(msg);
  }

  public get accessToken() {
    return store.get("accessToken");
  }

  public get refreshToken() {
    return store.get("refreshToken");
  }

  public get tokenExpiresMs() {
    return store.get("tokenExpiresMs");
  }

  public get fetchedTimestamp() {
    return store.get("fetchedTimestamp");
  }

  public get tokenExpired() {
    return this.fetchedTimestamp + this.tokenExpiresMs <= Date.now();
  }

  public get authUrl() {
    return `https://accounts.spotify.com/authorize?client_id=${this.clientId}&redirect_uri=${
      this.redirectUri
    }&scope=${this.scope?.join("%20")}&response_type=code&show_dialog=true`;
  }

  public set accessToken(v: string | undefined) {
    store.set("accessToken", v);
  }

  public set refreshToken(v: string | undefined) {
    store.set("refreshToken", v);
  }

  public set tokenExpiresMs(v: number) {
    store.set("tokenExpiresMs", v);
  }

  public set fetchedTimestamp(v: number) {
    store.set("fetchedTimestamp", v);
  }
}
