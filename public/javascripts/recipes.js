
function Recipes(){
	$('a#addFermentable').click(function() {
		var jQtable = $("#fermentables");
		var lastId = jQtable.find("tr:last td:first input").attr("id") + "";
		var newId = parseInt(lastId.replace("fermentable","")) + 3;
		if ( isNaN(newId) ) { newId = 1; }
		var row = $('<tr />');

		for (var i = 0; i <= 2; i++) {
			var thisId = newId + i;
			var cell = $('<td />');
			//var label = $('<label for="fermentable' + thisId + '">' + thisId + '</label>'); //put your text in your label to make it more accessible (and allows user to click the text to go to the input)
			var input = $('<input type="text" name="fermentable' + thisId + '" id="fermentable' + thisId + '" />');
			//cell.append(label, input);
			cell.append(input);
			row.append(cell);
		}

		row.append('<td><a href="#">del</a></td>');
		jQtable.append(row);
	});
	$('#fermentables').on('click', 'tr a', function (e) {
    e.preventDefault();
    $(this).parents('tr').remove();
});
}

setTimeout("Recipes()",111);