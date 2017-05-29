import HttpsProxyAgent = require("https-proxy-agent");
import fetchNode = require("node-fetch");
const isNode = typeof this !== "undefined" && ({}).toString.call(this) === "[object Object]";

const Fetch = isNode ? fetchNode : this.fetch ;

function getRequestOptions(rmethod: string, rheaders: object, content: BodyInit): object {

    let options: object = {
        cache: "default",
        headers: rheaders,
        method: rmethod,
        mode: "cors",
    };

    if ((content !== "") && (content != null)) {
        options = {...options, body: content};
    }

    if (isNode && process !== undefined && process.env.http_proxy) {
        options = {...options, agent: new HttpsProxyAgent(process.env.http_proxy)};
    }

    return options;

}

const notAuhorizedHeaders: object = {
         "Accept": "application/json",
         "Accept-Encoding": "gzip, deflate",
         "Content-Type": "application/json",
     };

function getAuhorizedHeaders(token: string): object {
    return { ...notAuhorizedHeaders, Authorization: `Bearer ${token}` };
}

function getHeaders(token: string): object {
    return token === "" ? notAuhorizedHeaders : getAuhorizedHeaders(token);
}

function ftch(url: string, rinit: object): Promise<any> {
    // // tslint:disable-next-line:no-console
    // console.log(url);
    // // tslint:disable-next-line:no-console
    // console.log(JSON.stringify(rinit));
    return Fetch(url, rinit).then((response: any) => response.ok
    ? response.json()
    : response.json().then((err: Error) => Promise.reject(err)));
}

function Patch(url: string, token: string, data: object): Promise<any> {
    const content: BodyInit = JSON.stringify(data);
    const rinit = getRequestOptions("PATCH", getHeaders(token), content);
    return ftch(url, rinit);
}

function Post(url: string, token: string, data: object): Promise<any> {
    const content: BodyInit = JSON.stringify(data);
    const rinit = getRequestOptions("POST",  getHeaders(token), content);
    return ftch(url, rinit);
}

function Delete(url: string, token: string): Promise<any> {
    const rinit = getRequestOptions("DELETE", getHeaders(token), "");
    return ftch(url, rinit);
}

function Get(url: string, token: string): Promise<any> {
    const rinit = getRequestOptions("GET", getHeaders(token), "");
    return ftch(url, rinit);
}

export { Delete, Get, Patch, Post };
// ---------------------------------------------
// const isBrowser = typeof window !== "undefined"
//     && ({}).toString.call(window) === "[object Window]";

// function isPromiseSupported() {
//     let supported = false;
//     try {
//         const p = new Promise(function (res, rej) { });
//         supported = true;
//     } catch (e) { }
//     return supported;
// }
