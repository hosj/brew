setTimeout("hops()",10);
function hops() {
	// Add hop button
	$('#btnAddHop').on('click', addHop);
	$('#btnDeleteHop').on('click', deleteHop);
	$('#btnCancel').on('click', function(){$('#deleteHop').foundation('reveal', 'close');});
	$('#hops').on('click', 'a.linkdeletehop', deleteHopPopup);
	
	// Get hops from db
	populateHops();
    
};
function populateHops(){
	// Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/hops/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
			country = this.country || '';
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</a></td>';
            tableContent += '<td>' + country + '</td>';
            tableContent += '<td>' + this.alpha + '</td>';
            tableContent += '<td>' + this.notes + '</td>';
            tableContent += '<td><a href="#" class="linkdeletehop" rel="' + this._id + '" rel2="' + this.name + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#hops tbody').html(tableContent);
    });	
}

function addHop(event){
	event.preventDefault();
	var hop = {
		'name':$('#inputName').val(),
		'alpha':$('#inputAlpha').val(),
		'country':$('#inputCountry').val(),
		'notes':$('#inputNotes').val()
	};
	$.post('/hops/add',hop,function(data){
		if (data.msg == ''){
			populateHops();
			$('#addHop').foundation('reveal', 'close');
		}else{
			alert('Error: ' + data.msg);
		}
	});
}
function deleteHopPopup(event){
	event.preventDefault();
	$('#deleteHopName').text($(this).attr('rel2'))
	$('#deleteHopID').val($(this).attr('rel'))
	$('#deleteHop').foundation('reveal', 'open');
}
function deleteHop(event){
	event.preventDefault();
	$('#deleteHop').foundation('reveal', 'close');
	$.post('/hops/delete/'+$('#deleteHopID').val(),function(data){
		if (data.msg == ''){
			populateHops();
		}else{
			alert('Error: ' + data.msg);
		}
	});
}
