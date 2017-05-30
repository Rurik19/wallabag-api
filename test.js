// if ( !process.env.http_proxy ) process.env["http_proxy"] = "http://127.0.0.1:8081";
let wapi = require('./lib/wallabag-api').WallabagApi;
let api = new wapi({url: 'https://app.wallabag.it'});
console.log(JSON.stringify(api.get()));
api.getApiVersion()
    .then(() => { console.log(JSON.stringify(api.get())); } );
