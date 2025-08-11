// src/index.js
// This file contains the complete logic for the image marker

module.exports = function initImageMarker(config) {
    var i = 0;
    var state = '';
    var selectedMarker = null;
    var markerColor = '#00ffff';

    var container = $(config.containerId);
    var toolbar = $(config.toolbarId);

    if (container.length === 0 || toolbar.length === 0) {
        console.error('Marker container or toolbar not found. Check your IDs.');
        return;
    }

    // Function to handle marker creation
    function setMarker(e, o) {
        if (!state || state === 'delete') {
            return;
        }

        var self = $(e.target);
        var marker;

        if (state === 'star') {
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
        } else if (state === 'resize-box') {
            if (o === undefined) {
                o = $("<i>", {
                    class: "resize-div",
                    css: { color: markerColor }
                });
            }
            marker = o.appendTo(self.parent()).css({
                top: (e.pageY - self.offset().top) + "px",
                left: (e.pageX - self.offset().left) + "px"
            });
        }
    }

    // Helper function to update active button state in the toolbar
    function updateToolbarButtonStates(selectedButton) {
        toolbar.find('.btn').removeClass('active');
        $(selectedButton).addClass('active');
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    }

    // Attach event handlers to the container and toolbar
    container.on("click", "img#image", function(e) {
        if (state !== 'delete') {
            setMarker(e);
        }
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    });

    container.on("click", "i", function(e) {
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

    // Toolbar button handlers
    toolbar.on("click", "#star", function() {
        state = 'star';
        updateToolbarButtonStates(this);
    });

    toolbar.on("click", "#box", function() {
        state = 'resize-box';
        updateToolbarButtonStates(this);
    });

    toolbar.on("click", "#delete", function() {
        state = 'delete';
        updateToolbarButtonStates(this);
    });

    toolbar.on("click", "#convert", function() {
        var image = new Image();
        image.crossOrigin = "Anonymous";
        image.onload = function() {
            var canvas = document.createElement('canvas');
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            container.find('i').each(function() {
                var marker = $(this);
                var markerColor = marker.css('color');
                var top = parseFloat(marker.css('top'));
                var left = parseFloat(marker.css('left'));

                if (marker.hasClass('fa-star')) {
                    var markerNumber = marker.find('span.number').text();
                    ctx.fillStyle = markerColor;
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.font = '30px Arial';
                    ctx.fillText('★', left, top + 25);
                    ctx.strokeText('★', left, top + 25);
                    ctx.fillStyle = 'red';
                    ctx.font = '12px Arial';
                    ctx.fillText(markerNumber, left + 10, top + 15);
                } else if (marker.hasClass('resize-div')) {
                    var width = marker.width();
                    var height = marker.height();
                    ctx.strokeStyle = markerColor;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.strokeRect(left, top, width, height);
                    ctx.setLineDash([]);
                }
            });
            var dataURL = canvas.toDataURL("image/png");
            var link = document.createElement('a');
            link.download = 'marked-image.png';
            link.href = dataURL;
            link.click();
            alert('Your marked image has been saved as marked-image.png!');
        };
        image.src = container.find('#image').attr('src');
    });

    // Color palette handler
    toolbar.on("click", ".color-swatch", function() {
        markerColor = $(this).data('color');
        toolbar.find('.color-swatch').removeClass('active-color');
        $(this).addClass('active-color');
        if (selectedMarker) {
            selectedMarker.css('color', markerColor);
        }
    });

    // Toggling editing mode
    $('#start-editing').click(function(e) {
        toolbar.toggle();
        $(this).find('i').toggleClass('fa-edit fa-times');
        state = '';
        toolbar.find('.btn').removeClass('active');
        if (selectedMarker) {
            selectedMarker.removeClass('selected');
            selectedMarker = null;
        }
    });
};