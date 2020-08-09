function saveProject(name) {
    updateLineLengths();
    var AppState = {
        App_js: {
            clicks: clicks,
            lastClick: lastClick,
            shapeCount: shapeCount,
            oldPoint: oldPoint,
            shapes: shapes,
            shapePointStack: shapePointStack,
            shape: shape,
            currentShapeForLineAssignment: currentShapeForLineAssignment,
            currentlLineType: currentlLineType,
            pointStack: pointStack,
            click_mode: click_mode,
            appMode: appMode,
            materials: materials
        },
        CanvasTools_js: {
            //theCanvas:theCanvas,
            //theCrosshairs:theCrosshairs,
            //theImage:theImage,
            zoomLevel: zoomLevel,
            //context:context,
            //ch_context:ch_context,
            //ca_context:ca_context,
            //image_context:image_context,
            backgroundURL: backgroundURL,
            scale: scale,
            translatePos: translatePos,
            rotateAngle: rotateAngle,
            //jcrop_api:jcrop_api,
            bCrop: bCrop
        },
        /*
	   propertyaddress_js:{
		placeSearch:placeSearch,
		autocomplete:autocomplete,
		componentForm:componentForm
	   },
	  */
        section_js: {
            sectionTemplate: sectionTemplate
        },
        ShapeData_js: {
            ratio: ratio
        },
        gui: {
            PropertyAddress: $('#PropertyAddress').val(),
            referenceFeet: $('#referenceFeet').val(),
            referenceInches: $('#referenceInches').val(),
            carousel_image_1: $('#carousel-image-1').attr('src'),
            filename_image_1: $('#filename-image-1').val(),
            carousel_image_2: $('#carousel-image-2').attr('src'),
            filename_image_2: $('#filename-image-2').val(),
            carousel_image_3: $('#carousel-image-3').attr('src'),
            filename_image_3: $('#filename-image-3').val(),
            carousel_image_4: $('#carousel-image-4').attr('src'),
            filename_image_4: $('#filename-image-4').val(),
            carousel_image_5: $('#carousel-image-5').attr('src'),
            filename_image_5: $('#filename-image-5').val(),
            carousel_image_6: $('#carousel-image-6').attr('src'),
            filename_image_6: $('#filename-image-6').val(),
        },
    }

    //DO something with this appState Object
    //Persist to LocalStorage
    //Present Download File
    // Put the object into storage
    localStorage.setObject(name, AppState);

    //alert('Project saved');
}

function loadProject(name) {
    //populate the app with the state object values

    // Retrieve the object from storage
    var AppState = localStorage.getObject(name);

    if (AppState == null) {
        alert('File not found');
        return;
    }

    //primitives
    clicks = AppState.App_js.clicks;
    shapeCount = AppState.App_js.shapeCount;
    click_mode = AppState.App_js.click_mode;
    appMode = AppState.App_js.appMode;
    zoomLevel = AppState.CanvasTools_js.zoomLevel;
    backgroundURL = AppState.CanvasTools_js.backgroundURL;
    scale = AppState.CanvasTools_js.scale;
    rotateAngle = AppState.CanvasTools_js.rotateAngle;
    bCrop = AppState.CanvasTools_js.bCrop;
    currentlLineType = AppState.App_js.currentlLineType;
    sectionTemplate = AppState.section_js.sectionTemplate;
    ratio = AppState.ShapeData_js.ratio;
    $('#PropertyAddress').val(AppState.gui.PropertyAddress);
    $('#referenceFeet').val(AppState.gui.referenceFeet);
    $('#referenceInches').val(AppState.gui.referenceInches);
    $('#carousel-image-1').attr('src', AppState.gui.carousel_image_1);
    $('#filename-image-1').val(AppState.gui.filename_image_1);
    $('#carousel-image-2').attr('src', AppState.gui.carousel_image_2);
    $('#filename-image-2').val(AppState.gui.filename_image_2);
    $('#carousel-image-3').attr('src', AppState.gui.carousel_image_3);
    $('#filename-image-3').val(AppState.gui.filename_image_3);
    $('#carousel-image-4').attr('src', AppState.gui.carousel_image_4);
    $('#filename-image-4').val(AppState.gui.filename_image_4);
    $('#carousel-image-5').attr('src', AppState.gui.carousel_image_5);
    $('#filename-image-5').val(AppState.gui.filename_image_5);
    $('#carousel-image-6').attr('src', AppState.gui.carousel_image_6);
    $('#filename-image-6').val(AppState.gui.filename_image_6);


    //complex objects that can be copied (Point objects)
    lastClick = copyObjectData(AppState.App_js.lastClick, lastClick);
    oldPoint = copyObjectData(AppState.App_js.oldPoint, oldPoint);
    translatePos = AppState.CanvasTools_js.translatePos;
    //populate the materials object
    materials.shingles = copyObjectData(AppState.App_js.materials.shingles, materials.shingles);
    materials.underlayment = copyObjectData(AppState.App_js.materials.underlayment, materials.underlayment);
    materials.dripedge = copyObjectData(AppState.App_js.materials.dripedge, materials.dripedge);
    materials.ridgecap = copyObjectData(AppState.App_js.materials.ridgecap, materials.ridgecap);
    materials.iceandwatershield = copyObjectData(AppState.App_js.materials.iceandwatershield, materials.iceandwatershield);
    materials.nails = copyObjectData(AppState.App_js.materials.nails, materials.nails);

    //arrays of objects
    //clear out shapes and then repopulate
    shapes = [];
    for (var i = 0; i < AppState.App_js.shapes.length; i++) {
        var o = AppState.App_js.shapes[i];
        shapes.push(new RoofShape(o.points, o.pitch, "red", o.name, o.comments, o.index));
        //now add the rooflines
        for (var j = 0; j < o.roofLines.length; j++) {
            var o2 = o.roofLines[j];
            var li3 = new Line(o2.line.a, o2.line.b, o2.line.ratio);
            shapes[i].roofLines.push(new RoofLine(li3, o2.type, o2.name, o2.measuredlength));
        }
    }

    //clear out points and then repopulate
    shapePointStack = [];
    for (var n = 0; n < AppState.App_js.shapePointStack.length; n++) {
        var p = AppState.App_js.shapePointStack[n];
        shapePointStack.push(new Point(p.x, p.y));
    }

    //clear out points and then repopulate
    pointStack = [];
    for (var x = 0; x < AppState.App_js.pointStack.length; x++) {
        var p2 = AppState.App_js.pointStack[x];
        pointStack.push(new Point(p2.x, p2.y));
    }

    //populate the shape object
    var s = AppState.App_js.shape;
    shape = new RoofShape(s.points, s.pitch, "red", s.name, s.comments, s.index);
    for (var l = 0; l < s.roofLines.length; l++) {
        var rl = s.roofLines[l];
        var li1 = new Line(rl.line.a, rl.line.b, rl.line.ratio);
        shape.roofLines.push(new RoofLine(li1, rl.type, rl.name, rl.measuredlength));
    }

    //populate the currentshapeforlineassignment object
    var s2 = AppState.App_js.currentShapeForLineAssignment;
    currentShapeForLineAssignment = new RoofShape(s2.points, s2.pitch, "red", s2.name, s2.comments, s2.index);
    for (var m = 0; m < s.roofLines.length; m++) {
        var rl2 = s.roofLines[l];
        var li2 = new Line(rl2.line.a, rl2.line.b, rl2.line.ratio);
        currentShapeForLineAssignment.roofLines.push(new RoofLine(li2, rl2.type, rl2.name, rl2.measuredlength));
    }

    /*
    placeSearch=AppState.propertyaddress_js.placeSearch;
    autocomplete=AppState.propertyaddress_js.autocomplete;
    componentForm=AppState.propertyaddress_js.componentForm;
    */

    //fix the screen
    resizeCanvas();

    //setup overlay mode
    $('#grpModes').find('.btn').removeClass('active');
    $('#modeOverlay').addClass('active');
    renderToolbar('OVERLAY');
    updateLineLengths();

    //update totals
    updateMaterialTotal();

    //alert('Project loaded');
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}


//helper function to clone a given object instance
function copyObjectData(objSource, objDest) {
    var newObj = {};
    for (var key in objSource) {
        //copy all the fields
        objDest[key] = objSource[key];
    }
    return objDest;
}