var express = require('express');
var router = express.Router();

/* GET home page. Which is the taplist*/
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UAB - On Tap', link: 'menu' });
});


module.exports = router;
