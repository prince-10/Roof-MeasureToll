var sectionTemplate = "";
/*['<div class="row">',
							'<div class="col-md-4">',
								'<canvas name="section-canvas-{{pos}}" id="section-canvas-{{pos}}" class="sectionCanvas"></canvas>',
							'</div>',
							'<div class="col-md-8">',
								'<label>Section Name</label>',
								'<span id="section{{pos}}-name">{{name}}</span>',
								'<br />',
								'<label>Section Pitch</label>',
								'<span id="section{{pos}}-pitch">{{pitch}}</span>',
								'<br />',
								'<label>Section Area</label>',
								'<span id="section{{pos}}-area">{{area}}</span>',
								'<br />',
							'</div>',									
						'</div>'
					].join('\n');
					*/


function outputSections() {
    //load the template into a templateBase variable
    // * this is only done once
    if (sectionTemplate == "") {
        $.get('views/sectiontemplate.html', function(data) {
            //assign the template
            sectionTemplate = data;
            mergeSections();
        });
    } else {
        mergeSections();
    }
}

function mergeSections() {
    //clear the sections so we can re-render
    $("#sections").empty();
    for (var i = 0; i < shapes.length - 1; i++) {
        renderSection(shapes[i], i);
    }
}

//Special helper
String.prototype.replaceAll = function(find, replace) {
    var str = this;
    return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
};

function renderSection(roofshape, pos) {
    //load materials template
    var sectionInstance = sectionTemplate;

    //apply template variable substitution
    sectionInstance = sectionInstance.replaceAll("{{pos}}", pos.toString());
    sectionInstance = sectionInstance.replaceAll("{{index}}", (roofshape.index + 1).toString());
    sectionInstance = sectionInstance.replaceAll("{{name}}", roofshape.name.toString());
    sectionInstance = sectionInstance.replaceAll("{{pitch}}", roofshape.pitch.toString());
    sectionInstance = sectionInstance.replaceAll("{{area}}", parseFloat(roofshape.areaFeet().toFixed(2)) + " sq/ft");
    sectionInstance = sectionInstance.replaceAll("{{comments}}", roofshape.comments.toString());

    $("#sections").append(sectionInstance);

    /*
    //attach mouse events to coordinates of section canvas
    var el=document.getElementById("section-"+pos.toString()+"-canvas");
    el.addEventListener('mousemove', function(e) {
    	//set the coordinates label
    	var rect = el.getBoundingClientRect();
    	var p= new Point(e.clientX - rect.left,e.clientY - rect.top);

    	$('#mouse-coordinates2').text('SECTION:('+p.x.toString()+','+p.y.toString()+')');

    	}, false );

    */

    //now set the pitch to be selected
    $("#section-" + pos.toString() + "-pitch").val(roofshape.pitch.toString());

    //now set the raw data
    $("#section-" + pos.toString() + "-rawdata").html(roofshape.toString());

    //Set the width of the canvas to take up 4/12ths (-15px) of the window (width wise)
    //and a dynamic height based on 16x9 ratio
    var width = (window.innerWidth / 12 * 4) - 30;
    var height = width / 16 * 9;

    //now I can mess with the canvas
    $("#section-" + pos.toString() + "-canvas").height(height);
    $("#section-" + pos.toString() + "-canvas").width(width);
    //draw the shape on the canvas
    roofshape.draw();
}

function updateSectionName(el) {
    var theIDParts = el.id.split('-');
    var theIndex = parseInt(theIDParts[1]);
    var theValue = el.value;
    shapes[theIndex].name = theValue;
    //update
    reportStoredData();

}

function updateSectionPitch(el) {
    var theIDParts = el.id.split('-');
    var theIndex = parseInt(theIDParts[1]);
    var theValue = el.value;
    shapes[theIndex].pitch = theValue;

    //update
    reportStoredData();

}

function updateSectionComments(el) {
    var theIDParts = el.id.split('-');
    var theIndex = parseInt(theIDParts[1]);
    var theValue = el.value;
    shapes[theIndex].comments = theValue;
    //update
    reportStoredData();

}