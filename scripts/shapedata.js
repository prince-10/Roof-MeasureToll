var LineType = Enum("Rake", "Eave", "Valley", "Ridge", "Hip");
var ratio = 0;

/*******************************************************8
Roof Pitch	Pitch Factor (Gets Multiplied by Total Sqs.)
2/12	1.01
3/12	1.03
4/12	1.05
5/12	1.08
6/12	1.12
7/12	1.16
8/12	1.20
9/12	1.25
10/12	1.30
12/12	1.41
14/12	1.54
16/12	1.67
18/12	1.80
20/12	1.94
22/12	2.09
24/12	2.24
*********************************************************/

//point object
function Point(x, y) {
    this.x = x;
    this.y = y;
}

//line object
function Line(a, b, ratio) {
    this.a = a;
    this.b = b;
    this.ratio = ratio;
    this.distance = function() {
        return Math.sqrt((this.a.x - this.b.x) * (this.a.x - this.b.x) + (this.a.y - this.b.y) * (this.a.y - this.b.y));
    };
    this.distanceFeet = function() {
        var pixelDistance = Math.sqrt((this.a.x - this.b.x) * (this.a.x - this.b.x) + (this.a.y - this.b.y) * (this.a.y - this.b.y));
        return this.ratio * pixelDistance / 12;
    };
}

function RoofLine(line, type, name, measuredlength) {
    this.line = line;
    switch (type) {
        case LineType.Rake:
            this.color = "blue";
            this.type = LineType.Rake;
            break;
        case LineType.Eave:
            this.color = "red";
            this.type = LineType.Eave;
            break;
        case LineType.Valley:
            this.color = "yellow";
            this.type = LineType.Valley;
            break;
        case LineType.Ridge:
            this.color = "green";
            this.type = LineType.Ridge;
            break;
        case LineType.Hip:
            this.color = "purple";
            this.type = LineType.Hip;
            break;
        default:
            throw "You must use a value in the 'line type' enum.";
    }
    this.name = name;
    this.measuredlength = measuredlength;
    //draw the line onto the canvas
    this.draw = function() {
        drawLine(this.line.a, this.line.b, this.color, 4);
    };
}

function RoofShape(points, pitch, color, name, comments, index) {
    this.points = points;
    this.pitch = pitch;
    this.color = color;
    this.name = name;
    this.comments = comments;
    this.index = index;
    this.roofLines = new Array();
    this.addNewPoint = function(p) {
        this.points.push(p);
        if (this.points.length >= 2) {
            //add a new roof line
            //add line from previous point to current
            var line = new Line(this.points[this.points.length - 2], this.points[this.points.length - 1], ratio);
            var newLine = new RoofLine(line, LineType.Eave, "Line#" + (this.roofLines.length + 1).toString(), line.distanceFeet());
            this.roofLines.push(newLine);
        }
    };
    this.removeLastPoint = function() {
        this.points.pop();
        if (this.points.length >= 1 && this.points.length % 2 != 0) {
            //remove last roof line
            this.roofLines.pop();
        }
    };

    this.area = function() {
        var area = 0; // Accumulates area in the loop
        var vertexCount = this.points.length;
        if (vertexCount < 3) {
            return area;
        }

        var j = vertexCount - 1; // The last vertex is the 'previous' one to the first

        for (i = 0; i < vertexCount; i++) {
            area = area + (this.points[j].x + this.points[i].x) * (this.points[j].y - this.points[i].y);
            j = i; //j is previous vertex to i
        }
        return Math.abs(area / 2);
    };
    this.areaFeet = function() {
        var area = 0; // Accumulates area in the loop
        var vertexCount = this.points.length;
        if (vertexCount < 3) {
            return area;
        }

        if (this.index == 0) {
            //make sure we have a ratio set since this is the first measured shape
            this.setRatio();
        }
        var j = vertexCount - 1; // The last vertex is the 'previous' one to the first

        for (i = 0; i < vertexCount; i++) {
            area = area + (this.points[j].x + this.points[i].x) * (this.points[j].y - this.points[i].y);
            j = i; //j is previous vertex to i
        }
        var theArea = Math.abs(((area / 2) * (ratio * ratio)) / 144);
        switch (parseInt(this.pitch, 10)) {
            case 1:
                return theArea * 1.00;
                break;
            case 2:
                return theArea * 1.0147;
                break;
            case 3:
                return theArea * 1.031;
                break;
            case 4:
                return theArea * 1.054;
                break;
            case 5:
                return theArea * 1.083;
                break;
            case 6:
                return theArea * 1.118;
                break;
            case 7:
                return theArea * 1.158;
                break;
            case 8:
                return theArea * 1.202;
                break;
            case 9:
                return theArea * 1.250;
                break;
            case 10:
                return theArea * 1.302;
                break;
            case 11:
                return theArea * 1.357;
                break;
            case 12:
                return theArea * 1.413;
                break;
            default:
                return theArea;
        }
    };
    //draw the polygon onto the canvas
    this.draw = function() {
        if (appMode == 'REPORT') {
            if (this.points.length >= 2) {
                var el = document.getElementById('section-' + this.index.toString() + '-canvas');
                var c = el.getContext('2d');
                //get a context and scale it down from 8/12 to 4/12
                //find the boundingbox
                var minx = Number.MAX_VALUE;
                var miny = Number.MAX_VALUE;
                var maxx = Number.MIN_VALUE;
                var maxy = Number.MIN_VALUE;
                for (i = 0; i < this.points.length; i++) {
                    if (this.points[i].x < minx) {
                        minx = this.points[i].x;
                    }
                    if (this.points[i].y < miny) {
                        miny = this.points[i].y;
                    }
                    if (this.points[i].x > maxx) {
                        maxx = this.points[i].x;
                    }
                    if (this.points[i].y > maxy) {
                        maxy = this.points[i].y;
                    }
                }

                //if bounding rect fits into current, translate up and over
                var sectionpoints = new Array();
                for (i = 0; i < this.points.length; i++) {
                    var newX = this.points[i].x - minx + 30;
                    var newY = this.points[i].y - miny + 30;
                    sectionpoints.push(new Point(newX, newY));
                }

                var scalefactor = 0.5;

                if (maxx > parseInt(el.clientWidth)) {
                    ratiox = parseInt(el.clientWidth) / (maxx + 90);
                } else {
                    ratiox = parseInt(el.clientWidth) / (maxx - 90);
                }

                if (maxy > parseInt(el.clientHeight)) {
                    ratioy = parseInt(el.clientHeight) / (maxy + 90);
                } else {
                    ratioy = parseInt(el.clientHeight) / (maxy - 90);
                }



                if (ratiox < scalefactor || ratioy < scalefactor) {
                    //need a scale factor
                    if (ratiox < ratioy) {
                        scalefactor = ratiox;
                    } else {
                        scalefactor = ratioy;
                    }
                }
                c.clearRect(0, 0, el.clientWidth, el.clientHeight);
                c.save();
                //c.translate(pos.x, pos.y);
                c.scale(scalefactor, scalefactor);
                drawSectionPolygon(c, sectionpoints, color);
                c.restore();
            }
        } else {
            if (this.points.length >= 2) {
                drawPolygon(this.points, color);
                if (appMode == 'LINES') {
                    //get the center point of this polygon
                    var contour = new Contour(this.points);
                    var polygonCenter = contour.centroid();
                    //output the pitch in the center of the shape
                    drawTextAtPoint(polygonCenter, this.pitch);

                    for (i = 0; i < this.roofLines.length; i++) {
                        this.roofLines[i].draw();
                    }
                }


                /*
				//need to also draw the lines that show colors on the diagram
				***************'
				***************'
				var p1=this.points[0];
				for (var i = 1; i < this.points.length; ++i) {

			  		var p2=this.points[i];
					drawLine(p1,p2,color);
					p1=p2;
			   	}
			   	//final line to origin
			   	drawLine(p2,this.points[0],color);
			   	*/
            }
        }
    };
    this.setRatio = function() {
        if (this.points.length >= 2) {
            var pixelDistance = Math.sqrt((this.points[0].x - this.points[1].x) * (this.points[0].x - this.points[1].x) + (this.points[0].y - this.points[1].y) * (this.points[0].y - this.points[1].y));
            var feet = parseInt($("#referenceFeet").val(), 10);
            if (isNaN(feet))
                feet = 0;
            var inches = parseInt($("#referenceInches").val(), 10);
            if (isNaN(inches))
                inches = 0;
            var totalInches = (12 * feet) + inches;
            if (isNaN(totalInches))
                ratio = 0;
            else
                ratio = totalInches / pixelDistance;
        } else {
            ratio = 0;
        }
    };
    this.toString = function() {
        var dripedgeFt = 0;
        var ridgecapFt = 0;
        var iceandwaterFt = 0;
        var valleyiceandwaterFt = 0;
        var output = "";

        if (this.points.length >= 2) {
            output += "_________________________________________________________________________________<br \>";
            output += "Roof Section: " + this.name + "<br \>";
            output += "Section Pitch: " + this.pitch.toString() + ":12" + "<br \>";
            output += "Total Area: " + parseFloat(this.areaFeet().toFixed(2)) + " sq/ft<br \>";
            output += "Comments: " + this.comments + "<br \>";
            output += "&nbsp;&nbsp;&nbsp;# Points Collected: " + this.points.length + "<br \>";
            output += "&nbsp;&nbsp;&nbsp;# Lines Collected: " + (this.points.length - 1) + "<br \>";
            var p1 = this.points[0];
            for (var k = 1; k < this.points.length; k++) {
                var p2 = this.points[k];
                var L1 = new Line(p1, p2, ratio);
                output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Line " + k + ": " + parseFloat(L1.distanceFeet().toFixed(2)) + " feet<br \>";
                p1 = p2;
            }
            //now inspect all of the assigned lines to see what materials they consume
            for (var i = 0; i < this.roofLines.length; i++) {
                this.roofLines[i].ratio = ratio;
                if (this.roofLines[i].type == LineType.Ridge) {
                    output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roof Line " + (i + 1) + ": (Ridge) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet<br \>";
                    ridgecapFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Rake) {
                    output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roof Line " + (i + 1) + ": (Rake) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet<br \>";
                    dripedgeFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Eave) {
                    output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roof Line " + (i + 1) + ": (Eave) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet<br \>";
                    dripedgeFt += this.roofLines[i].line.distanceFeet();
                    iceandwaterFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Hip) {
                    output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roof Line " + (i + 1) + ": (Hip) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet<br \>";
                    ridgecapFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Valley) {
                    output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Roof Line " + (i + 1) + ": (Valley) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet<br \>";
                    valleyiceandwaterFt += this.roofLines[i].line.distanceFeet();
                }
            }

            iceandwaterFt += (valleyiceandwaterFt / 2);

            output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ridge Cap: " + ridgecapFt.toFixed(2) + " feet<br \>";
            output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Drip Edge: " + dripedgeFt.toFixed(2) + " feet<br \>";
            output += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ice & Water: " + iceandwaterFt.toFixed(2) + " feet<br \>";
            //get last Line reported as well
            //var p2 = this.points[0];
            //var L2 = new Line(p1,p2);
            //output+="\t\tLine " + k + ": " + parseFloat(L2.distanceFeet().toFixed(2)) + " feet\n";
            output += "<br \>";
        }
        return output;
    };
    this.toPDFString = function() {
        var dripedgeFt = 0;
        var ridgecapFt = 0;
        var iceandwaterFt = 0;
        var valleyiceandwaterFt = 0;
        var output = "";

        if (this.points.length >= 2) {
            output += "_________________________________________________________________________________\n\n";
            output += "Roof Section: " + this.name + "\n";
            output += "Section Pitch: " + this.pitch.toString() + ":12" + "\n";
            output += "Total Area: " + parseFloat(this.areaFeet().toFixed(2)) + " sq/ft\n";
            output += "Comments: " + this.comments + "\n";
            output += "\t# Points Collected: " + this.points.length + "\n";
            output += "\t# Lines Collected: " + (this.points.length - 1) + "\n";
            var p1 = this.points[0];
            for (var k = 1; k < this.points.length; k++) {
                var p2 = this.points[k];
                var L1 = new Line(p1, p2, ratio);
                output += "\tLine " + k + ": " + parseFloat(L1.distanceFeet().toFixed(2)) + " feet\n";
                p1 = p2;
            }
            //now inspect all of the assigned lines to see what materials they consume
            for (var i = 0; i < this.roofLines.length; i++) {
                this.roofLines[i].ratio = ratio;
                if (this.roofLines[i].type == LineType.Ridge) {
                    output += "\tRoof Line " + (i + 1) + ": (Ridge) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet\n";
                    ridgecapFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Rake) {
                    output += "\tRoof Line " + (i + 1) + ": (Rake) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet\n";
                    dripedgeFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Eave) {
                    output += "\tRoof Line " + (i + 1) + ": (Eave) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet\n";
                    dripedgeFt += this.roofLines[i].line.distanceFeet();
                    iceandwaterFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Hip) {
                    output += "\tRoof Line " + (i + 1) + ": (Hip) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet\n";
                    ridgecapFt += this.roofLines[i].line.distanceFeet();
                }
                if (this.roofLines[i].type == LineType.Valley) {
                    output += "\tRoof Line " + (i + 1) + ": (Valley) - " + this.roofLines[i].line.distanceFeet().toFixed(2) + " feet\n";
                    valleyiceandwaterFt += this.roofLines[i].line.distanceFeet();
                }
            }

            iceandwaterFt += (valleyiceandwaterFt / 2);
            output += "\tRidge Cap: " + ridgecapFt.toFixed(2) + " feet\n";
            output += "\tDrip Edge: " + dripedgeFt.toFixed(2) + " feet\n";
            output += "\tIce & Water: " + iceandwaterFt.toFixed(2) + " feet\n";
            //get last Line reported as well
            //var p2 = this.points[0];
            //var L2 = new Line(p1,p2);
            //output+="\t\tLine " + k + ": " + parseFloat(L2.distanceFeet().toFixed(2)) + " feet\n";
            output += "\n";
        }
        return output;
    };
}