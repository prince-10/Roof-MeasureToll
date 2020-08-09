//This function gets the mouse poistion on the screen itself
function getCursorPosition(e) {
    var x = 0;
    var y = 0;

    if (e.pageX != undefined && e.pageY != undefined) {
        x = e.pageX;
        y = e.pageY;
    } else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    return new Point(x, y);
}

//This function gets the mouse poistion within the canvas coordinates
function getCanvasPosition(e) {
    var rect = theCanvas.getBoundingClientRect();
    return new Point(e.clientX - rect.left, e.clientY - rect.top);
}