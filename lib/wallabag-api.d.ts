export interface IFilter {
    page: number | undefined;
    perPage: number | undefined;
    sort: string | undefined;
    order: string | undefined;
    since: number | undefined;
    archived: number | undefined;
    starred: number | undefined;
    tags: string | undefined;
}
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
export interface IWExists {
    exists: boolean;
}
export declare const defaultData: IWData;
export declare class WallabagApi {
    private data;
    constructor(data?: object);
    get: () => IWData;
    set: (data: object) => void;
    getApiVersion(url?: string): Promise<any>;
    isCredentialsRequired: () => boolean;
    getApplicationToken(username: string, password: string): Promise<any>;
    refreshToken(): Promise<any>;
    private getTokens(content);
    isApplicationTokenExpired: () => boolean;
    isRefreshTokenExpired: () => boolean;
    checkToken(): Promise<any>;
    saveArticle(url: string): Promise<any>;
    entryExists(url: string): Promise<IWExists>;
    getArticle(articleId: number): Promise<any>;
    deleteArticle(articleId: number): Promise<any>;
    saveTitle(articleId: number, articleTitle: string): Promise<any>;
    saveStarred(articleId: number, articleStarred: number): Promise<any>;
    saveArchived(articleId: number, articleArchived: number): Promise<any>;
    patchArticle(articleId: number, content: object): Promise<any>;
    getArticles(filter: any): Promise<any>;
    getAllTags(): Promise<any>;
    getArticleTags(articleId: number): Promise<any>;
    deleteArticleTag(articleId: number, tagid: number): Promise<any>;
    saveTags(articleId: number, tagList: string): Promise<any>;
    addTags(articleId: number, tagList: string): Promise<any>;
    removeTags(articleId: number, tagList: string): Promise<any>;
}
