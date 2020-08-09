function renderToolbar(inMode) {
    appMode = inMode;

    //Based on App Mode, render conditional toolbar icons

    if (appMode == "POSITION") {

        $('#shapeName').hide();
        $('#pitch').hide();
        //now swap the canvas order and set the cursor
        //now swap the canvas order and set the cursor
        $('#theImage').css('z-index', 3);
        $('#theCrosshairs').css('z-index', 2);
        $('#theCanvas').css('z-index', 1);
        $('#theImage').css('cursor', 'auto');
        $('#theCanvas').css('cursor', 'auto');

        $('#workspace').show();
        $('#image-position-toolbar').show();
        $('#diagram-save-toolbar').hide();
        // $('#reference-line-toolbar').hide();
        $('#linetype-toolbar').hide();
        $('#rooflines-toolbar').hide();
        $('#materials').hide();
        $('#materials-toolbar').hide();
        $('#section-data').hide();

    } else if (appMode == "OVERLAY") {

        $('#shapeName').show();
        $('#pitch').show();
        //now swap the canvas order and set the cursor
        $('#theImage').css('z-index', 1);
        $('#theCanvas').css('z-index', 2);
        $('#theCrosshairs').css('z-index', 3);
        //$('#theCrosshairs').css( 'visibility', 'visibile' );
        $('#theImage').css('cursor', 'none');
        $('#theCanvas').css('cursor', 'none');
        $('#theCrosshairs').css('cursor', 'none');

        $('#workspace').show();
        $('#image-position-toolbar').hide();
        $('#diagram-save-toolbar').show();
        // $('#reference-line-toolbar').hide();
        $('#linetype-toolbar').hide();
        $('#rooflines-toolbar').show();
        $('#materials').hide();
        $('#materials-toolbar').hide();
        $('#section-data').hide();
        updateLineLengths();
        drawAll();

    } else if (appMode == "LINES") {
        $('#shapeName').hide();
        $('#pitch').hide();
        //now swap the canvas order and set the cursor
        $('#theImage').css('z-index', 1);
        $('#theCrosshairs').css('z-index', 2);
        $('#theCanvas').css('z-index', 3);
        $('#theImage').css('cursor', 'none');
        $('#theCanvas').css('cursor', 'auto');

        //remove the crosshairs horizontal/verttical line
        var tmpCrosshairs = document.getElementById('theCrosshairs');
        var tmpch_context = tmpCrosshairs.getContext('2d');
        tmpch_context.clearRect(0, 0, tmpCrosshairs.width, tmpCrosshairs.height);

        $('#workspace').show();
        // $('#reference-line-toolbar').hide(); 
        $('#linetype-toolbar').show();
        $('#rooflines-toolbar').hide();
        $('#image-position-toolbar').hide();
        $('#diagram-save-toolbar').show();
        $('#materials').hide();
        $('#materials-toolbar').hide();
        $('#section-data').hide();
        updateLineLengths();
        drawAll();
    } else if (appMode == "MATERIALS") {
        $('#shapeName').hide();
        $('#pitch').hide();
        $('#workspace').hide();
        $('#image-position-toolbar').hide();
        $('#diagram-save-toolbar').hide();
        $('#linetype-toolbar').hide();
        $('#rooflines-toolbar').hide();
        //  $('#reference-line-toolbar').hide();
        $('#materials').show();
        $('#materials-toolbar').show();
        $('#section-data').hide();
        updateLineLengths();
        updateMaterialTotal();
    } else if (appMode == "REPORT") {
        $('#shapeName').hide();
        $('#pitch').hide();

        $('#workspace').hide();
        $('#materials').hide();
        $('#materials-toolbar').hide();
        //$('#reference-line-toolbar').hide();
        $('#linetype-toolbar').hide();
        $('#rooflines-toolbar').hide();
        $('#image-position-toolbar').hide();
        $('#diagram-save-toolbar').hide();
        $('#section-data').show();
        updateLineLengths();
        reportStoredData();
    } else if (appMode == "PRINT") {
        updateLineLengths();
        printpdf();
    } else {
        $('#shapeName').show();
        $('#pitch').show();
        $('#rooflines-toolbar').show();
        //$('#reference-line-toolbar').show();
        $('#workspace').show();
        $('#image-position-toolbar').show();
        $('#diagram-save-toolbar').show();
        $('#materials').hide();
        $('#materials-toolbar').hide();
        $('#section-data').hide();
        $('#linetype-toolbar').hide();
    }
}