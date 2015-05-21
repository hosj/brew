var express = require('express');
var router = express.Router();
var ObjectID = require('mongoskin').ObjectID;	
/* 
*	Show a list of beers brewing
*/
router.get('/', function(req, res, next) {
  res.render('brewing', { title: 'UAB - Currently Brewing', link: '/menu' });
});

/* Show list of brews brewing*/
router.get('/get', function(req, res, next) {
   req.db.collection('brewing').find().toArray(function (err, items) {
        res.json(items);
    });
});

/* 
*	get reipe
*/
router.get('/recipe/get/:ID', function(req, res, next) {
	
	req.db.collection('brewing').find({_id: new ObjectID(req.params.ID)}).toArray(function (err, items) {
		if ( items.length == 1 ){
			res.json(items[0]);
		}else{
			res.json({msg:""})
		}
	});
});
/* 
*	Shows the info a specific brewing recipe - AKA this is on a burner
*/
router.get('/recipe/:ID', function(req, res, next) {
	req.db.collection('brewing').find({_id: new ObjectID(req.params.ID)}).toArray(function (err, items) {
		if ( items.length == 1 ){
			var brew = items[0];
			/*
			
			// Get the start time of the brew
			var start_time = brew.start;
			
			// scan through fermentables and hops and add to gui
			var ingredients_future = '';
			var ingredients_in_pot = '';
			
			var steep_in_pot = '';		// in pot
			var steep_ready = ''; 		// ready to add to pot
			
			var boil_in_pot = '';		// in pot
			var boil_ready = '';		// ready to add to pot
			
			var secondary_in_pot = '';	// in pot
			var secondary_ready = '';	// ready to add to pot
			
			
			
			
			
			
			// merge all ingredients into one array
			var all_ingredients = brew.fermentables.concat(brew.hops);
			for ( i in all_ingredients.sort(dynamicSort('minutes')) ) {
				var f = all_ingredients[i];
				
				
				
				// Steeping
				if ( f.use == 'Steep' ) {
					if ( f.start == '' ) {
						//ingredients_future += '<tr><td>'+f.amount + f.unit+'</td><td>'+f.name+'</td><td>'+f.use+'</td><td>'+f.minutes+'</td><td><a href="#" class="button tiny">Add</a></td></tr>';
						steep_ready += '<div class="panel">';
						steep_ready += '<div class="right"><a href="#" class="button small ingredientadd">Add</a></div>';
						steep_ready += '<div>' + f.use + ' ' + f.minutes + ' mins</div>';
						steep_ready += f.amount + f.unit + ' ' + f.name;
						steep_ready += '</div>';
					// In pot already
					} else {
						steep_in_pot += '<div class="panel">';
						steep_in_pot += '<div class="right"><a href="#" class="button small ingredientremove">Remove</a></div>';
						steep_in_pot += '<div>' + f.use + ' ' + f.minutes + ' mins</div>';
						steep_in_pot += f.amount + f.unit + ' ' + f.name;
						steep_in_pot += '</div>';

					}
				
				// Boil in kettle
				}else if  ( f.use == 'Boil' ) {
					
				// Added to secondary
				}else if  ( secondary_uses.indexOf('|' + f.use + '|') == -1 ) {
				
				}
				
				
				ingredients_future = steep_ready + boil_ready + secondary_ready;
				ingredients_in_pot = steep_in_pot + boil_in_pot + secondary_in_pot;
				
				/*
				// Does not belong in kettle
				if ( secondary_uses.indexOf('|' + f.use + '|') == -1 ){
					// not in pot
					if ( f.start == '' ) {
						//ingredients_future += '<tr><td>'+f.amount + f.unit+'</td><td>'+f.name+'</td><td>'+f.use+'</td><td>'+f.minutes+'</td><td><a href="#" class="button tiny">Add</a></td></tr>';
						ingredients_future += '<div class="panel">';
						ingredients_future += '<div class="right"><a href="#" class="button small">Add</a></div>';
						ingredients_future += '<div>' + f.use + ' ' + f.minutes + ' mins</div>';
						ingredients_future += f.amount + f.unit + ' ' + f.name;
						ingredients_future += '</div>';
					// In pot already
					} else {
						ingredients_in_pot += '';

					}
				}else{
					
					
				}
				
				*/
			//}
			
			/*
			for ( i in all_ingredients.sort(dynamicSort('minutes')) ) {
				var f = all_ingredients[i];
				
				
				// Belongs in secondary 
				if ( secondary_uses.indexOf('|' + f.use + '|') > -1 ){
					// not in bucket
					if ( f.start == '' ) {
						//ingredients_future += '<tr><td>'+f.amount + f.unit+'</td><td>'+f.name+'</td><td>'+f.use+'</td><td>'+f.minutes+'</td><td><a href="#" class="button tiny">Add</a></td></tr>';
						ingredients_future += '<div class="panel">';
						ingredients_future += '<div class="right"><a href="#" class="button small">Add</a></div>';
						ingredients_future += '<div>' + f.use + ' ' + (f.minutes/60/24) + ' days</div>';
						ingredients_future += f.amount + f.unit + ' ' + f.name;
						ingredients_future += '</div>';
						
					// In bucket already
					} else {
						ingredients_in_pot += '';

					}
				}
			}*/
			
			//res.render('brewingsteps', { title: 'UAB - ' + brew.name, link: '/menu', future: ingredients_future, pot: ingredients_in_pot });	
			res.render('brewingsteps', { title: 'UAB - ' + brew.name, link: '/menu', _id: brew._id});	
			
			
		
			
		}else{
			// Could not find your beer
			var err = new Error('Not Found');
			err.status = 404;
			next(err);
		}
	});
  
});


/* 
*	Starts a recipe
*/
router.post('/start/:ID', function(req, res) {
	var db = req.db;
	db.collection('recipe').find({_id: new ObjectID(req.params.ID)}).toArray(function (err, items) {
		if( err ) { throw err; } 
		if ( items.length > 0 ){
			result = items[0];
		}else{
			result = []
		}
		/* 
		 *	Add brew specific fields to fermentables
		 */
		 console.log(req.params.ID)
		 console.log(result)
		for ( i in result.fermentables ){
			console.log(i)
			result.fermentables[i].start = '';
			
			// If this is a steep thing it needs to be removed so log when it was removed
			if ( result.fermentables[i].use == 'Steep' ) {
				result.fermentables[i].end = '';
			}
			
		}
		/* 
		 *	Add brew specific fields to the hops
		 */
		for ( i in result.fermentables ){
			console.log(i)
			result.fermentables[i].start = '';			
		}
		
		
		/* 
		 *	Add brew specific fields to the recipe
		 */
		result.start				= Date.now();		// WHen did the brew start
		result.ferment_start		= '';		// WHen did the brew go into the fermentor
		result.secondary_start		= '';		// WHen did the brew go into the secondary
		result.cold_break_start		= '';		// WHen did the brew go into the cold break
		result.keg_start			= '';		// WHen did the brew go into the keg
		result.tap_start			= '';		// WHen did the brew get tapped
		result.fermentor_amount		= 0;		// gallons of wort to turn into beer
		result.secondary_amount		= 0;		// gallons of beer to finish
		result.keg_amount			= 624;		// gallons of beer to drink, default is 52, 12 ounce beers
		result.ounces_drank			= 0;		// ounces of beer drank
		result.drinks				= [];		// Record of each drink poured - {"ounces":16,"date":datetimestamp}
		
		delete result._id
		// Insert into database
		db.collection('brewing').insert(result, function(err, result){
			res.send(
				(err === null) ? { msg: '',id: result[0]._id } : { msg: err }
			);
		});
	});
    
});



/* 
*	add an ingredient to a pot
*/
router.post('/addtopot/', function(req, res) {
	var db = req.db;
	db.collection('brewing').update(
		{
			_id: new ObjectID(req.body._id),
			"fermentables._id":req.body.ingredient
		},
		{
			$set: {
				"fermentables.$.start" : Date.now()
			}
		},
		function(err, doc){
			if ( doc == undefined || doc == "" ){
				// Must be a hop
				db.collection('brewing').update(
					{
						_id: new ObjectID(req.body._id),
						"hops._id":req.body.ingredient
					},
					{
						$set: {
							"hops.$.start" : Date.now()
						}
					},
					function(err, doc){
						if ( doc == undefined || doc == "" ){
							res.json({msg:"Unable to find recipe/ingredient"})
						}else{
							res.json({msg:""})
						}
					}
				)
			}else{
				res.json({msg:""})
			}
		}
	)
});


/* 
*	remove an ingredient from a pot
*/
router.post('/removefrompot/', function(req, res) {
	var db = req.db;
	db.collection('brewing').update(
		{
			_id: new ObjectID(req.body._id),
			"fermentables._id":req.body.ingredient
		},
		{
			$set: {
				"fermentables.$.end" : Date.now()
			}
		},
		function(err, doc){
			if ( doc == undefined || doc == "" ){
				// Must be a hop
				db.collection('brewing').update(
					{
						_id: new ObjectID(req.body._id),
						"hops._id":req.body.ingredient
					},
					{
						$set: {
							"hops.$.end" : Date.now()
						}
					},
					function(err, doc){
						if ( doc == undefined || doc == "" ){
							res.json({msg:"Unable to find recipe/ingredient"})
						}else{
							res.json({msg:""})
						}
					}
				)
			}else{
				res.json({msg:""})
			}
		}
	)
});



/* 
*	cancel ingredient from a pot
*/
router.post('/cancelpot/', function(req, res) {
	var db = req.db;
	db.collection('brewing').update(
		{
			_id: new ObjectID(req.body._id),
			"fermentables._id":req.body.ingredient
		},
		{
			$set: {
				"fermentables.$.start" : ""
			}
		},
		function(err, doc){
			if ( doc == undefined || doc == "" ){
				// Must be a hop
				db.collection('brewing').update(
					{
						_id: new ObjectID(req.body._id),
						"hops._id":req.body.ingredient
					},
					{
						$set: {
							"hops.$.start" : ""
						}
					},
					function(err, doc){
						if ( doc == undefined || doc == "" ){
							res.json({msg:"Unable to find recipe/ingredient"})
						}else{
							res.json({msg:""})
						}
					}
				)
			}else{
				res.json({msg:""})
			}
		}
	)
});




/* 
*	finish brewing a recipe. i.e. moved to fermentor
*/
router.post('/finish/', function(req, res) {
	
	/**/
	var db = req.db;
	db.collection('brewing').findOne(
		{
			_id: new ObjectID(req.body._id)
		},
		function(err, doc){
				if ( doc == undefined || doc == "" ){
					res.json({msg:"failed"})
				}else{
					// Found the doc, add to fermenting, remove from brewing
					db.collection('brewing').remove(doc,function(err, doc2){
							doc.brewing_finished = Date.now()
							//delete doc._id
							db.collection('fermenting').insert(doc,function(err, doc3){
								res.json({msg:err})
							});
						});
				}	

			
		}
	)
	/***/
});
module.exports = router;
