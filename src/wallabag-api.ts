import {Delete, Get, Patch, Post} from "./fetch-api";

// because wallabag api doesn't return this, it is hardcoded
const refresnExpirePeriod = 1209600;

export interface IWData {
    url: string | null;
    version: string | null;
    clientId: string | null;
    clientSecret: string | null;
    applicationToken: string | null;
    refreshToken: string | null;
    expireDate: Date |  null;
    refreshExpireDate: Date | null;
}

export interface IWCredentials {
    userLogin: string;
    userPassword: string;
}
export interface IWExists {
  exists: boolean;
}
const defaultData: IWData = {
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

    private data: IWData;

    constructor(data?: object) {
        // tslint:disable-next-line:no-object-literal-type-assertion
        this.data = {...defaultData, ...data} as IWData;
    }

// --------- Api related functions
    public get = (): IWData => this.data;

    public set = (data: object): void => {
      // tslint:disable-next-line:no-object-literal-type-assertion
      this.data = {...this.data, ...data} as IWData;
    }

    public async getApiVersion(): Promise<any>  {
        const version = await Get(`${this.data.url}/api/version`, "");
        this.data.version = version;
        return version;
    }

    public isCredentialsRequired = (): boolean =>
          this.data.applicationToken === null || this.data.refreshToken === null || this.isRefreshTokenExpired()

// --------- Tokens related functions
    public async getApplicationToken(credentials: IWCredentials): Promise<any> {
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

    private isApplicationTokenExpired = (): boolean => this.data.expireDate < (new Date());
    private isRefreshTokenExpired = (): boolean => this.data.refreshExpireDate < (new Date());

    private checkToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve( this.isApplicationTokenExpired() ? this.refreshToken() : 1);
        });
    }
// ---- todo : export, reload

// --------- Article related functions
    public async saveArticle(url: string): Promise<any> {
        await this.checkToken();
        return await Post(`${this.data.url}/api/entries.json`,
                          this.data.applicationToken,
                          { url });
    }

    public async entryExists(url: string): Promise<IWExists>  {
        await this.checkToken();
        return await Get(`${this.data.url}/api/entries/exists.json?url=${url}`,
                          this.data.applicationToken);
    }

    public async getArticle(articleId: number) {
        await this.checkToken();
        return await Get(`${this.data.url}/api/entries/${articleId}.json`,
                          this.data.applicationToken);
    }

    public async deleteArticle(articleId: number) {
        await this.checkToken();
        return await Delete(`${this.data.url}/api/entries/${articleId}.json`,
                            this.data.applicationToken);
    }

    public async saveTitle(articleId: number, articleTitle: string) {
        return await this.patchArticle(articleId, { title: articleTitle });
    }

    public async saveStarred(articleId: number, articleStarred: number) {
        return await this.patchArticle(articleId, { starred: articleStarred });
    }

    public async saveArchived(articleId: number, articleArchived: number) {
        return await this.patchArticle(articleId, { archive: articleArchived });
    }

    public async saveTags(articleId: number, tagList: string) {
        return await this.patchArticle(articleId, { tags: tagList });
    }

    private async patchArticle(articleId: number, content: object) {
        await this.checkToken();
        return await Patch(`${this.data.url}/api/entries/${articleId}.json`,
                            this.data.applicationToken, content);
    }

    public async getArticles({ page, perPage, sort, order, since, archived, starred, tags }): Promise<any> {
        await this.checkToken();
        let url = `${this.data.url}/api/entries.json`;
        let params = [];
        if (page !== undefined) { params = [...params, `page=${page}`]; }
        if (perPage !== undefined) { params = [...params, `perPage=${perPage}` ]; }
        if (sort !== undefined) { params = [...params,  `sort=${sort}`]; }
        if (order !== undefined) { params = [...params, `order=${order}`]; }
        if (archived !== undefined) { params = [...params, `archived=${archived}`]; }
        if (starred !== undefined) { params = [...params, `starred=${starred}`]; }
        if (params.length > 0) { url = `${url}?${params.join('&')}`; }
        return await Get(url, this.data.applicationToken );
    }

// -------- Tags related functions
    public async getAllTags() {
        await this.checkToken();
        return await Get(`${this.data.url}/api/tags.json`, this.data.applicationToken);
    }
    public async getArticleTags(articleId: number) {
        await this.checkToken();
        return await Get(`${this.data.url}/api/entries/${articleId}/tags.json`, this.data.applicationToken);
    }
}
