const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParamsSchema = new Schema({
  key: String,
  value: String,
});

const ArticleSourceSchema = new Schema({
  name: String,
  link: String,
  params: {
    type: [ParamsSchema],
  },
  timeout: Number,
  lastCheckout: Number,
  eachStep: {
    type: Number,
    default: 5,
  },
});

const ArticleSource = mongoose.model('articleSource', ArticleSourceSchema);

module.exports = ArticleSource;