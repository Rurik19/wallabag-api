
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-datetime/index.d.ts" />

import * as chai from "chai";
import { WallabagApi, IWallabagData, IWallabagCredentials } from "../src/wallabag-api";
// import * from "chai-datetime";

const expect = chai.expect;

const validData = {
  url: "https://app.wallabag.it",
  clientId: "490_4cp3yxxun6040k0ggo88kwwws8wcko008k8g884kk88gcs48wo",
  clientSecret: "3oy6qm18spkws0kksk44skokc8s0cwc0k008g0okkgosks4c4"
};
const validCredentials: IWallabagCredentials = {
  userLogin: "rurik19",
  userPassword: "PSNuPR19"
};

describe("WallabagApi module", () => {
    it("should provide Wallabag api", () => {
        expect(WallabagApi).to.not.be.undefined;
    });
});

describe("Wallabag Api Class", () => {
  let api = new WallabagApi();
  it("Class creating without params", () => {
    expect(api).to.not.be.undefined;
  });
  it("isCredentialRequired()", () => {
    expect(api.isCredentialsRequired()).to.be.true;
  });
  it("set() and get()", () => {
    api.set(validData);
    expect(api.get().url).to.be.equal(validData.url);
    expect(api.get().clientId).to.be.equal(validData.clientId);
    expect(api.get().clientSecret).to.be.equal(validData.clientSecret);
  });
  api = new WallabagApi(validData);
  it("Class creating with params", () => {
    expect(api.get().url).to.be.equal(validData.url);
  });
  it("getApiVersion()", async () => {
    await api.getApiVersion();
    expect(api.get().version).to.have.length.above(4);
  });
  it("getApplicationToken()", async () => {
    await api.getApplicationToken(validCredentials);
    expect(api.get().applicationToken).to.be.a("string");
    expect(api.get().refreshToken).to.be.a("string");
    expect(api.get().expireDate).to.be.a("Date");
    expect(api.get().refreshExpireDate).to.be.a("Date");
    expect(api.get().expireDate.getTime()).to.be.above((new Date()).getTime());
    expect(api.get().refreshExpireDate.getTime()).to.be.above(api.get().expireDate.getTime());
  });
  it("refreshToken()", async () => {
    await api.refreshToken();
    expect(api.get().applicationToken).to.be.a("string");
    expect(api.get().refreshToken).to.be.a("string");
    expect(api.get().expireDate).to.be.a("Date");
    expect(api.get().refreshExpireDate).to.be.a("Date");
    expect(api.get().expireDate.getTime()).to.be.above((new Date()).getTime());
    expect(api.get().refreshExpireDate.getTime()).to.be.above(api.get().expireDate.getTime());
  });
});
