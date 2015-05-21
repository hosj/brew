setTimeout("fermentables()",10);
function fermentables() {
	
	 // Username link click
    $('#btnAddFermentable').on('click', addFermentable);
	$('#btnDeleteFermentable').on('click', deleteFermentable);
	$('#btnCancel').on('click', function(){$('#deleteFermentable').foundation('reveal', 'close');});
	$('#fermentables').on('click', 'a.linkdeletefermentable', deleteFermentablePopup);
	
	
	populateTable();
	
    
	
	
};


function populateTable(){
	// Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/fermentables/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td>' + this.maltster + '</a></td>';
            tableContent += '<td>' + this.name + '</a></td>';
            tableContent += '<td>' + this.ppg + '</a></td>';
            tableContent += '<td>' + this.color + '</a></td>';
            tableContent += '<td>' + this.description + '</a></td>';
            tableContent += '<td><a href="#" class="linkdeletefermentable" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#fermentables tbody').html(tableContent);
    });	
}


// Add Fermentable
function addFermentable(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addFermentable input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newFermentable = {
            'maltster': $('#addFermentable fieldset input#inputMaltster').val(),
            'name': $('#addFermentable fieldset input#inputName').val(),
            'ppg': $('#addFermentable fieldset input#inputPPG').val(),
            'color': $('#addFermentable fieldset input#inputColor').val(),
            'description': $('#addFermentable fieldset textarea#inputDesc').val()
        }

        // Use AJAX to post the object to our addFermentable  service
        $.ajax({
            type: 'POST',
            data: newFermentable,
            url: '/fermentables/addfermentable',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addFermentable fieldset input').val('');

                // Update the table
                populateTable();

				$('#addFermentable').foundation('reveal', 'close');
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
function deleteFermentablePopup(event){
	event.preventDefault();
	$('#deleteFermentableName').text($(this).attr('rel2'))
	$('#deleteFermentableID').val($(this).attr('rel'))
	$('#deleteFermentable').foundation('reveal', 'open');
}
function deleteFermentable(event){
	event.preventDefault();
	$('#deleteFermentable').foundation('reveal', 'close');
	$.post('/fermentables/delete/'+$('#deleteFermentableID').val(),function(data){
		if (data.msg == ''){
			populateTable();
		}else{
			alert('Error: ' + data.msg);
		}
	});
}
