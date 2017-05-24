import {Delete, Get, Patch, Post} from "./fetch-api";

// because wallabag api doesn't return this, it is hardcoded
const refresnExpirePeriod = 1209600;

export interface IWallabagData {
    url: string | null;
    version: string | null;
    clientId: string | null;
    clientSecret: string | null;
    applicationToken: string | null;
    refreshToken: string | null;
    expireDate: Date |  null;
    refreshExpireDate: Date | null;
}

export interface IWallabagCredentials {
    userLogin: string;
    userPassword: string;
}

const defaultData: IWallabagData = {
    url: null,
    version: null,
    clientId: null,
    clientSecret: null,
    applicationToken: null,
    refreshToken: null,
    expireDate: null,
    refreshExpireDate: null
};

export class WallabagApi {

    private data: IWallabagData;

    constructor(data?: object) {
        // tslint:disable-next-line:no-object-literal-type-assertion
        this.data = {...defaultData, ...data} as IWallabagData;
    }

    public get = (): IWallabagData => this.data;

    public set = (data: object): void => {
      // tslint:disable-next-line:no-object-literal-type-assertion
      this.data = {...this.data, ...data} as IWallabagData;
    }

    public async getApiVersion(): Promise<any>  {
        const version = await Get(`${this.data.url}/api/version`, "");
        this.data.version = version;
        return version;
    }

    public isCredentialsRequired = (): boolean =>
          this.data.applicationToken === null || this.data.refreshToken === null || this.isRefreshTokenExpired()

    public async getApplicationToken(credentials: IWallabagCredentials): Promise<any> {
        return await this.getTokens({
                client_id: this.data.clientId,
                client_secret: this.data.clientSecret,
                grant_type: "password",
                password: credentials.userPassword,
                username: credentials.userLogin,
            });
    }

    public async refreshToken(): Promise<any> {
        return await this.getTokens({
            grant_type: "refresh_token",
            refresh_token: this.data.refreshToken,
            client_id: this.data.clientId,
            client_secret: this.data.clientSecret
        });
    }

    private async getTokens(content: object): Promise<any> {
        const oauthurl = `${this.data.url}/oauth/v2/token`;
        const fetchData = await Post(oauthurl, "", content);
        this.data.applicationToken = fetchData.access_token;
        this.data.refreshToken = fetchData.refresh_token;
        const now = (new Date());
        this.data.expireDate =
          new Date(now.getTime() + (fetchData.expires_in as number) * 1000);
        this.data.refreshExpireDate =
          new Date(now.getTime() + refresnExpirePeriod * 1000);
        return fetchData;
    }

    private isRefreshTokenExpired = (): boolean => this.data.refreshExpireDate < (new Date());
}
