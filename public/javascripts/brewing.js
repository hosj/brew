setTimeout("brewing()",10);
function brewing() {
	populateTable();
	
    // open brew buttons link click
    $('#content').on('click', 'a.linkbrew', open_brew);
    	
};
function populateTable(){
	// Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/brewing/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
		var cols = 1;
		var row_opened = false;
        $.each(data, function(){
			if ( cols == 1 ){
				tableContent += '<div class="row">';
				row_opened = true;
			}
			tableContent += '<div class="large-6 columns"><a class="linkbrew" href="#" rel="' + this._id + '"><div class="panel">' + this.name + '</div></a></div>';
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
        
        $('#content').html(tableContent);
    });	
}

function open_brew(event){
	// Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var recipeID = $(this).attr('rel');
	
	// Redirect to the brew page
	window.location.href = "brewing/recipe/" + recipeID;
	
}

