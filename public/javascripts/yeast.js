setTimeout("yeast()",10);
function yeast() {
	
	 // Username link click
    $('#btnAddYeast').on('click', addYeast);
    $('#btnDeleteYeast').on('click', deleteYeast);
	$('#btnCancel').on('click', function(){$('#deleteYeast').foundation('reveal', 'close');});
	$('#yeast').on('click', 'a.linkdeleteyeast', deleteYeastPopup);
	populateTable();
	
    
	
	
};


function populateTable(){
	// Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/yeast/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.origin + '</a></td>';
            tableContent += '<td>' + this.lab + '</a></td>';
            tableContent += '<td>' + this.format + '</a></td>';
            tableContent += '<td>' + this.product + '</a></td>';
            tableContent += '<td>' + this.minTemp + '/' + this.maxTemp + '</a></td>';
            tableContent += '<td>' + this.attenuation + '</a></td>';
            tableContent += '<td>' + this.flocculation + '</a></td>';
            tableContent += '<td>' + this.description + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeleteyeast" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#yeast tbody').html(tableContent);
    });	
}


// Add Yeast
function addYeast(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addYeast input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newYeast = {
            'origin': $('#addYeast fieldset input#inputOrigin').val(),
            'lab': $('#addYeast fieldset input#inputLab').val(),
            'format': $('#addYeast fieldset select#inputType').val(),
            'product': $('#addYeast fieldset input#inputProduct').val(),
            'minTemp': $('#addYeast fieldset input#inputMinTemp').val(),
            'maxTemp': $('#addYeast fieldset input#inputMaxTemp').val(),
            'attenuation': $('#addYeast fieldset input#inputAttenuation').val(),
            'flocculation': $('#addYeast fieldset select#inputFlocculation').val(),
            'description': $('#addYeast fieldset textarea#inputDesc').val()
        }

        // Use AJAX to post the object to our addYeast  service
        $.ajax({
            type: 'POST',
            data: newYeast,
            url: '/yeast/addyeast',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addYeast fieldset input').val('');

                // Update the table
                populateTable();
				$('#addYeast').foundation('reveal', 'close');
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function deleteYeastPopup(event){
	event.preventDefault();
	$('#deleteYeastName').text($(this).attr('rel2'))
	$('#deleteYeastID').val($(this).attr('rel'))
	$('#deleteYeast').foundation('reveal', 'open');
}
function deleteYeast(event){
	event.preventDefault();
	$('#deleteYeast').foundation('reveal', 'close');
	$.post('/yeast/delete/'+$('#deleteYeastID').val(),function(data){
		if (data.msg == ''){
			populateTable();
		}else{
			alert('Error: ' + data.msg);
		}
	});
}