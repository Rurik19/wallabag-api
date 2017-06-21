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
exports.defaultData = {
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
        this.isApplicationTokenExpired = () => ((new Date(this.data.expireDate)).getTime()) < ((new Date()).getTime());
        this.isRefreshTokenExpired = () => ((new Date(this.data.refreshExpireDate)).getTime()) < ((new Date()).getTime());
        this.data = Object.assign({}, exports.defaultData, data);
    }
    getApiVersion(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const urlloc = (typeof url === 'string') ? url : this.data.url;
            const version = yield fetch_api_1.Get(`${urlloc}/api/version`, "");
            if (typeof url !== 'string') {
                this.data.version = version;
            }
            return version;
        });
    }
    getApplicationToken(username, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getTokens({
                client_id: this.data.clientId,
                client_secret: this.data.clientSecret,
                grant_type: "password",
                password,
                username
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
            yield this.checkToken();
            return yield this.patchArticle(articleId, { title: articleTitle });
        });
    }
    saveStarred(articleId, articleStarred) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield this.patchArticle(articleId, { starred: articleStarred });
        });
    }
    saveArchived(articleId, articleArchived) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield this.patchArticle(articleId, { archive: articleArchived });
        });
    }
    patchArticle(articleId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Patch(`${this.data.url}/api/entries/${articleId}.json`, this.data.applicationToken, content);
        });
    }
    getArticles(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, perPage, sort, order, since, archived, starred, tags } = filter;
            yield this.checkToken();
            let url = `${this.data.url}/api/entries.json`;
            let params = [];
            if (page !== undefined) {
                params = [...params, `page=${page}`];
            }
            if (perPage !== undefined) {
                params = [...params, `perPage=${perPage}`];
            }
            if (sort !== undefined) {
                params = [...params, `sort=${sort}`];
            }
            if (order !== undefined) {
                params = [...params, `order=${order}`];
            }
            if (archived !== undefined) {
                params = [...params, `archive=${archived}`];
            }
            if (starred !== undefined) {
                params = [...params, `starred=${starred}`];
            }
            if (tags !== undefined) {
                params = [...params, `tags=${encodeURI(tags)}`];
            }
            if (params.length > 0) {
                url = `${url}?${params.join('&')}`;
            }
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
    deleteArticleTag(articleId, tagid) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield fetch_api_1.Delete(`${this.data.url}/api/entries/${articleId}/tags/${tagid}.json`, this.data.applicationToken);
        });
    }
    saveTags(articleId, tagList) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            return yield this.patchArticle(articleId, { tags: tagList });
        });
    }
    addTags(articleId, tagList) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            const aTags = yield this.getArticleTags(articleId);
            const bTags = tagList.split(',');
            const tagListToSet = aTags.map((t) => t.label)
                .concat(bTags)
                .filter((x, i, a) => a.indexOf(x) === i)
                .join(',');
            return yield this.patchArticle(articleId, { tags: tagListToSet });
        });
    }
    removeTags(articleId, tagList) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.checkToken();
            const aTags = yield this.getArticleTags(articleId);
            const bTags = tagList.split(',');
            const tagsToRemove = aTags.filter((x) => bTags.indexOf(x.label) >= 0)
                .map((t) => this.deleteArticleTag(articleId, t.id));
            yield Promise.all(tagsToRemove);
            return yield this.getArticle(articleId);
        });
    }
}
exports.WallabagApi = WallabagApi;
