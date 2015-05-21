var express = require('express');
var router = express.Router();

/* GET home page. Show list of recipes*/
router.get('/', function(req, res, next) {
  res.render('newbrew', { title: 'UAB - New Brew - Pick a Recipe', link: 'menu' });
});
/* GET home page. Show list of hops*/
router.get('/get', function(req, res, next) {
   req.db.collection('recipe').find().toArray(function (err, items) {
        res.json(items);
    });
  
  
});

module.exports = router;
