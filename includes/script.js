$(function() {
    var i = 0;
    var state = '';
    var selectedMarker = null;
    var markerColor = '#00ffff';

    // Function to handle marker creation
    $.fn.setMarker = function(e, o) {
        if (!state || state === 'delete') {
            return;
        }

        var self = $(this);
        var marker;

        if (state == 'star') {
            i++;
            if (o === undefined) {
                o = $("<i>", {
                    class: "fa fa-star",
                    css: { color: markerColor }
                }).html("<span class='number' style='color:red;'>"+i+"<span>");
            }
            marker = o.appendTo(self.parent()).css({
                top: (e.pageY - self.offset().top) + "px",
                left: (e.pageX - self.offset().left) + "px"
            });
        } else if (state == 'resize-box') {
            if (o === undefined) {
                o = $("<i>", {
                    class: "resize-div",
                    css: { color: markerColor }
                }); // No inner HTML
            }
            marker = o.appendTo(self.parent()).css({
                top: (e.pageY - self.offset().top) + "px",
                left: (e.pageX - self.offset().left) + "px"
            });
        }
    };

    $('#main-div').on("click", "i", function(e) {
        e.stopPropagation();
        if (state === 'delete') {
            $(this).remove();
            selectedMarker = null;
        } else {
            if (selectedMarker) {
                selectedMarker.removeClass('selected');
            }
            selectedMarker = $(this).addClass('selected');
        }
    });

    $('#main-div').on("click", "img#image", function(e) {
        if (state !== 'delete') {
            $(this).setMarker(e);
        }
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    });

    // Toolbar button handlers
    $("#star").click(function(){
        state = 'star';
        updateToolbarButtonStates(this);
    });

    $("#box").click(function(){
        state = 'resize-box';
        updateToolbarButtonStates(this);
    });
    
    // This button handler is now removed or repurposed

    $("#delete").click(function(){
        state = 'delete';
        updateToolbarButtonStates(this);
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    });

    $("#convert").click(function() {
    var image = new Image();
    image.crossOrigin = "Anonymous"; // Crucial for loading an image from another domain
    image.onload = function() {
        var canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        var ctx = canvas.getContext('2d');

        // Draw the original image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        // Draw each marker onto the canvas
        $('#main-div i').each(function() {
            var marker = $(this);
            var markerColor = marker.css('color');
            var top = parseFloat(marker.css('top'));
            var left = parseFloat(marker.css('left'));

            if (marker.hasClass('fa-star')) {
                // Get the number from the span inside the star icon
                var markerNumber = marker.find('span.number').text();

                // Set font and style for the star and number
                ctx.fillStyle = markerColor;
                ctx.strokeStyle = '#fff'; // White outline for contrast
                ctx.lineWidth = 1;
                
                // Draw a unicode star with a bold font
                ctx.font = '30px Arial';
                ctx.fillText('★', left, top + 25);
                ctx.strokeText('★', left, top + 25);

                // Draw the number text
                ctx.fillStyle = 'red';
                ctx.font = '12px Arial';
                ctx.fillText(markerNumber, left + 10, top + 15);

            } else if (marker.hasClass('resize-div')) {
                var width = marker.width();
                var height = marker.height();

                // Set color and style for the box
                ctx.strokeStyle = markerColor;
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]); // Dashed line for the box

                // Draw the rectangle
                ctx.strokeRect(left, top, width, height);

                // Reset line dash for next drawings
                ctx.setLineDash([]); 
            }
        });

        // Convert the canvas content to an image data URL
        var dataURL = canvas.toDataURL("image/png");

        // Create a temporary link and trigger a download
        var link = document.createElement('a');
        link.download = 'marked-image.png';
        link.href = dataURL;
        link.click();

        alert('Your marked image has been saved as marked-image.png!');
    };
    image.src = document.getElementById('image').src;
});

    $("#start-editing").click(function(e){
        $("#mark-type-button").toggle();
        $(this).find('i').toggleClass('fa-edit fa-times');
        state = '';
        $('.toolbar .btn').removeClass('active');
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    });

    // Color palette handler
    $('.color-swatch').click(function() {
        markerColor = $(this).data('color');
        $('.color-swatch').removeClass('active-color');
        $(this).addClass('active-color');
        if (selectedMarker) {
            selectedMarker.css('color', markerColor);
        }
    });

    // Helper function to update active button state in the toolbar
    function updateToolbarButtonStates(selectedButton) {
        $('.toolbar .btn').removeClass('active');
        $(selectedButton).addClass('active');
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    }
});