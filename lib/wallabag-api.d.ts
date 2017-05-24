export interface IWallabagData {
    url: string | null;
    version: string | null;
    clientId: string | null;
    clientSecret: string | null;
    applicationToken: string | null;
    refreshToken: string | null;
    expireDate: Date | null;
    refreshExpireDate: Date | null;
}
export interface IWallabagCredentials {
    userLogin: string;
    userPassword: string;
}
export declare class WallabagApi {
    private data;
    constructor(data?: object);
    get: () => IWallabagData;
    set: (data: object) => void;
    getApiVersion(): Promise<any>;
    isCredentialsRequired: () => boolean;
    getApplicationToken(credentials: IWallabagCredentials): Promise<any>;
    refreshToken(): Promise<any>;
    private getTokens(content);
    private isRefreshTokenExpired;
}
