var express = require('express');
var router = express.Router();

var ObjectID = require('mongoskin').ObjectID;	
/* */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'UAB - On Tap', link: 'menu' });
});
router.get('/gettaps', function(req, res, next) { 
	req.db.collection('tapped').find().toArray(function (err, items) {
		res.json(items);
	});
});
router.post('/log/:id', function(req, res, next) { 
	var db = req.db;
	console.log(req.body)
	db.collection('tapped').update(
		{
			_id: new ObjectID(req.params.id)
		},
		{
			$inc: {
				ounces_drank : parseInt(req.body.ounces)
			},
			$push: {
				drinks: {
					user: req.body.user,
					ounces: req.body.ounces,
					date: Date.now()
				}
			}
		},
		function(err, doc){
			if ( doc == undefined || doc == "" ){
				res.json({msg:"Unable to find recipe",error:err})
			}else{
				res.json({msg:""})
			}
		}
	)
});

router.post('/empty/:ID', function(req, res) {
	
	/**/
	var db = req.db;
	db.collection('tapped').findOne(
		{
			_id: new ObjectID(req.params.ID)
		},
		function(err, doc){
				if ( doc == undefined || doc == "" ){
					res.json({msg:"failed"})
				}else{
					// Found the doc, add to fermenting, remove from brewing
					db.collection('tapped').remove(doc,function(err, doc2){
							doc.finished = Date.now()
							db.collection('finished').insert(doc,function(err, doc3){
								res.json({msg:""})
							});
						});
				}	

			
		}
	)
	/***/
});
module.exports = router;
