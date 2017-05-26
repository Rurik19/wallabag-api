"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpsProxyAgent = require("https-proxy-agent");
const fetchNode = require("node-fetch");
const isNode = typeof this !== "undefined" && ({}).toString.call(this) === "[object Object]";
const Fetch = isNode ? fetchNode : this.fetch;
function getRequestOptions(rmethod, rheaders, content) {
    let options = {
        cache: "default",
        headers: rheaders,
        method: rmethod,
        mode: "cors",
    };
    if ((content !== "") && (content != null)) {
        options = Object.assign({}, options, { body: content });
    }
    if (isNode && process !== undefined && process.env.http_proxy) {
        options = Object.assign({}, options, { agent: new HttpsProxyAgent(process.env.http_proxy) });
    }
    return options;
}
const notAuhorizedHeaders = {
    "Accept": "application/json",
    "Accept-Encoding": "gzip, deflate",
    "Content-Type": "application/json",
};
function getAuhorizedHeaders(token) {
    return Object.assign({}, notAuhorizedHeaders, { Authorization: `Bearer ${token}` });
}
function getHeaders(token) {
    return token === "" ? notAuhorizedHeaders : getAuhorizedHeaders(token);
}
function ftch(url, rinit) {
    console.log(url);
    console.log(JSON.stringify(rinit));
    return Fetch(url, rinit).then((response) => response.ok
        ? response.json()
        : response.json().then((err) => Promise.reject(err)));
}
function Patch(url, token, data) {
    const content = JSON.stringify(data);
    const rinit = getRequestOptions("PATCH", getHeaders(token), content);
    return ftch(url, rinit);
}
exports.Patch = Patch;
function Post(url, token, data) {
    const content = JSON.stringify(data);
    const rinit = getRequestOptions("POST", getHeaders(token), content);
    return ftch(url, rinit);
}
exports.Post = Post;
function Delete(url, token) {
    const rinit = getRequestOptions("DELETE", getHeaders(token), "");
    return ftch(url, rinit);
}
exports.Delete = Delete;
function Get(url, token) {
    const rinit = getRequestOptions("GET", getHeaders(token), "");
    return ftch(url, rinit);
}
exports.Get = Get;
