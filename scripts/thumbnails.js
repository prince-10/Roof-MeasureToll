function resizeThumbs() {
    //Set the width of the thumbs to take up 2/12ths (-5px) of the window (width wise)
    //and a dynamic height based on 16x9 ratio
    var width = (window.innerWidth / 12 * 2) - 5;
    var height = width / 16 * 9;
    //for all thumbs
    //set width and height
    $('a.thumbnail img').each(function() {
        $(this).width(width);
        $(this).height(height);
        var thumbwidth = parseInt($(this).parent().css("width"), 10);
        var labelwidth = parseInt($(this).parent().children("label").css("width"), 10);
        var textboxwidth = thumbwidth - labelwidth - 10;
        $(this).parent().children("input").css("width", textboxwidth + "px");
    });
}

function readURL(input, element, name) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
            $('#' + element).attr('src', e.target.result);
            //set filename
            $('#' + name).val(input.files[0].name);
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function setBigImage(element) {
    //$('#canvas').attr('background-image', $('#'+element).attr('src'));
    var theURL = $('#' + element).attr('src');
    backgroundURL = theURL;
    setImage(theImage, image_context, theURL, scale, translatePos, rotateAngle);
    reset();
}

function setSmallImage(fileName, imagePosition, dataURL) {
    /* Place code to store image data here */
    $('#carousel-image-' + imagePosition).attr('src', dataURL);
    //set filename
    $('#filename-image-' + imagePosition).val(fileName);
}

function bindThumbnailEvents() {
    //Bind each of the image gallery upload button
    $("#uploadthumbnail1").change(function() {
        readURL(this, 'carousel-image-1', 'filename-image-1');
    });

    $("#uploadthumbnail2").change(function() {
        readURL(this, 'carousel-image-2', 'filename-image-2');
    });

    $("#uploadthumbnail3").change(function() {
        readURL(this, 'carousel-image-3', 'filename-image-3');
    });

    $("#uploadthumbnail4").change(function() {
        readURL(this, 'carousel-image-4', 'filename-image-4');
    });

    $("#uploadthumbnail5").change(function() {
        readURL(this, 'carousel-image-5', 'filename-image-5');
    });

    $("#uploadthumbnail6").change(function() {
        readURL(this, 'carousel-image-6', 'filename-image-6');
    });

    //Bind each of the image gallery upload button
    $("#carousel-selector-1").click(function() {
        setBigImage('carousel-image-1');
    });

    $("#carousel-selector-2").click(function() {
        setBigImage('carousel-image-2');
    });

    $("#carousel-selector-3").click(function() {
        setBigImage('carousel-image-3');
    });

    $("#carousel-selector-4").click(function() {
        setBigImage('carousel-image-4');
    });

    $("#carousel-selector-5").click(function() {
        setBigImage('carousel-image-5');
    });

    $("#carousel-selector-6").click(function() {
        setBigImage('carousel-image-6');
    });
}