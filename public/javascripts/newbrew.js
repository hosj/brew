setTimeout("newBrew()",10);
function newBrew() {
	
	populateTable();
	
    
    // Brew Me buttons link click
    $('#content').on('click', 'a.linkstartbrew', start_brew);
	
	
};


function populateTable(){
	// Empty content string
    var rows = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/newbrew/get', function( data ) {
        // For each item in our JSON, add a table row and cells to the content string
		var cols = 1;
        $.each(data, function(){
			if ( cols == 4 ){
				// Close out old row and start a new one
				rows += "</div><div class='row'>";
				cols = 1;
			}
			rows += "<div class=\"large-3 columns\">";
			rows += "<ul class=\"pricing-table\">";
			rows += "<li class=\"title\">" + this.type + "</li>";
			rows += "<li class=\"price\">" + this.name + "</li>";
			rows += "<li class=\"description\">" + this.description + "</</li>";
			rows += "<li class=\"bullet-item\">" + this.ibu + " IBU - " + this.abv + "% ABV</li>";
			rows += "<li class=\"cta-button\">";
			rows += "<a href=\"#\" class=\"button linkstartbrew\" rel=\"" + this._id + "\">Brew This</a>";
			rows += "</li>";
			rows += "</ul>";
			rows += "</div>";
			cols++;
        });

        // Inject the whole content string into our existing HTML table
        $('#content').html(rows);
		
		
    });	
}


function start_brew(event){

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var recipeID = $(this).attr('rel');

	$.ajax({
		type: 'POST',
		url: '/brewing/start/' + recipeID,
		dataType: 'JSON'
	}).done(function( response ) {
		if ( response.msg == '' ){
			window.location.replace("brewing/recipe/" + response.id);
		}
		
	});
};