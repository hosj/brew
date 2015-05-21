var express = require('express');
var router = express.Router();

/* Menu Weeeeeeeeeeeee */
router.get('/', function(req, res, next) {
  res.render('menu', { title: 'UAB - Main Menu', link: '' });
});

module.exports = router;
