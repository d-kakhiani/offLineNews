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


module.exports = router;