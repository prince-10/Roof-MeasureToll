var colors = ["#588d73", "#f2e294", "#f2ad74", "#d9645a", "#8c4646"];
var clicks = 0;
var lastClick = new Point(0, 0);
var shapeCount = 0;
var oldPoint = new Point(0, 0);
var shapes = new Array();
var shapePointStack = new Array();
var shape = new RoofShape(shapePointStack, "-1", "red", "", "");
var currentShapeForLineAssignment = null;
var currentlLineType = LineType.Rake;
//stack of objects, in this case (x,y) coordinates of a mouse click
var pointStack = new Array();

//track click mode
var click_mode = "collect";
var appMode = "POSITION"; // { IMAGE | OVERLAY}

var materials = new MaterialState("here");


function init() {
    theCanvas = document.getElementById('theCanvas');
    context = document.getElementById('theCanvas').getContext('2d');

    //crosshairs div
    theCrosshairs = document.getElementById('theCrosshairs');
    ch_context = document.getElementById('theCrosshairs').getContext('2d');
    // bind event handler to crosshairs canvas for crosshair precision tracking
    theCrosshairs.addEventListener('mousemove', function(e) {

        var rect = theCrosshairs.getBoundingClientRect();
        var p = new Point(e.clientX - rect.left, e.clientY - rect.top)
        //$('#mouse-coordinates').text('CROSSHAIRS:('+p.x.toString()+','+p.y.toString()+')');

        ch_context.clearRect(0, 0, theCrosshairs.width, theCrosshairs.height);
        ch_context.beginPath();
        //draw horizontal line
        ch_context.moveTo(0, p.y);
        ch_context.lineTo(theCrosshairs.width, p.y);
        //draw vertical line
        ch_context.moveTo(p.x, 0);
        ch_context.lineTo(p.x, theCrosshairs.height);
        ch_context.strokeStyle = "black";
        ch_context.stroke();
        ch_context.closePath();
    }, false);
    //initialize global variables
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);
    pointStack = new Array();
    shapePointStack = new Array();
    shapes = new Array();
    lastClick = new Point(0, 0);
    clicks = 0;
    shapeCount = 0;
    shape = new RoofShape(shapePointStack, "-1", "red", "", "", shapeCount);
    shapes.push(shape);


    // bind event handler to canvas for left mouse click tracking (point collection)
    document.getElementById('theCrosshairs').addEventListener('click', function(e) {
        if (click_mode == 'collect')
            addPoint(e);
        else if (click_mode == "drag") {
            var newPoint = getCanvasPosition(e);
            switchPoint(oldPoint, newPoint);
            click_mode = "collect";
            $('canvas').css('cursor', 'none');
        }
        drawAll();
        reportStoredData();
    }, false);

    // bind event handler to canvas for right mouse click tracking (Start the drag_)
    document.getElementById('theCrosshairs').addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (onPoint(e)) {
            $('canvas').css('cursor', 'move');
            click_mode = "drag";
            oldPoint = getCanvasPosition(e);

            for (var i = 0; i < pointStack.length; ++i) {
                if (oldPoint.x >= pointStack[i].x - POINT_TOLERANCE && oldPoint.x <= pointStack[i].x + POINT_TOLERANCE && oldPoint.y >= pointStack[i].y - POINT_TOLERANCE && oldPoint.y <= pointStack[i].y + POINT_TOLERANCE) {
                    //make the new click have identical coordiantes to the stored click
                    oldPoint.x = pointStack[i].x;
                    oldPoint.y = pointStack[i].y;
                }
            }


        }

    }, false);


    // bind event handler to canvas for mouse move tracking
    // when mode is to assign types to lines
    document.getElementById('theCanvas').addEventListener('mousemove', function(e) {
        //set the coordinates label
        var p = getCanvasPosition(e);
        //$('#mouse-coordinates').text('CANVAS:('+p.x.toString()+','+p.y.toString()+')');
        var tempRes = getLineContainingPoint(e);
        if (tempRes != null) {
            $('#theCanvas').css('cursor', 'pointer');
        } else {
            $('#theCanvas').css('cursor', 'default');
        }

    }, false);

    // bind event handler to canvas for mouse move tracking
    // when mode is to assign types to lines
    document.getElementById('theCanvas').addEventListener('click', function(e) {
        var tempRes = getLineContainingPoint(e);
        if (tempRes != null) {
            for (var i = 0; i < tempRes.length; i++) {
                var linecolor;
                switch (currentlLineType) {
                    case LineType.Rake:
                        linecolor = "blue";
                        break;
                    case LineType.Eave:
                        linecolor = "red";
                        break;
                    case LineType.Valley:
                        linecolor = "yellow";
                        break;
                    case LineType.Ridge:
                        linecolor = "green";
                        break;
                }

                tempRes[i].shape.roofLines[tempRes[i].line].color = linecolor;
                tempRes[i].shape.roofLines[tempRes[i].line].type = currentlLineType;
                drawAll();
            }
        }
    }, false);

    // bind event handler to clear button
    document.getElementById('undoclick').addEventListener('click', function(e) {
        clearPoint(e);
        drawAll();
        reportStoredData();
    }, false);

    // bind event handler to clear button
    document.getElementById('clear').addEventListener('click', function() {
        context = document.getElementById('theCanvas').getContext('2d');
        context.clearRect(0, 0, theCanvas.width, theCanvas.height);
        pointStack = new Array();
        lastClick = new Point(0, 0);
        clicks = 0;
        ratio = 0;
        shapeCount = 0;
        shapePointStack = new Array();
        shapes = new Array();
        shape = new RoofShape(shapePointStack, "-1", "red", "", "", shapeCount);
        shapes.push(shape);
        reportStoredData();
    }, false);

    // bind event handler to hideBackground button
    document.getElementById('hideBackground').addEventListener('click', function() {
        document.getElementById("theImage").style.visibility = "hidden";
    }, false);

    // bind event handler to showBackground button
    document.getElementById('showBackground').addEventListener('click', function() {
        document.getElementById("theImage").style.visibility = "visible";
    }, false);

    // bind event handler to showBackground button
    document.getElementById('saveCurrent').addEventListener('click', function() {
        //add name to current shape
        shapes[shapeCount].name = $('#shapeName').val();
        shapes[shapeCount].pitch = $('#pitch').val();
        //add new shape
        shapeCount++;
        shapePointStack = new Array();
        shape = new RoofShape(shapePointStack, "-1", "red", "", "", shapeCount);
        shapes.push(shape);
        //reset clicks
        lastClick = new Point(0, 0);
        //reset shape name
        $('#shapeName').val("");
        //reset pitch
        $('#pitch').val("-1");
        //now that we have names on stuff, lets draw it again
        drawAll();
    }, false);

    // bind event handler to save current image button
    document.getElementById('saveCurrentImage').addEventListener('click', function() {
        //add name to current shape
        var fileName = $('#saveFilename').val();
        var imagePosition = $('#savePosition').val();
        // save canvas image as data url (png format by default)
        var dataURL = theImage.toDataURL();
        setSmallImage(fileName, imagePosition, dataURL);

    }, false);

    // bind event handler to save current image button
    document.getElementById('saveCurrentDiagramImage').addEventListener('click', function() {
        //add name to current shape
        var fileName = $('#saveDiagramFilename').val();
        var imagePosition = $('#saveDiagramPosition').val();
        // save canvas image as data url (png format by default)
        var dataURL = theCanvas.toDataURL();
        setSmallImage(fileName, imagePosition, dataURL);

    }, false);

    //load aerial view
    document.getElementById('btnLoadAerialView').addEventListener('click', function() {
        loadAerialViewFromAddress();
        reset();
    }, false);

    //load aerial view
    document.getElementById('btnLoadStreetView').addEventListener('click', function() {
        loadStreetViewFromAddress();
        reset();
    }, false);

    //reference feet change
    document.getElementById('referenceFeet').addEventListener('change', function() {
        updateLineLengths();
        reportStoredData();
    }, false);


    //reference inches change
    document.getElementById('referenceInches').addEventListener('change', function() {
        updateLineLengths();
        reportStoredData();
    }, false);

    //reset_autocalc click
    document.getElementById('reset_autocalc').addEventListener('click', function() {
        resetAutoQuantityCalculation();
    }, false);

    //reset
    document.getElementById('reset').addEventListener('click', function() {
        reset();
    }, false);

    //Set app to 'POSITION' Mode
    document.getElementById('modePosition').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('POSITION');
    }, false);

    //Set app to 'OVERLAY' Mode
    document.getElementById('modeOverlay').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('OVERLAY');
    }, false);

    //Set app to 'LINES' Mode
    document.getElementById('modeLines').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('LINES');
    }, false);


    //Set app to 'MEASURE' Mode by highlighting the reference line purple
    document.getElementById('modeMeasure').addEventListener('click', function() {
        drawReferenceLine(pointStack, 'purple');
    }, false);

    //Set app to 'MATERIALS' Mode
    document.getElementById('modeMaterials').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('MATERIALS');
    }, false);

    //Set app to 'REPORT' Mode
    document.getElementById('modeRoofData').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('REPORT');
    }, false);

    //Set app to 'PRINT' Mode
    document.getElementById('modePrint').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        renderToolbar('PRINT');
    }, false);

    //Set app to 'RAKE' Mode
    document.getElementById('line-type-rake').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        currentlLineType = LineType.Rake;
    }, false);
    //Set app to 'EAVE' Mode
    document.getElementById('line-type-eave').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        currentlLineType = LineType.Eave;

    }, false);

    //Set app to 'VALLEY' Mode
    document.getElementById('line-type-valley').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        currentlLineType = LineType.Valley;
    }, false);

    //Set app to 'HIP' Mode
    document.getElementById('line-type-hip').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        currentlLineType = LineType.Hip;
    }, false);

    //Set app to 'RIDGE' Mode
    document.getElementById('line-type-ridge').addEventListener('click', function() {
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass('active');
        currentlLineType = LineType.Ridge;
    }, false);

    // bind event handler to save current image button
    document.getElementById('toggleCrop').addEventListener('click', function() {
        //add name to current shape
        if (bCrop) {
            // the variable is defined, so end the crop
            endCrop();
            bCrop = false;

        } else {
            //start the crop
            startCrop();
            bCrop = true;
        }

    }, false);

    //load aerial view
    document.getElementById('btnSaveProject').addEventListener('click', function() {
        var projectName = prompt("Please enter a project name", $('#PropertyAddress').val());
        saveProject(projectName);
    }, false);

    //load aerial view
    document.getElementById('btnLoadProject').addEventListener('click', function() {
        var projectName = prompt("Please enter a project name", $('#PropertyAddress').val());
        loadProject(projectName);
    }, false);

}

function layout() {
    resizeCanvas();
    resizeThumbs();
}

function updateLineLengths() {

    //first, set the ratio according to the reference lines
    shapes[0].setRatio();

    //now, loop through each shape and for each line, set the length
    for (var i = 0; i < shapes.length; i++) {
        if (shapes[i].roofLines.length > 0) {
            for (var j = 0; j < shapes[i].roofLines.length; j++) {
                //set line ratio
                shapes[i].roofLines[j].line.ratio = ratio;
                //set measured length
                shapes[i].roofLines[j].measuredlength = shapes[i].roofLines[j].line.distanceFeet();
            }
        }
    }
}

function reportStoredData() {
    var output = "";
    var sectionoutput = "";
    var totalSqFt = 0;
    //for (var i = 0; i < pointStack.length; ++i) {
    //output+='Click #' + i + ': (' + pointStack[i].x + ',' + pointStack[i].y + ')\n';
    //}

    for (var j = 0; j < shapes.length; ++j) {
        if (shapes[j].points.length >= 2) {
            totalSqFt += shapes[j].areaFeet();
            //sectionoutput += shapes[j].toString() +"<br \>";
        }
    }
    output += "_________________________________________________________________________________<br \>";
    output += "Roof Report: " + $("#PropertyAddress").val() + "<br \>";
    output += "Total Area: " + parseFloat(totalSqFt.toFixed(2)) + " sq/ft<br \>";
    output += "# Sections Collected: " + (shapes.length - 1) + "<br \>";
    output += sectionoutput;
    $('#results').html(output);
    outputSections();
}

function updateMaterialTotal() {

    setMaterialState();
    //update extended cost ui
    $('#ext_price_all').val(materials.CalcTotal());
    $('#ext_price_shingles').val(materials.shingles.price());
    $('#ext_price_ridgecap').val(materials.ridgecap.price());
    $('#ext_price_ridgevent').val(materials.ridgevent.price());
    $('#ext_price_dripedge').val(materials.dripedge.price());
    $('#ext_price_underlayment').val(materials.underlayment.price());
    $('#ext_price_iceandwater').val(materials.iceandwatershield.price());
    $('#ext_price_nails').val(materials.nails.price());
    //update unit cost ui
    $('#price_shingles').val(materials.shingles.cost);
    $('#price_ridgecap').val(materials.ridgecap.cost);
    $('#price_ridgevent').val(materials.ridgevent.cost);
    $('#price_dripedge').val(materials.dripedge.cost);
    $('#price_underlayment').val(materials.underlayment.cost);
    $('#price_iceandwater').val(materials.iceandwatershield.cost);
    $('#price_nails').val(materials.nails.cost);

    //update QTY UI 
    $('#qty_shingles').val(materials.shingles.quantity());
    $('#qty_ridgecap').val(materials.ridgecap.quantity());
    $('#qty_ridgevent').val(materials.ridgevent.quantity());
    $('#qty_dripedge').val(materials.dripedge.quantity());
    $('#qty_underlayment').val(materials.underlayment.quantity());
    $('#qty_iceandwater').val(materials.iceandwatershield.quantity());
    $('#qty_nails').val(materials.nails.quantity());
}

function setMaterialState() {
    //clear out sqft for shingles
    materials.shingles.sqft = 0;
    materials.underlayment.sqft = 0;
    materials.nails.sqft = 0;
    materials.iceandwatershield.ft = 0;
    materials.dripedge.ft = 0;
    materials.ridgecap.ft = 0;
    materials.ridgevent.ft = 0;
    //loop through each shape and add in sqft
    var totalSqFt = 0;
    var dripedgeFt = 0;
    var ridgecapFt = 0;
    var iceandwaterFt = 0;
    var valleyiceandwaterFt = 0;
    //for (var i = 0; i < pointStack.length; ++i) {
    //output+='Click #' + i + ': (' + pointStack[i].x + ',' + pointStack[i].y + ')\n';
    //}

    for (var j = 0; j < shapes.length; j++) {
        if (shapes[j].points.length >= 2) {
            totalSqFt += shapes[j].areaFeet();
            //now inspect all of the assigned lines to see what materials they consume
            for (var i = 0; i < shapes[j].roofLines.length; i++) {
                if (shapes[j].roofLines[i].type == LineType.Ridge) {
                    ridgecapFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Rake) {
                    dripedgeFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Eave) {
                    dripedgeFt += shapes[j].roofLines[i].line.distanceFeet();
                    iceandwaterFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Valley) {
                    valleyiceandwaterFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Hip) {
                    ridgecapFt += shapes[j].roofLines[i].line.distanceFeet();
                }
            }

        }
    }
    materials.shingles.sqft = totalSqFt;
    materials.underlayment.sqft = totalSqFt;
    materials.nails.sqft = totalSqFt;
    materials.iceandwatershield.ft = iceandwaterFt + (valleyiceandwaterFt / 2);
    materials.dripedge.ft = dripedgeFt;
    materials.ridgecap.ft = ridgecapFt / 2; //special case.  always half because of 2 shapes sharing the line
    materials.ridgevent.ft = ridgecapFt / 2; //special case.  always half because of 2 shapes sharing the line

}



/*

// Set up touch events for mobile, etc
document.getElementById("theCrosshairs").addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(document.getElementById("theCrosshairs"), e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("theCrosshairs", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  document.getElementById("theCrosshairs").dispatchEvent(mouseEvent);
}, false);
document.getElementById("theCrosshairs").addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  document.getElementById("theCrosshairs").dispatchEvent(mouseEvent);
}, false);
document.getElementById("theCrosshairs").addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  document.getElementById("theCrosshairs").dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

// Prevent scrolling when touching the canvas
document.body.addEventListener("touchstart", function (e) {
  if (e.target == document.getElementById("theCrosshairs")) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == document.getElementById("theCrosshairs")) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == document.getElementById("theCrosshairs")) {
    e.preventDefault();
  }
}, false);
*/