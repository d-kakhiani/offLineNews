const express = require('express');
const mongoose = require('mongoose');
const Helper = require('./helpers/articleHelpers');
const createInitSource = Helper.createInitSource;
const getDataSource = Helper.getDataSource;

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/newApp', {useNewUrlParser: true});

app.use('/api', require('./routes/api'));

app.use((err, req, resp, next) => {
  resp.send({error: err.message});
});

app.listen(process.env.PORT || 4000, () => {
  console.log('Listening on port ' + (process.env.port || 4000));
});
// createInitSource();
getDataSource();