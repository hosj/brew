var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;	

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('yeast', { title: 'UAB - Yeast', link: 'menu' });
});
/* Show list of yeast*/
router.get('/get', function(req, res, next) {
   req.db.collection('yeast').find().toArray(function (err, items) {
        res.json(items);
    });
});
 /*
 * POST to addfermentable.
 */
router.post('/addyeast', function(req, res) {
    var db = req.db;
    db.collection('yeast').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
 /*
 * POST delete a yeast - no error checking, 
 */
router.post('/delete/:ID', function(req, res) {
    req.db.collection('yeast').remove({_id: new ObjectID(req.params.ID)}, function (err, items) {
		res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
	});
});
module.exports = router;
