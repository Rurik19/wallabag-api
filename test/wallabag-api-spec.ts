
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chai from "chai";
import { WallabagApi, IWData, IWCredentials } from "../src/wallabag-api";
// import * from "chai-datetime";
// if (process !== undefined) {
  // process.env.http_proxy = "http://127.0.0.1:8888";
//}
const expect = chai.expect;

const validData = {
  url: "https://app.wallabag.it",
  clientId: "490_4cp3yxxun6040k0ggo88kwwws8wcko008k8g884kk88gcs48wo",
  clientSecret: "3oy6qm18spkws0kksk44skokc8s0cwc0k008g0okkgosks4c4"
};
const validCredentials: IWCredentials = {
  userLogin: "rurik19",
  userPassword: "PSNuPR19"
};
const validUrlToSave = "https://habrahabr.ru/company/emercoin/blog/329276/";
const testTitle = 'test title';
const testTagList = 'tag1,tag2,tag3';

describe("WallabagApi module", () => {
    it("should provide Wallabag api", () => {
        expect(WallabagApi).to.not.be.undefined;
    });
});

describe("Wallabag Api Class", () => {
  let api = new WallabagApi();
  // it("Class creating without params", () => {
  //   expect(api).to.not.be.undefined;
  // });
  // it("isCredentialRequired()", () => {
  //   expect(api.isCredentialsRequired()).to.be.true;
  // });
  // it("set() and get()", () => {
  //   api.set(validData);
  //   expect(api.get().url).to.be.equal(validData.url);
  //   expect(api.get().clientId).to.be.equal(validData.clientId);
  //   expect(api.get().clientSecret).to.be.equal(validData.clientSecret);
  // });
  api = new WallabagApi(validData);
  // it("Class creating with params", () => {
  //   expect(api.get().url).to.be.equal(validData.url);
  // });
  // it("getApiVersion()", async () => {
  //   await api.getApiVersion();
  //   expect(api.get().version).to.have.length.above(4);
  // });
  // it("getApplicationToken()", async () => {
  //   await api.getApplicationToken(validCredentials);
  //   expect(api.get().applicationToken).to.be.a("string");
  //   expect(api.get().refreshToken).to.be.a("string");
  //   expect(api.get().expireDate).to.be.a("Date");
  //   expect(api.get().refreshExpireDate).to.be.a("Date");
  //   expect(api.get().expireDate.getTime()).to.be.above((new Date()).getTime());
  //   expect(api.get().refreshExpireDate.getTime()).to.be.above(api.get().expireDate.getTime());
  // });
  // it("refreshToken()", async () => {
  //   await api.refreshToken();
  //   expect(api.get().applicationToken).to.be.a("string");
  //   expect(api.get().refreshToken).to.be.a("string");
  //   expect(api.get().expireDate).to.be.a("Date");
  //   expect(api.get().refreshExpireDate).to.be.a("Date");
  //   expect(api.get().expireDate.getTime()).to.be.above((new Date()).getTime());
  //   expect(api.get().refreshExpireDate.getTime()).to.be.above(api.get().expireDate.getTime());
  // });
  // let id = 0;
  // it("saveArticle()", async () => {
  //   const article = await api.saveArticle(validUrlToSave);
  //   expect(article).to.be.a("Object");
  //   expect(article.id).to.be.above(0);
  //   id = article.id;
  // });
  // it("entryExists()", async () => {
  //   const exists = await api.entryExists(validUrlToSave);
  //   expect(exists.exists).to.be.a('boolean');
  //   expect(exists.exists).to.be.true;
  // });
  // it("getArticle()", async () => {
  //   const article = await api.getArticle(id);
  //   expect(article).to.be.a("Object");
  //   expect(article.id).to.be.equal(id);
  // });
  // it("saveStarred()", async () => {
  //   const article = await api.saveStarred(id, 1);
  //   expect(article.is_starred).to.be.equal(1);
  // });
  // it("saveArchived()", async () => {
  //   const article = await api.saveArchived(id, 1);
  //   expect(article.is_archived).to.be.equal(1);
  // });
  // it("saveTitle()", async () => {
  //   const article = await api.saveTitle(id, testTitle);
  //   expect(article.title).to.be.equal(testTitle);
  // });
  // it("saveTags()", async () => {
  //   const article = await api.saveTags(id, testTagList);
  //   expect(article.tags).to.be.a('Array');
  //   expect(article.tags).to.be.lengthOf(3);
  //   expect(article.tags.map((t) => t.label).join(',')).to.be.equal(testTagList);

  // });
  it("getArticles()", async () => {
    const articles = await api.getArticles(1, 2);
    // delete article.content;
     // tslint:disable-next-line:no-console
    console.log(articles);
    expect(articles).to.not.be.undefined;
  });
  // it("deleteArticle()", async () => {
  //   const article = await api.deleteArticle(id);
  //   const exists = await api.entryExists(validUrlToSave);
  //   expect(exists.exists).to.be.false;
  // });
});
