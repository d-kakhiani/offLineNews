const articleSource = require('../models/articleSource');
const Article = require('../models/article');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const dataSource = {
  ambebi: new articleSource({
    name: 'www.ambebi.ge',
    link: 'https://www.ambebi.ge/api/article/{id}-temp/?' +
        'token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhdXRoMCJ9.' +
        'urUECF7BxkKHIW-WsEbSkEwyn8I_pHkTPhPzfsjeXuo',
    params: [
      {key: 'title', value: 'title'},
      {key: 'remoteId', value: 'id'},
      {key: 'introText', value: 'introtext'},
      {key: 'fullText', value: 'fulltext'},
      {key: 'image', value: 'original_image'},
      {key: 'thumb', value: 'image'},
      {key: 'publish_up', value: 'publish_up'},
      {key: 'category', value: 'category'},
    ],
    lastCheckout: 227740,
  }),
  ipn: new articleSource({
    name: 'www.interpressnews.ge',
    link: 'http://www.interpressnews.ge/api/article/{id}/',
    params: [
      {key: 'title', value: 'title'},
      {key: 'remoteId', value: 'id'},
      {key: 'introText', value: 'introtext'},
      {key: 'fullText', value: 'fulltext'},
      {key: 'image', value: 'image'},
      {key: 'thumb', value: 'images.88x60'},
      {key: 'publish_up', value: 'publish_up'},
      {key: 'category', value: 'categories'},
    ],
    timeout: 10,
    lastCheckout: 513345,
  }),
};
let createInitSource = () => {
  mongoose.connection.collections.articlesources.drop(() => {
    let ambebi = dataSource.ambebi;
    let ipn = dataSource.ipn;
    ambebi.save().then((ambebiObject) => {
      if (ambebi.isNew) {
        console.error('Something went wrong during init', ambebi);
      }
    });
    ipn.save().then((ipnObject) => {
      if (ipn.isNew) {
        console.error('Something went wrong during init', ipn);
      }
    });
  });

};

let getDataSource = () => {
  return articleSource.find({});
};

let updateArticles = () => {
  getDataSource().then(results => {
    let promiseArr = [];
    for (let source of results) {
      for (let i = source.lastCheckout;
           i < source.lastCheckout +
           source.eachStep; i++) {
        let url = source.link.replace('{id}', i.toString());

        promiseArr.push(
            parseUrl(url).then(data => {
              let obj = {
                'source': source.name,
              };
              for (let param  of source.params) {
                // TODO need param Type Check (DateTime)
                let tmpData = data;
                for (let split of param.value.split('.')) {
                  if (!tmpData) continue;
                  tmpData = tmpData[split];
                }
                if (param.value.split('.').length > 1) {
                  obj[param.key] = data[param.value.split(
                      '.')[0]][param.value.split('.')[1]];
                } else
                  obj[param.key] = data[param.value];
              }
              return new Article(obj);
            }).catch(error => {
              return null;
            }),
        );
      }
    }
    return Promise.all(promiseArr, (results));

  }).then(arr => {
    arr = arr.filter(item => item);
    Article.collection.insertMany(arr, (err, docs) => {
      if (err) {
        return console.error(err);
      } else {
        articleSource.updateMany({}, {$inc: {lastCheckout: 5}});
      }
    });
  });
};

let parseUrl = (url,timeout) => {
  return fetch(url).then(data => data.json());
};

const Helper = {
  createInitSource: createInitSource,
  getDataSource: updateArticles,
};
module.exports = Helper;