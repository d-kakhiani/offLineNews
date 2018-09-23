const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title field is required'],
  },
  remoteId: {
    type: Number,
    required: [true, 'RemoteId field is required'],
  },
  introText: {
    type: String,
    required: [true, 'IntroText field is required'],
  },
  fullText: {
    type: String,
    required: [true, 'FullText field is required'],
  },
  image: {
    type: String,
    required: [true, 'Image field is required'],
  },
  thumb: {
    type: String,
    required: [true, 'Thumb field is required'],
  },
  publish_up: {
    type: Date,
    required: [true, 'Publish_up field is required'],
  },
  category: [String],
  source: {
    type: String,
    required: [true, 'Source field is required'],
  },
});

const Article = mongoose.model('article', ArticleSchema);

module.exports = Article;