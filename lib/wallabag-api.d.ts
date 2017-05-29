export interface IWData {
    url: string | null;
    version: string | null;
    clientId: string | null;
    clientSecret: string | null;
    applicationToken: string | null;
    refreshToken: string | null;
    expireDate: Date | null;
    refreshExpireDate: Date | null;
}
export interface IWCredentials {
    userLogin: string;
    userPassword: string;
}
export interface IWExists {
    exists: boolean;
}
export declare class WallabagApi {
    private data;
    constructor(data?: object);
    get: () => IWData;
    set: (data: object) => void;
    getApiVersion(): Promise<any>;
    isCredentialsRequired: () => boolean;
    getApplicationToken(credentials: IWCredentials): Promise<any>;
    refreshToken(): Promise<any>;
    private getTokens(content);
    private isApplicationTokenExpired;
    private isRefreshTokenExpired;
    private checkToken();
    saveArticle(url: string): Promise<any>;
    entryExists(url: string): Promise<IWExists>;
    getArticle(articleId: number): Promise<any>;
    deleteArticle(articleId: number): Promise<any>;
    saveTitle(articleId: number, articleTitle: string): Promise<any>;
    saveStarred(articleId: number, articleStarred: number): Promise<any>;
    saveArchived(articleId: number, articleArchived: number): Promise<any>;
    saveTags(articleId: number, tagList: string): Promise<any>;
    private patchArticle(articleId, content);
    getArticles(page?: number, perPage?: number): Promise<any>;
    getAllTags(): Promise<any>;
    getArticleTags(articleId: number): Promise<any>;
}
