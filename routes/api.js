const express = require('express');
const router = express.Router();
const Helper = require('../helpers/articleHelpers');

router.get('/', (req, res, next) => {
  Helper.getArticles().skip(parseInt(req.query.skip) || 0).
      limit(parseInt(req.query.take) || 100).
      then(result => {
        res.send(result);
      });
});

router.get('/image/test.jpg', (req, res, next) => {
  res.type('image/jpeg');
  // res.setHeader('Cache-Control', 'public, max-age=86400');

  Helper.processImage(
      'http://cdn2.ipn.ge/media/articles/2018/09-23/axalcixe_kachagoba.jpg').
      pipe(res);

});

module.exports = router;