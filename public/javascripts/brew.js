var taps = '';
$( document ).ready(function() {
	ss();
});
function ss(){
	
	$('.users').on('click', 'a',toggle_users);
	$('.ounces').on('click', 'a',toggle_ounces);
	$('.loglink').on('click',toggle_log);
	$('.emptylink').on('click',empty_keg);
	$('.loggit').on('click',log_drink);
	$('.loglink').hide(); 
	$('.emptylink').hide(); 
	$('#btnEmpty').on('click',post_empty_keg);
	$('#btnEmptyCancel').on('click',function(){$('#modalEmpty').foundation('reveal', 'close');});
	
	refresh_taps();
	
}
function empty_taps(){
	$('.loglink').hide();
	$('.emptylink').hide();
	
	for ( i=1; i<5; i++ ) {
		$('#tap' + i).find('h4').find('span').html('');
		$('.tap' + i).animate({width:0});
		$('.tap' + i).text('')
	}
	
}
function refresh_taps(){
	empty_taps();
	$.getJSON( '/drinks/gettaps', function( data ) {
        $.each(data, function(){
			taps = data;
			if ( this.tap != '' ){
				$('#tap' + this.tap).find('h4').find('span').html(this.name);
				var percentage = (this.ounces_drank / this.keg_amount) * 100;
				if (percentage > 100){percentage=100}
				$('.tap' + this.tap).animate({width:percentage + '%'});
				$('#tap' + this.tap).find('.loglink').show();
				$('#tap' + this.tap).find('.emptylink').show();
				$('#tap' + this.tap).find('.loglink').attr('rel',this._id);
				$('#tap' + this.tap).find('.emptylink').attr('rel',this._id);
				var left = Math.round((this.keg_amount - this.ounces_drank)/16);
				$('.tap' + this.tap).text(left + ' beers left')
			}
		});
	});	
	
}
function empty_keg(event){
	event.preventDefault();
	$('#recipeID').val($(this).attr('rel'));
	$('#modalEmpty').foundation('reveal', 'open');
	$('#emptyTap').html($(this).parent().find('h4').html());
}
function post_empty_keg(){
	$.ajax({
		type: 'POST',
		url: '/drinks/empty/' + $('#recipeID').val(),
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			$('#modalEmpty').foundation('reveal', 'close');
			refresh_taps();
		}else{alert(response.msg)}
		
	});
}
function toggle_log(){
	$('#recipeID').val($(this).attr('rel'));
	$('#modalLog').foundation('reveal', 'open');
	$('#logTap').html($(this).parent().find('h4').html());
}
function log_drink(){
	var user = '';
	var ounce = '';
	$('.user').each(function(){
		if ( $(this).hasClass('success') ){
			user = $(this).text();
		}
	});
	if ( user == '' ){
		alert('Choose a person');
		return;
	}
	$('.ounce').each(function(){
		if ( $(this).hasClass('success') ){
			ounce = $(this).text();
		}
	});
	if ( ounce == '' ){
		alert('Choose an ounce');
		return;
	}
	var drink = {
		user:user,
		ounces:ounce
	}
	
	// log drink
	$.ajax({
		type: 'POST',
		url: '/drinks/log/' + $('#recipeID').val(),
		data:drink,
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			
			refresh_taps();
		}else{alert(response.msg)}
		
	});
	
	
}

function toggle_users(event){
		
	event.preventDefault();
	if ($(this).hasClass('success')){
		$(this).removeClass('success')
		
	}else{
		$('.user').removeClass('success')
		$(this).addClass('success')
		
	}
}
function toggle_ounces(event){
	event.preventDefault();
	if ($(this).hasClass('success')){
		$(this).removeClass('success')
		
	}else{
		
		$('.ounce').removeClass('success')
		$(this).addClass('success')
		
	}
}