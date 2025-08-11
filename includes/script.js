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

    $("#convert").click(function(){
        var editedCode = $('#main-div').html();
        localStorage.setItem("imageData", editedCode);
        if (window.confirm('Your edit has been saved. If you click "ok" you would be redirected to edit page. Cancel will keep you in this page ')) {
            window.location.href='edit.html';
        }
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