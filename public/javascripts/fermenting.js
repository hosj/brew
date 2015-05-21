setTimeout("fermenting()",10);
function fermenting() {
	populateTable();
	
    // move to secondary link click
    $('#content').on('click', 'a.secondary', move_secondary);
    // move to coldbreak link click
    $('#content').on('click', 'a.coldbreak', move_cold_break);
    // move to keg link click
    $('#content').on('click', 'a.keg', move_keg);
    // Tapped link click
    $('#content').on('click', 'a.tap', move_tap);
    // tap 1-4 link click
    $('a.tapnum').on('click', tap);
    	
};
function populateTable(){
	// Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/fermenting/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
		var cols = 1;
		var row_opened = false;
        $.each(data, function(){
			if ( cols == 1 ){
				tableContent += '<div class="row">';
				row_opened = true;
			}
			
			
			
			
			var button = '';
			var stage = '';
			var dt_start = ''
			var dt_end = ''
			var percentage = 0;
			
			// Current Step
			if (this.keg_start != ""  ){
				stage = 'In the Keg... Waiting to be tapped!';
				// percentage
				dt_start = this.keg_start;
				dt_start = moment(dt_start);
				dt_end = moment(dt_start).add(7,'days'); // wait 7 days after adding co2
				percentage = Math.round(((moment() - dt_start) / (dt_end - dt_start)) * 100);
				
			}else if (this.cold_break_days > 0 && this.cold_break_start != ""  ){
				stage = 'Cold Break';
				// percentage
				dt_start = this.cold_break_start;
				dt_start = moment(dt_start);
				dt_end = moment(dt_start).add(this.cold_break_days,'days');
				percentage = Math.round(((moment() - dt_start) / (dt_end - dt_start)) * 100);
				
			}else if (this.secondary_days > 0 && this.secondary_start != ""  ){
				stage = 'Secondary';
				// percentage
				dt_start = this.secondary_start;
				dt_start = moment(dt_start);
				dt_end = moment(dt_start).add(this.secondary_days,'days');
				percentage = Math.round(((moment() - dt_start) / (dt_end - dt_start)) * 100);
				
			}else if (this.primary_days > 0 && this.brewing_finished != ""  ){
				stage = 'Primary';
				// percentage
				dt_start = this.ferment_start == '' ? this.brewing_finished:this.ferment_start;
				dt_start = moment(dt_start);
				dt_end = moment(dt_start).add(this.primary_days,'days');
				percentage = Math.round(((moment() - dt_start) / (dt_end - dt_start)) * 100);
			}
			
			// Next step
			if (this.secondary_days > 0 && this.secondary_start == ""  ){
				button = '<a href="#" class="button tiny right radius secondary" rel="'+this._id+'">Secondary</a>';
				
			}else if (this.cold_break_days > 0 && this.cold_break_start == ""  ){
				button = '<a href="#" class="button tiny right radius coldbreak" rel="'+this._id+'">Cold Break</a>';
			
			}else if (this.keg_start == ""  ){			
				button = '<a href="#" class="button tiny right radius keg" rel="'+this._id+'">Keg</a>';
			}else{
				button = '<a href="#" class="button tiny right radius tap" rel="'+this._id+'">Tap</a>';
			}
			
			
			
			
			
			
			tableContent += '<div class="large-6 columns">';
			tableContent += '	<div class="panel radius">';
			tableContent += button;
			tableContent += '		<h3>' + this.name + '</h3>';
			tableContent += '		<div class="row">';
			tableContent += '			<div class="large-12 columns">';
			tableContent += '				<label><b>Stage:</b></label>';
			tableContent += stage;
			tableContent += '			</div>';
			tableContent += '		</div>';
			tableContent += '		<div class="progress round">';
			tableContent += '			<span class="meter" style="width:'+percentage+'%">'+percentage+'%</span>';
			tableContent += '		</div>';
			tableContent += '		<div class="row">';
			tableContent += '			<div class="large-6 columns">';
			tableContent += '				<label><b>Started:</b></label>';
			tableContent += '				'+ dt_start.calendar();
			tableContent += '			</div>';
			tableContent += '			<div class="large-6 columns text-right">';
			tableContent += '				<label><b>Finish:</b></label>';
			tableContent += '				'+ dt_end.calendar();
			tableContent += '			</div>';
			tableContent += '		</div>';
			tableContent += '	</div>';
			tableContent += '</div>';
			cols++
			if ( cols == 3 ) {
				cols = 1;
				tableContent += '</div>';
				row_opened = false;
			}
        });
		if ( row_opened ){
			tableContent += '</div>';
		}

        // Inject the whole content string into our existing HTML table
        
        $('#fermenting').html(tableContent);
    });	
}



function move_secondary(event){
	event.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/fermenting/secondary/' + $(this).attr('rel'),
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			populateTable();
		}else{alert(response.msg)}
		
	});
}
function move_cold_break(event){
	event.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/fermenting/coldbreak/' + $(this).attr('rel'),
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			
			populateTable();
		}else{alert(response.msg)}
		
	});
}
function move_keg(event){
	event.preventDefault();
	$.ajax({
		type: 'POST',
		url: '/fermenting/keg/' + $(this).attr('rel'),
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			populateTable();
		}else{alert(response.msg)}
		
	});
}
function move_tap(event){
	event.preventDefault();
	$('#recipeID').val($(this).attr('rel'))
	$('.tapnum').removeClass('disabled')
	$.getJSON( '/fermenting/getfulltaps/',function(response){
		$.each(response,function(){
			$('#tap'+this.tap).addClass('disabled')
		});
		
		$('#modalTap').foundation('reveal', 'open');
	});
}
function tap(event){
	event.preventDefault();
	if ( $(this).hasClass('disabled') ) {return;}
	$.ajax({
		type: 'POST',
		url: '/fermenting/tap/' + $('#recipeID').val() + '/' + $(this).text(),
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			window.location.replace("/");
		}else{alert(response.msg)}
		
	});
}





