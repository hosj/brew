var express = require('express');
var router = express.Router();

/* GET home page. Show list of recipes*/
router.get('/', function(req, res, next) {
  res.render('recipes', { title: 'UAB - Recipes', link: 'menu' });
});

module.exports = router;
