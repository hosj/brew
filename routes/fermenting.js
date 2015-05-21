var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;	
/* GET home page. Show list of recipes*/
router.get('/', function(req, res, next) {
  res.render('fermenting', { title: 'Fermenting', link: 'menu' });
});


/* GET fermenting*/
router.get('/get', function(req, res, next) {
	var db = req.db;
	db.collection('fermenting').find().toArray(function (err, items) {
		res.json(items);
	});
});


/* 
*	Show recipe in fermentor
*/
router.get('/show/:ID', function(req, res) {
	var db = req.db;
	db.collection('fermenting').find({_id: new ObjectID(req.params.ID)}).toArray(function (err, items) {
		if( err ) { throw err; } 
		if ( items.length > 0 ){
			res.send('Yay!')
		}else{
			res.send('nay!')
		}
		
	});
    
});

router.post('/secondary/:ID', function(req, res) {
	var db = req.db;
	db.collection('fermenting').update(
		{
			_id: new ObjectID(req.params.ID)
		},
		{
			$set: {
				secondary_start : Date.now()
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

router.post('/coldbreak/:ID', function(req, res) {
	var db = req.db;
	db.collection('fermenting').update(
		{
			_id: new ObjectID(req.params.ID)
		},
		{
			$set: {
				cold_break_start : Date.now()
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
router.post('/keg/:ID', function(req, res) {
	var db = req.db;
	db.collection('fermenting').update(
		{
			_id: new ObjectID(req.params.ID)
		},
		{
			$set: {
				keg_start : Date.now()
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
router.post('/keg/:ID', function(req, res) {
	var db = req.db;
	db.collection('fermenting').update(
		{
			_id: new ObjectID(req.params.ID)
		},
		{
			$set: {
				keg_start : Date.now()
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

router.get('/getfulltaps',function(req,res) {
	var db = req.db;
	db.collection('tapped').find({},{tap:1}).toArray(function (err, items) {
		if( err ) { throw err; }
		res.json(items)
	});
});

router.post('/tap/:ID/:tap', function(req, res) {
	
	/**/
	var db = req.db;
	db.collection('fermenting').findOne(
		{
			_id: new ObjectID(req.params.ID)
		},
		function(err, doc){
				if ( doc == undefined || doc == "" ){
					res.json({msg:"failed"})
				}else{
					// Found the doc, add to fermenting, remove from brewing
					db.collection('fermenting').remove(doc,function(err, doc2){
							doc.tap_start = Date.now()
							doc.tap = req.params.tap
							//delete doc._id 
							db.collection('tapped').insert(doc,function(err, doc3){
								res.json({msg:""})
							});
						});
				}	

			
		}
	)
	/***/
});










module.exports = router;
