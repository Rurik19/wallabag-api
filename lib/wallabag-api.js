"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch_api_1 = require("./fetch-api");
const refresnExpirePeriod = 1209600;
const defaultData = {
    url: null,
    version: null,
    clientId: null,
    clientSecret: null,
    applicationToken: null,
    refreshToken: null,
    expireDate: null,
    refreshExpireDate: null
};
class WallabagApi {
    constructor(data) {
        this.get = () => this.data;
        this.set = (data) => {
            this.data = Object.assign({}, this.data, data);
        };
        this.isCredentialsRequired = () => this.data.applicationToken === null || this.data.refreshToken === null || this.isRefreshTokenExpired();
        this.isApplicationTokenExpired = () => this.data.expireDate < (new Date());
        this.isRefreshTokenExpired = () => this.data.refreshExpireDate < (new Date());
        this.data = Object.assign({}, defaultData, data);
    }
    getApiVersion() {
        return __awaiter(this, void 0, void 0, function* () {
            const version = yield fetch_api_1.Get(`${this.data.url}/api/version`, "");
            this.data.version = version;
            return version;
        });
    }
    getApplicationToken(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getTokens({
                client_id: this.data.clientId,
                client_secret: this.data.clientSecret,
                grant_type: "password",
                password: credentials.userPassword,
                username: credentials.userLogin,
            });
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getTokens({
                grant_type: "refresh_token",
                refresh_token: this.data.refreshToken,
                client_id: this.data.clientId,
                client_secret: this.data.clientSecret
            });
        });
    }
    getTokens(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const oauthurl = `${this.data.url}/oauth/v2/token`;
            const fetchData = yield fetch_api_1.Post(oauthurl, "", content);
            this.data.applicationToken = fetchData.access_token;
            this.data.refreshToken = fetchData.refresh_token;
            const now = (new Date());
            this.data.expireDate =
                new Date(now.getTime() + fetchData.expires_in * 1000);
            this.data.refreshExpireDate =
                new Date(now.getTime() + refresnExpirePeriod * 1000);
            return fetchData;
        });
    }
    checkToken() {
        return new Promise((resolve, reject) => {
            resolve(this.isApplicationTokenExpired() ? this.refreshToken() : 1);
        });
    }
    saveArticle(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Post(`${this.data.url}/api/entries.json`, this.data.applicationToken, { url });
        });
    }
    entryExists(url) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Get(`${this.data.url}/api/entries/exists.json?url=${url}`, this.data.applicationToken);
        });
    }
    getArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Get(`${this.data.url}/api/entries/${articleId}.json`, this.data.applicationToken);
        });
    }
    deleteArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Delete(`${this.data.url}/api/entries/${articleId}.json`, this.data.applicationToken);
        });
    }
    saveTitle(articleId, articleTitle) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.patchArticle(articleId, { title: articleTitle });
        });
    }
    saveStarred(articleId, articleStarred) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.patchArticle(articleId, { starred: articleStarred });
        });
    }
    saveArchived(articleId, articleArchived) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.patchArticle(articleId, { archive: articleArchived });
        });
    }
    saveTags(articleId, tagList) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.patchArticle(articleId, { tags: tagList });
        });
    }
    patchArticle(articleId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Patch(`${this.data.url}/api/entries/${articleId}.json`, this.data.applicationToken, content);
        });
    }
    getArticles(page = 1, perPage = 30) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            const url = `${this.data.url}/api/entries.json?page=${page}&perPage=${perPage}`;
            return yield fetch_api_1.Get(url, this.data.applicationToken);
        });
    }
    getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Get(`${this.data.url}/api/tags.json`, this.data.applicationToken);
        });
    }
    getArticleTags(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Get(`${this.data.url}/api/entries/${articleId}/tags.json`, this.data.applicationToken);
        });
    }
}
exports.WallabagApi = WallabagApi;
