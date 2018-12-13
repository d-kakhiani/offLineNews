const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const Helper = require('./helpers/articleHelpers');
const createInitSource = Helper.createInitSource;
const getDataSource = Helper.getDataSource;
const app = express();
// const prpl = require('prpl-server');
// const polymerJSON = require('./polymer.json');
const compress = require('compression');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://dbuser:WeirdPlace1234.@ds129914.mlab.com:29914/newapp`, {useNewUrlParser: true});
app.use(helmet());
app.use(compress());
app.use('/api', require('./routes/api'));

app.use('/files/images', (req, res, next) => {

  res.setHeader('Cache-Control', 'public, max-age=86400');
  let url = req.query.url;
  if (url[0] === '/') {
    url = 'http:' + url;
  }
  res.contentType('image/jpeg');
  Helper.processImage(url).pipe(res);

});

// app.get('/*', prpl.makeHandler('.', polymerJSON));

app.use((err, req, resp, next) => {
  resp.send({error: err.message});
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port ' + (process.env.port || 4000));
});
// createInitSource();

// setInterval(() => {
//   console.log('Update data');
//   getDataSource();
// }, 60 * 2000);
