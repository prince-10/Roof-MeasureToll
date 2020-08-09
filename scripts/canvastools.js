// this is the pixel width we will "snap to".  
// anything near this delta of an existing (x,y) point will inherit the coordinates of the existing (x,y) point 
var POINT_TOLERANCE = 2;
var theCanvas;
var theCrosshairs;
var theImage;
var zoomLevel = 100;
var context;
var ch_context;
var ca_context;
var image_context;
var backgroundURL;

//for resizing of picture
var scale = 1.0;
var translatePos = new Point(0, 0);
var rotateAngle = 0;

var jcrop_api;
var bCrop = false;

function resizeCanvas() {
    //Set the width of the canvas to take up 8/12ths (-15px) of the window (width wise)
    //and a dynamic height based on 16x9 ratio
    var width = (window.innerWidth / 12 * 8) - 15;
    var height = width / 16 * 9;

    //set the height of the div that contains all of the canvases
    $('#ImageContainer').height(height);

    $('#theCanvas').width(width);
    $('#theCanvas').height(height);
    $('#theCanvas').css('z-index', 2);

    //clear and draw
    theCanvas = document.getElementById('theCanvas');
    theCanvas.height = height;
    theCanvas.width = width;
    context = document.getElementById('theCanvas').getContext('2d');
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);

    if (appMode != 'POSITION') {
        drawAll();
    }
    //setup crosshairs
    $('#theCrosshairs').width(width);
    $('#theCrosshairs').height(height);
    $('#theCrosshairs').css('z-index', 3);

    //clear and draw
    theCrosshairs = document.getElementById('theCrosshairs');
    theCrosshairs.height = height;
    theCrosshairs.width = width;
    ch_context = document.getElementById('theCrosshairs').getContext('2d');
    ch_context.clearRect(0, 0, theCrosshairs.width, theCrosshairs.height);

    //setup image
    $('#theImage').width(width);
    $('#theImage').height(height);
    $('#theImage').css('z-index', 1);

    //clear and draw
    theImage = document.getElementById('theImage');
    theImage.height = height;
    theImage.width = width;
    image_context = document.getElementById('theImage').getContext('2d');
    image_context.clearRect(0, 0, theImage.width, theImage.height);

    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);

    //size the crop layer as well
    $('#theCropLayer').width(width);
    $('#theCropLayer').height(height);
}

//default line type

function drawLine(p1, p2, color) {
    drawLine(p1, p2, color, 2);
};

function drawLine(p1, p2, color, width) {
    drawMarker(p1);
    context.beginPath();
    context.lineWidth = width;
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y, 6);
    context.strokeStyle = color;
    context.stroke();
    drawMarker(p2);
};

//default marker type
function drawMarker(p) {
    drawMarker(p, '#FF6A6A', '#FF0000')
}

function drawMarker(p, fillColor, strokeColor) {
    // draw the colored region
    context.beginPath();
    context.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
    context.fillStyle = fillColor;
    context.fill();

    // draw the stroke
    context.lineWidth = 1;
    context.strokeStyle = strokeColor;
    context.stroke();
}

function drawSectionMarker(ctx, p) {
    drawMarker(ctx, p, '#FF6A6A', '#FF0000')
}

function drawSectionMarker(ctx, p, fillColor, strokeColor) {
    // draw the colored region
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
    ctx.fillStyle = fillColor;
    ctx.fill();

    // draw the stroke
    ctx.lineWidth = 1;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
}

function drawReferenceLine(points, strokeColor) {
    var p1 = points[0];
    var p2 = points[1];

    drawMarker(p1, '#800080', '#800000');
    context.beginPath();
    context.lineWidth = 4;
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y, 6);
    context.strokeStyle = strokeColor;
    context.stroke();
    drawMarker(p2, '#800000', '#800000');
}

function drawPolygon(points, strokeColor) {
    context.strokeStyle = strokeColor;
    context.lineWidth = 2;
    context.fillStyle = "rgba(255, 0, 0, 0.15)";
    var p1 = points[0];
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    for (var i = 1; i < points.length; ++i) {
        var pn = points[i];
        context.lineTo(pn.x, pn.y);
    }
    context.closePath();
    context.fill();
    context.stroke();

    //draw a marker on each point
    for (var i = 0; i < points.length; ++i) {
        var pn = points[i];
        drawMarker(pn);
    }
}

function drawSectionPolygon(ctx, points, strokeColor) {
    //note, this is at 50% so need to make adjustments for that
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
    var p1 = points[0];
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    for (var i = 1; i < points.length; ++i) {
        var pn = points[i];
        ctx.lineTo(pn.x, pn.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //draw a marker on each point
    for (var i = 0; i < points.length; ++i) {
        var pn = points[i];
        drawSectionMarker(ctx, pn);
    }
}

function drawLineLegend() {
    var drawing = document.getElementById("theCanvas");
    var con = drawing.getContext("2d");
    //clear background
    con.fillStyle = "white";
    con.fillRect(10, 10, 90, 120);
    con.fillStyle = "black";
    con.fillRect(12, 12, 85, 115);
    //gray inner
    con.fillStyle = "#e8ebef";
    con.fillRect(14, 14, 81, 111);
    // draw font in red
    con.fillStyle = "black";
    con.font = "8pt sans-serif";
    con.fillStyle = "black";
    con.fillText("Legend", 35, 25);
    con.fillStyle = "blue";
    con.fillText("__ Eave", 35, 50);
    con.fillStyle = "red";
    con.fillText("__ Rake", 35, 65);
    con.fillStyle = "yellow";
    con.fillText("__ Valley", 35, 80);
    con.fillStyle = "green";
    con.fillText("__ Ridge", 35, 95);
    con.fillStyle = "purple";
    con.fillText("__ Hip", 35, 110);
}

function drawPageHeader(text) {
    var drawing = document.getElementById("theCanvas");
    var con = drawing.getContext("2d");
    con.fillStyle = "white";
    con.fillRect(200, 10, 260, 40);
    con.fillStyle = "black";
    con.fillRect(202, 12, 256, 35);
    //gray inner
    con.fillStyle = "#e8ebef";
    con.fillRect(204, 14, 252, 31);
    // draw font in red
    con.fillStyle = "black";
    con.font = "16pt sans-serif";
    con.fillStyle = "black";
    con.fillText(text, 210, 35);
} // end draw

function drawTextAtPoint(p, text) {
    var drawing = document.getElementById("theCanvas");
    var con = drawing.getContext("2d");

    // draw font in white
    con.font = "18pt sans-serif";
    con.fillStyle = "black";
    con.fillText(text, p.x, p.y);
    con.strokeStyle = "black";
    con.strokeText(text, p.x, p.y);

} // end drawTextAtPoint

//This function is used when a point is moved.  It replaces the old captured point with the new point
function switchPoint(oldP, newP) {
    for (var i = 0; i < pointStack.length; ++i) {
        if (oldP.x == pointStack[i].x && oldP.y == pointStack[i].y) {
            //make the new click replace the old click
            pointStack[i].x = newP.x;
            pointStack[i].y = newP.y;


        }
    }
    //shapes also use this point and need their data adjusted as well?
    for (j = 0; j < shapes.length; j++) {
        for (var i = 0; i < shapes[j].points.length; ++i) {
            if (oldP.x == shapes[j].points[i].x && oldP.y == shapes[j].points[i].y) {
                //make the new click replace the old click
                shapes[j].points[i].x = newP.x;
                shapes[j].points[i].y = newP.y;

                //also need to make sure this point is the "right" point on the line
                for (z = 0; z < shapes[j].roofLines.length; z++) {
                    //check first point of line
                    if (oldP.x == shapes[j].rooflines[z].a.x && oldP.y == shapes[j].rooflines[z].a.y) {
                        shapes[j].rooflines[z].a = newP;
                    }
                    //check second point of line
                    if (oldP.x == shapes[j].rooflines[z].b.x && oldP.y == shapes[j].rooflines[z].b.y) {
                        shapes[j].rooflines[z].b = newP;
                    }
                }
            }
        }
    }
}

//This function adds a new point to the collection
function addPoint(e) {
    var currentPos = getCanvasPosition(e);
    //check for tolerance
    for (var i = 0; i < pointStack.length; ++i) {
        if (currentPos.x >= pointStack[i].x - POINT_TOLERANCE && currentPos.x <= pointStack[i].x + POINT_TOLERANCE && currentPos.y >= pointStack[i].y - POINT_TOLERANCE && currentPos.y <= pointStack[i].y + POINT_TOLERANCE) {
            //make the new click have identical coordiantes to the stored click
            currentPos.x = pointStack[i].x;
            currentPos.y = pointStack[i].y;
        }
    }
    lastClick = currentPos;
    pointStack.push(lastClick);
    clicks += 1;
    //this is where we need to call custom function 
    shapes[shapeCount].addNewPoint(lastClick);
}

//This function removes the last point from the collection
function clearPoint(e) {
    pointStack.pop();
    clicks -= 1;
    //this is where we need to call custom function 
    shapes[shapeCount].removeLastPoint();
}

function onPoint(e) {
    var p = getCanvasPosition(e);

    //check for tolerance
    for (var i = 0; i < pointStack.length; ++i) {
        if (p.x >= pointStack[i].x - POINT_TOLERANCE && p.x <= pointStack[i].x + POINT_TOLERANCE && p.y >= pointStack[i].y - POINT_TOLERANCE && p.y <= pointStack[i].y + POINT_TOLERANCE) {
            //make the new click have identical coordiantes to the stored click
            return true
        }
    }
    return false;

}


function drawAll() {
    // clear out the canvas before drawing any shapes
    //context = document.getElementById('theCanvas').getContext('2d');
    context.clearRect(0, 0, theCanvas.width, theCanvas.height);

    if (clicks > 0) {
        for (var i = 0; i < shapes.length; ++i) {
            shapes[i].color = colors[i % 5];
            shapes[i].draw();
        }
    }

    if (appMode == "LINES") {
        drawLineLegend();
        drawPageHeader("Roof Sections With Pitch");
    } else if (appMode == "OVERLAY") {
        drawPageHeader("Roof Diagram");
    }

}


function setZoom(zoomValue) {
    zoomLevel = zoomValue;
    scale = zoomLevel / 100;
    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);
    //setDiagram(theCanvas,context,scale, translatePos,rotateAngle);

}

function panH(newX) {
    translatePos.x = newX;
    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);
    //setDiagram(theCanvas,context,scale, translatePos,rotateAngle); 
}

function panV(newY) {
    translatePos.y = newY;
    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);
    //setDiagram(theCanvas,context,scale, translatePos,rotateAngle);
}

function rotate(amount) {
    rotateAngle = amount;
    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);
    //setDiagram(theCanvas,context,scale, translatePos,rotateAngle);
}

function reset() {
    rotateAngle = 0;
    scale = 1.0;
    translatePos.x = 0;
    translatePos.y = 0;
    setImage(theImage, image_context, backgroundURL, scale, translatePos, rotateAngle);
    //setDiagram(theCanvas,context,scale, translatePos,rotateAngle);
    //reset slider vales
    $("#zoomSlider").slider('setValue', 100);
    $("#panHSlider").slider('setValue', 0);
    $("#panVSlider").slider('setValue', 0);
    $("#rotateSlider").slider('setValue', 0);

}

function loadAerialViewFromAddress() {
    var baseURL = "http://maps.googleapis.com/maps/api/staticmap?maptype=satellite&zoom=20&scale=2&size=640x400&key=AIzaSyAznJBOGmMpLHdyoBVky9uLHNbbY0jy-WI&center=";
    var theURL = encodeURI(baseURL + document.getElementById("PropertyAddress").value);
    //theCanvas.style.backgroundImage = "url(data:image/png;base64,"+theURL+")";
    //theCanvas.style.backgroundImage = "url("+theURL+")";
    backgroundURL = theURL;
    setImage(theImage, image_context, theURL, scale, translatePos, rotateAngle);
}

function loadStreetViewFromAddress() {
    var baseURL = "http://maps.googleapis.com/maps/api/streetview?size=1280x800&key=AIzaSyAznJBOGmMpLHdyoBVky9uLHNbbY0jy-WI&location=";
    var theURL = encodeURI(baseURL + document.getElementById("PropertyAddress").value);
    //theCanvas.style.backgroundImage = "url(data:image/png;base64,"+theURL+")";
    //theCanvas.style.backgroundImage = "url("+theURL+")";
    backgroundURL = theURL;
    setImage(theImage, image_context, theURL, scale, translatePos, rotateAngle);
}

function setImage(inCanvas, ctx, src, scale, pos, rotate) {
    ctx.clearRect(0, 0, inCanvas.width, inCanvas.height);

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(scale, scale);
    //get to center to do this...
    ctx.translate(Math.round(inCanvas.width / 2), Math.round(inCanvas.height / 2));
    ctx.rotate(rotate * Math.PI / 180);
    //translate back to where we were
    ctx.translate(-1 * Math.round(inCanvas.width / 2), -1 * Math.round(inCanvas.height / 2));
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    //drawing of the test image - img1
    img.onload = function() {
        //draw background image
        ctx.drawImage(img, 0, 0);
        ctx.restore();
    };

    img.src = src;

}

function startCrop() {

    //now swap the canvas order and set the cursor
    $('#theCropLayer').css('z-index', 4);
    $('#theImage').css('z-index', 3);
    $('#theCrosshairs').css('z-index', 1);
    $('#theCanvas').css('z-index', 2);
    $('#theImage').css('cursor', 'auto');
    $('#theCanvas').css('cursor', 'auto');
    var options = {
        aspectRatio: theImage.width / theImage.height,
        canSelect: true,
        candrag: true,
        canResize: true
    }

    $('#theCropLayer').Jcrop(options, function() {
        jcrop_api = this;
    });
}

function endCrop() {
    //now swap the canvas order and set the cursor
    $('#theCropLayer').css('z-index', 0);
    $('#theImage').css('z-index', 1);
    $('#theCanvas').css('z-index', 2);
    $('#theCrosshairs').css('z-index', 3);
    $('#theImage').css('cursor', 'none');
    $('#theCanvas').css('cursor', 'none');
    $('#theCrosshairs').css('cursor', 'none');

    var c = jcrop_api.tellSelect();
    //setImage(theImage,image_context,backgroundURL,scale, translatePos,rotateAngle);

    if (parseInt(c.w) > 0) {
        // Show image preview
        var imageObj = $("#theImage")[0];
        var canvas = $("#theImage")[0];
        var context = canvas.getContext("2d");

        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0) {
            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        }
    }

    //need to "undo" the selection area
    //jcrop_api.destroy;
    if ($('#theCropLayer').data('Jcrop')) {
        $('#theCropLayer').data('Jcrop').destroy();
    }
    // jcrop_api.ui.holder.detach();

}

/*
function setDiagram(inCanvas,ctx,scale,pos,rotate)
{

    ctx.clearRect(0, 0, inCanvas.width, inCanvas.height);
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(scale, scale);
    ctx.rotate(rotate*Math.PI/180);
    drawAll();
    ctx.restore();
}
*/
function getLineContainingPoint(e) {

    // future optimized view technique (if necessary)
    //loop through lines of current shape only
    //for each line check if mouse is on the line
    //if it is, return that line

    //clear out line data reporting
    //$('#line-data').text('');
    var p = getCanvasPosition(e);
    var theLines = new Array();
    //check for tolerance
    for (var i = 0; i < shapes.length; ++i) {
        currentShapeForLineAssignment = shapes[i];
        for (var j = 0; j < currentShapeForLineAssignment.roofLines.length; j++) {
            var theLine = currentShapeForLineAssignment.roofLines[j];
            //console.log("testing line " + j.toString() + ": (" + theLine.a.x.toString() + "," +  theLine.a.y.toString() + "),(" + theLine.b.x.toString() + "," +  theLine.b.y.toString() + ") with point (" + p.x.toString() + "," +  p.y.toString() + ")\n");
            if (IsPointOnLine(theLine.line.a, theLine.line.b, p)) {
                //we are on the given line
                //console.log('It was on the line\n');
                var x = {
                    shape: currentShapeForLineAssignment,
                    line: j
                }
                //$('#line-data').text($('#line-data').text() + '\nShape:'+x.shape.name+',Line:'+j.toString());
                theLines.push(x);
            } else {
                //console.log('It was not on the line\n'); 
            }
        }
    }
    if (theLines.length != 0) {
        return theLines;
    } else {
        return null;
    }
}
/* Used for selecting lines */

var EPSILON = 10.0; //allow a 5 pixel tolerance

function IsPointOnLine(linePointA, linePointB, point) {
    var isOn = false;
    //quick bounding check
    if ((point.x >= linePointA.x && point.x <= linePointB.x) || (point.x >= linePointB.x && point.x <= linePointA.x)) {
        if ((point.y >= linePointA.y && point.y <= linePointB.y) || (point.y >= linePointB.y && point.y <= linePointA.y)) {
            var a = (linePointB.y - linePointA.y) / (linePointB.x - linePointA.x);
            var b = linePointA.y - a * linePointA.x;
            //adjust the tolerance by the zoom level
            var delta = Math.abs(point.y - (a * point.x + b));
            var tolerance = (EPSILON * (zoomLevel / 100));
            //$('#line-data').text(delta.toFixed(4) + "," + tolerance.toFixed(4));
            if (delta <= tolerance) {
                // point is on line segment
                isOn = true;
            }
            if (!isOn) {
                //still not on, but check for other verticies
                a = (linePointB.x - linePointA.x) / (linePointB.y - linePointA.y);
                b = linePointA.x - a * linePointA.y;
                //adjust the tolerance by the zoom level
                var delta = Math.abs(point.x - (a * point.y + b));
                var tolerance = (EPSILON * (zoomLevel / 100));
                if (delta <= tolerance) {
                    // point is on line segment
                    isOn = true;
                }
            }
            // point not on line segment
            return isOn;
        } else {
            // y isn't in range of line segment
            return false;
        }
    } else {
        // x isn't in range of line segment
        return false;
    }

}