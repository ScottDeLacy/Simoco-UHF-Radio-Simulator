// Layout template
$(document).ready(function () {
			
			
    $('#about').on('click', function () {
        $('#popup').fadeIn('fast');							
        $('#popup').html("<div id='hidepopup'>--- Close ---</div><p>about text here");
        $('#hidepopup').on('click', function () { $('#popup').fadeOut('fast') });
											 });
											 
			
    $('#faq').on('click', function () {
        $('#popup').fadeIn('fast');
        $('#popup').html("<div id='hidepopup'>--- Close ---</div><p>FAQ text here");
        $('#hidepopup').on('click', function () { $('#popup').fadeOut('fast') });
											 });
											 
			  
    $('#links').on('click', function () {
        $('#popup').fadeIn('fast');
        $('#popup').html("<div id='hidepopup'>--- Close ---</div><p>Links to manuals and reference materials here");
        $('#hidepopup').on('click', function () { $('#popup').fadeOut('fast') });
											 });
			  
    
			  
							});