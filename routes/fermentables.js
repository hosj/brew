var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;	

/* GET home page.*/
router.get('/', function(req, res, next) {
  res.render('fermentables', { title: 'UAB - Fermentables', link: 'menu' });
});
/* Show list of fermentables*/
router.get('/get', function(req, res, next) {
   req.db.collection('fermentable').find().toArray(function (err, items) {
        res.json(items);
    });
  
  
});
 /*
 * POST to addfermentable.
 */
router.post('/addfermentable', function(req, res) {
    var db = req.db;
    db.collection('fermentable').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

 /*
 * POST delete a fermentabloe - no error checking, 
 */
router.post('/delete/:ID', function(req, res) {
    req.db.collection('fermentable').remove({_id: new ObjectID(req.params.ID)}, function (err, items) {
		res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
	});
});
module.exports = router;
