var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;	

/* GET home page. Show list of hops*/
router.get('/', function(req, res, next) {
  res.render('hops', { title: 'UAB - Hops', link: 'menu' });
});
/* GET home page. Show list of hops*/
router.get('/get', function(req, res, next) {
   req.db.collection('hop').find().toArray(function (err, items) {
        res.json(items);
    });
});
 
 
 
 
 /*
 * POST add a hop - no error checking, 
 */
router.post('/add', function(req, res) {
    var db = req.db;
    db.collection('hop').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});
 /*
 * POST delete a hop - no error checking, 
 */
router.post('/delete/:ID', function(req, res) {
    req.db.collection('hop').remove({_id: new ObjectID(req.params.ID)}, function (err, items) {
		res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
	});
});

 
 
module.exports = router;
