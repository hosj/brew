
var secondary_uses = '|Dry Hop|';
var boil_minutes = 0;
var steep_minutes = 0;
var ingredients_to_track = [];
var ingredients_to_track_timer = "";

// Used for the top progress bars
var total_boil_time = 0;
var total_boil_time_elapsed = 0;
var total_steep_time = 0;
var total_steep_time_elapsed = 0;
setTimeout("brewing()",10);
function brewing() {
	$('#finishbrewing').hide();
	populateTable();
	
    // add item link click
    $('#needsAdded').on('click', 'a.ingredientadd', add_ingredient);
    
	// remove item link click
    $('#inPot').on('click', 'a.ingredientremove', remove_ingredient);
	
	// finished brewing link click
    $('#finishbrewing').on('click', show_finish);
	
	// finished brewing yes link click
    $('#finish-yes').on('click', finish_brewing);
	
	// finished brewing no link click
    $('#finish-no').on('click', finish_cancel);
    	
};
function populateTable(){
	// Empty content string
    var tableContent = '';
	
	// stop the ingredients to track timer
	clearTimeout(ingredients_to_track_timer);
	
	// Empty ingredients to track array
	ingredients_to_track = [];
	
	
    // jQuery AJAX call for JSON
    $.getJSON( '/brewing/recipe/get/' + $('#recipe_id').val(), function( brew ) {
        // Get the start time of the brew
		var start_time = brew.start;
		
		// Boil time
		boil_minutes = brew.boil_minutes;
		$('#brewmeterboiltext').html('Boil&nbsp;' + boil_minutes + '&nbsp;mins&nbsp;-&nbsp;' + '&nbsp;remaining')
		
		// Steep time
		steep_minutes = brew.steep_minutes;
		$('#brewmetersteeptext').html('Steep&nbsp;' + steep_minutes + '&nbsp;mins&nbsp;-&nbsp;' + '&nbsp;remaining')
		
		
		
		
		
		// scan through fermentables and hops and add to gui
		var ingredients_future = '';
		var ingredients_in_pot = '';
		
		var steep_in_pot = '';		// in pot
		var steep_ready = ''; 		// ready to add to pot
		
		var boil_in_pot = '';		// in pot
		var boil_ready = '';		// ready to add to pot
		
		var secondary_in_pot = '';	// in pot
		var secondary_ready = '';	// ready to add to pot
		
		var max_steep = 0;
		var max_boil = 0;
		
		
		
		
		// merge all ingredients into one array
		var all_ingredients = brew.fermentables.concat(brew.hops);
		
		// Loop through to add our elements
		for ( i in all_ingredients.sort(dynamicSort('minutes')) ) {
			var f = all_ingredients[i];
	
			// Steeping
			if ( f.use == 'Steep' ) {
				// used for progress bar
				total_steep_time += f.minutes;
				
				// ready to add to pot
				if ( f.start == '' ) {
					steep_ready += build_ingredient(f,false);
				// In pot already
				} else {
					steep_in_pot += build_ingredient(f,true);
				}
			
			// Boil in kettle
			}else if  ( f.use == 'Boil' ) {
				// used for progress bar
				total_boil_time += f.minutes;
				// ready to add to pot
				if ( f.start == '' ) {
					boil_ready += build_ingredient(f,false);
				// In pot already
				} else {
					boil_in_pot += build_ingredient(f,true);
				}
			}
			// We ignore things that go in the fermentor or secondary
			
		}	
		$('#needsAdded').html(steep_ready + boil_ready + secondary_ready);
		$('#inPot').html(steep_in_pot + boil_in_pot + secondary_in_pot);
		
		
		
		// build a progress bar with segments for different times
		
		
		
		// Look for steep with longest time
		
		// add to boil time and we have our totalish
		
		//Start updating timers
		ingredients_to_track_timer = setTimeout("timers()",1000);
		// update boil progress bar
		
		
    });
}

function build_ingredient(ingredient,inpot){
	var time = '';
	if ( ingredient.minutes > 1300 ){
		time = (ingredient.minutes/60/24) + ' days';
	}else if ( ingredient.minutes > 60 ){
		time = (ingredient.minutes/60) + ' hours';
	}else{
		time = ingredient.minutes + ' mins';
	}
	var temp = '';
	if (inpot){
		
		// is this a steep ingredient?
		if ( ingredient.end != undefined ){
			//total_steep_time_elapsed += ingredient.minutes;
			if ( ingredient.end == '' ){
				// add to timers
				ingredients_to_track.push({
					"id":'progress_' + ingredient._id,
					"tid":'text_' + ingredient._id,
					"start":ingredient.start,
					"minutes":ingredient.minutes,
					"use":ingredient.use//boil steep dry hop secondary etc
				})
				temp = '<div class="panel callout radius ingredient">';
				temp += '<div class="row">';
				temp += '<a href="#" rel="' + ingredient._id + '" class="right button small ingredientremove">Remove</a>';
				temp += '<div id="timer_' + ingredient._id + '">' + ingredient.use + ' ' + time + '</div>';
				temp += '<div>' + ingredient.amount + ingredient.unit + ' ' + ingredient.name + '</div>';
				temp += '</div>';
				temp += '<div class="progress round"><div class="progress-timer" id="text_' + ingredient._id + '"></div><span id="progress_' + ingredient._id + '" class="meter" style="width:0"></span></div>';
				
				temp += '</div>';
			}else{
				// Ingredient has been removed from the pot 
				total_steep_time_elapsed += ingredient.minutes;
				
				/*
				temp = '<div class="panel callout radius strikethrough ingredient">';
				temp += '<div>' + ingredient.use + ' ' + time + '</div>';
				temp += '<div>' + ingredient.amount + ingredient.unit + ' ' + ingredient.name + '</div>';
				temp += '</div>';
				/**/
			}
			
		// Boil
		}else{
			//total_boil_time_elapsed += ingredient.minutes;
			// add to timers
			ingredients_to_track.push({
				"id":'progress_' + ingredient._id,
				"tid":'text_' + ingredient._id,
				"start":ingredient.start,
				"minutes":ingredient.minutes,
				"use":ingredient.use//boil steep dry hop secondary etc
			})

			temp = '<div class="panel callout radius ingredient">';
			temp += '	<div id="timer_' + ingredient._id + '">' + ingredient.use + ' ' + time + '</div>';
			temp += '	<div>' + ingredient.amount + ingredient.unit + ' ' + ingredient.name + '</div>';
			temp += '	<div class="progress round">';
			temp += '		<div class="progress-timer" id="text_' + ingredient._id + '"></div>';
			temp += '		<span id="progress_' + ingredient._id + '" class="meter" style="width:0"></span>';
			temp += '	</div>';
			temp += '</div>';
		}
	}else{
		temp = '<div class="panel callout radius ingredient">';
		temp += '<a href="#" rel="' + ingredient._id + '" class="button small ingredientadd right">Add</a>';
		temp += '<div>' + ingredient.use + ' ' + time + '</div>';
		temp += '<div>' + ingredient.amount + ingredient.unit + ' ' + ingredient.name + '</div>';
		temp += '</div>';
	}
	
	return temp;
}

function add_ingredient(event){
	// Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
	var ingredientID = $(this).attr('rel');
	
	// 
	$.ajax({
            type: 'POST',
            data: {
				_id : $('#recipe_id').val(),
				ingredient: $(this).attr('rel')
			},
            url: '/brewing/addtopot',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Update the table
                populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
	
	
}
function remove_ingredient(event){
	// Prevent Link from Firing
    event.preventDefault();
    // Retrieve username from link rel attribute
	var ingredientID = $(this).attr('rel');
	// 
	$.ajax({
            type: 'POST',
            data: {
				_id : $('#recipe_id').val(),
				ingredient: $(this).attr('rel')
			},
            url: '/brewing/removefrompot',
            dataType: 'JSON'
        }).done(function( response ) {
            // Check for successful (blank) response
            if (response.msg === '') {
                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
}

function cancel_ingredient(event){
	// Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
	var ingredientID = $(this).attr('rel');
	$.ajax({
		type: 'POST',
		data: {
			_id : $('#recipe_id').val(),
			ingredient: $(this).attr('rel')
		},
		url: '/brewing/cancelpot',
		dataType: 'JSON'
	}).done(function( response ) {
		// Check for successful (blank) response
		if (response.msg === '') {
			// Update the table
			populateTable();
		}
		else {
			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);
		}
	});
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (b,a) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}








var first_update = true;
var second_update = true;
var last_boil_percentage = 0;
var last_steep_percentage = 0;
function timers(){
	var this_steep = 0;
	var this_boil = 0;
	// Loop through tracked ingredients and update progress
	for ( i = 0; i < ingredients_to_track.length; i++ ){
		var ing = ingredients_to_track[i];
		var today = new Date();
		var diffMs = (today-ing.start); // milliseconds between now & ingredient start
		var diffSecs = 60 - Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds
		if ( diffSecs < 10 ){
			diffSecs = '0' + diffSecs;
		}		
		var diffMins = Math.round(diffMs / 60000); 
		if (diffMins > ing.minutes)
		{
			diffMins=0;
			if ( ing.use == 'Boil'){
				total_boil_time_elapsed += ing.minutes;
			}else if ( ing.use == 'Steep'){
				total_steep_time_elapsed += ing.minutes;
			}
			
			// Remove timer since we are done
			ingredients_to_track.splice(i, 1);
			i--;
			
			// Change color to done
			$('#' + ing.id).parent().addClass('success');
			
			// Text to Done
			$('#' + ing.tid).html('Done')
			
			// final size
			$('#' + ing.id).animate({width:'100%'});
		}else{
			var percentage = diffMins == 0 ? '0':Math.ceil((diffMins / ing.minutes) * 100) + '%'
			//$('#' + ing.id).html((ing.minutes - diffMins) + ':' + diffSecs  + ' remaining')
			var start = moment(ing.start);
			var end = moment(ing.start).add(ing.minutes,'minutes');
			var remaining = end.diff(moment()),
			min = (remaining/1000/60) << 0,
			sec = Math.round((remaining/1000) % 60);;
			if ( sec < 10 ){
				sec = '0' + sec;
			}
			$('#' + ing.tid).html(min + ':' + sec)
			$('#' + ing.id).animate({width:percentage});
			
		}
		
		
		// increment elapsed
		if ( ing.use == 'Steep' ){
			this_steep += diffMins;
		}else if ( ing.use == 'Boil' ){
			this_boil += diffMins;
		}
		
	}
	if (first_update){
		first_update = false;
	}else{
		// update boil progress bar
		percentage = Math.round(((total_boil_time_elapsed + this_boil) / total_boil_time) * 100) + '%';
		percentage = Math.round(((this_boil) / total_boil_time) * 100) + '%';
		if ( last_boil_percentage != percentage ){
			last_boil_percentage = percentage;
			$('#brewmeterboil').animate({width:percentage});
			$('#brewmeterboiltext').html(progress_text('Boil',boil_minutes,percentage) ); 
		}
		
		// update steep progress bar
		percentage = Math.round(((total_steep_time_elapsed + this_steep) / total_steep_time) * 100) + '%';
		percentage = Math.ceil((this_steep / total_steep_time) * 100) + '%';
		//alert('Total Steep Elapsed: ' + total_steep_time_elapsed + '\nthis_steep: ' + this_steep + '\ntotal_steep_time: ' + total_steep_time)
		if ( last_steep_percentage != percentage ){
			last_steep_percentage = percentage;
			$('#brewmetersteep').animate({width:percentage});
			$('#brewmetersteeptext').html(progress_text('Steep',steep_minutes,percentage) ); 
		}
	}
	
	
	// If there are any ingredents in the pot track them
	if ( ingredients_to_track.length > 0 ){
		ingredients_to_track_timer = setTimeout("timers()",1000);
	// Bug fix, 
	}else if ( !first_update && second_update ){
		second_update = false;
		ingredients_to_track_timer = setTimeout("timers()",1000);
	
	// Are there any ingredients left?
	}else{
		// none left we must be at the end of the brew
		if ( $('#needsAdded').html() == '' ) {
			show_finish();
			$('#finishbrewing').show();
		}
	}
	
}

function time_remaining(starttime,minutes){
	var temp = {};
	var end = moment(starttime).add(minutes,'minutes');
	var remaining = end.diff(moment())
	temp.min = (remaining/1000/60) << 0;
	temp.sec = Math.round((remaining/1000) % 60);
	if ( sec < 10 ){
		sec = '0' + sec;
	}
	return temp;
}

function progress_text(title,total,elapsed){
	//return title + '&nbsp;' + total + '&nbsp;-&nbsp;' + elapsed + '&nbsp;elapsed&nbsp;-&nbsp;' + remaining + '&nbsp;remaining';
	return title + '&nbsp;' + total + '&nbsp;minutes&nbsp;-&nbsp;' + elapsed;
	
}

function show_finish(){
	$('#modalFinishBrew').foundation('reveal', 'open');
} 
function finish_cancel(){
	$('#modalFinishBrew').foundation('reveal', 'close');
}

function finish_brewing(){
	$.ajax({
		type: 'POST',
		data: {
			_id : $('#recipe_id').val()
		},
		url: '/brewing/finish',
		dataType: 'JSON'
	}).done(function( response ) {
		// Check for successful (blank) response
		if (response.msg === null) {
			// redirect to fermenting
			window.location.replace('/fermenting/show/' + $('#recipe_id').val())
		}
		else {
			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);
		}
	});
}


