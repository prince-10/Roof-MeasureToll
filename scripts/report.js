var pdf = new jsPDF('p', 'pt', 'letter');
var pagewidth = pdf.internal.pageSize.width;
var pageheight = pdf.internal.pageSize.height;
var d = new Date();
var datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();

function printpdf() {
    //reset the global vars
    pdf = new jsPDF('p', 'pt', 'letter');
    pagewidth = pdf.internal.pageSize.width;
    pageheight = pdf.internal.pageSize.height;
    d = new Date();
    datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "/" + ("0" + d.getDate()).slice(-2) + "/" + d.getFullYear();
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case

    //Page 1 - Materials
    outputPageHeader();
    outputPageFooter();
    pdf.setFontSize(15)
    pdf.text(30, 95, 'Summary of Measurements');

    var tableoptions = {
        // Properties
        startY: 110, // false (indicates margin top value) or a number
        margin: 30, // a number, array or object
    };

    //loop through each shape and accumulate totals by linetype
    var totalSqFt = 0;
    var eaveFt = 0;
    var rakeFt = 0;
    var hipFt = 0;
    var valleyFt = 0;
    var ridgeFt = 0;


    for (var j = 0; j < shapes.length; j++) {
        if (shapes[j].points.length >= 2) {
            totalSqFt += shapes[j].areaFeet();
            //now inspect all of the assigned lines to see what materials they consume
            for (var i = 0; i < shapes[j].roofLines.length; i++) {
                if (shapes[j].roofLines[i].type == LineType.Ridge) {
                    ridgeFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Rake) {
                    rakeFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Eave) {
                    eaveFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Valley) {
                    valleyFt += shapes[j].roofLines[i].line.distanceFeet();
                }
                if (shapes[j].roofLines[i].type == LineType.Hip) {
                    hipFt += shapes[j].roofLines[i].line.distanceFeet();
                }
            }

        }
    }
    var summarycolumns = ["Measurement", "Value"];
    var summaryrows = [
        ["Total Area (sq/ft)", totalSqFt.toFixed(2)],
        ["Ridges (ft)", (ridgeFt / 2).toFixed(2)],
        ["Hips (ft)", hipFt.toFixed(2)],
        ["Valleys (ft)", (valleyFt / 2).toFixed(2)],
        ["Rakes (ft)", rakeFt.toFixed(2)],
        ["Eaves (ft)", eaveFt.toFixed(2)],
        ["Roof Squares", (totalSqFt / 100).toFixed(2)]
    ];

    pdf.autoTable(summarycolumns, summaryrows, tableoptions);

    pdf.text(30, 400, 'Materials List');

    var materialcolumns = ["Item", "Unit Of Measure", "Quantity", "Unit Cost", "Ext Cost"];
    var materialrows = [
        ["Shingles", "33 sq/ft Bundle", materials.shingles.quantity(), "$" + materials.shingles.cost.toFixed(2), "$" + materials.shingles.price()],
        ["Ridge Cap", "20 ft per bundle", materials.ridgecap.quantity(), "$" + materials.ridgecap.cost.toFixed(2), "$" + materials.ridgecap.price()],
        ["Ridge Vent", "20 ft per roll", materials.ridgevent.quantity(), "$" + materials.ridgevent.cost.toFixed(2), "$" + materials.ridgevent.price()],
        ["Drip Edge", "10' Section", materials.dripedge.quantity(), "$" + materials.dripedge.cost.toFixed(2), "$" + materials.dripedge.price()],
        ["Underlayment", "1000 sq/ft Roll", materials.underlayment.quantity(), "$" + materials.underlayment.cost.toFixed(2), "$" + materials.underlayment.price()],
        ["Ice & Water", "75' x 3' Roll", materials.iceandwatershield.quantity(), "$" + materials.iceandwatershield.cost.toFixed(2), "$" + materials.iceandwatershield.price()],
        ["Nails", "Box Of 7200 Nails", materials.nails.quantity(), "$" + materials.nails.cost.toFixed(2), "$" + materials.nails.price()],
        ["Material Total", "", "", "", "$" + $('#ext_price_all').val()]
    ];
    tableoptions.startY = 420;
    pdf.autoTable(materialcolumns, materialrows, tableoptions);
    //Section Report

    //Page 2 - Images
    pdf.addPage();
    outputPageHeader();
    outputPageFooter();
    pdf.setFontSize(15)
    pdf.text(30, 75, 'Images');

    //Image 1
    var src = $('#carousel-image-1').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(30, 100, 260, 195);
        pdf.addImage(src, 'png', 30, 100, 260, 195);
    }
    //Image 2
    src = $('#carousel-image-2').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(320, 100, 260, 195);
        pdf.addImage(src, 'png', 320, 100, 260, 195);
    }
    //Image 3
    src = $('#carousel-image-3').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(30, 300, 260, 195);
        pdf.addImage(src, 'png', 30, 300, 260, 195);
    }
    //Image 4
    src = $('#carousel-image-4').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(320, 300, 260, 195);
        pdf.addImage(src, 'png', 320, 300, 260, 195);
    }
    //Image 5
    src = $('#carousel-image-5').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(30, 500, 260, 195);
        pdf.addImage(src, 'png', 30, 500, 260, 195);
    }
    //Image 6
    src = $('#carousel-image-6').attr('src');
    if (src.substring(0, 5) == "data:") {
        pdf.rect(320, 500, 260, 195);
        pdf.addImage(src, 'png', 320, 500, 260, 195);
    }

    //Page 3 - Data
    pdf.addPage();
    outputPageHeader();
    outputPageFooter();
    pdf.setFontSize(15)
    pdf.text(30, 75, 'Summary of Roof Sections');

    pdf.setFontSize(10)

    var summaryoutput = "";
    var sectionoutput = "";
    var totalSqFt = 0;
    //for (var i = 0; i < pointStack.length; ++i) {
    //output+='Click #' + i + ': (' + pointStack[i].x + ',' + pointStack[i].y + ')\n';
    //}

    for (var j = 0; j < shapes.length; ++j) {
        if (shapes[j].points.length >= 2) {
            totalSqFt += shapes[j].areaFeet();
            sectionoutput += shapes[j].toPDFString() + "\n";
        }
    }

    summaryoutput += "Roof Report: " + $("#PropertyAddress").val() + "\n";
    summaryoutput += "Total Area: " + parseFloat(totalSqFt.toFixed(2)) + " sq/ft\n";
    summaryoutput += "# Sections Collected: " + (shapes.length - 1) + "\n";
    summaryoutput += sectionoutput;

    //split summarry output into lines and track 10 per line, forcing new page as necessary
    var summarylines = summaryoutput.split('\n');
    var leftMargin = 30;
    var lineheight = 10;
    var startheight = 90;
    var endheight = pageheight - 20;
    var currentHeight = startheight;
    for (var i = 0; i < summarylines.length; i++) {
        //check page boundary
        if ((currentHeight + lineheight) > endheight) {
            //output a new page
            pdf.addPage();
            outputPageHeader();
            outputPageFooter();
            pdf.setFontSize(15)
            pdf.text(30, 75, 'Summary of Roof Sections');
            pdf.setFontSize(10);
            //reset current height to beginning
            currentHeight = startheight;
        }
        //output line
        pdf.text(leftMargin, currentHeight, summarylines[i]);
        //increment current height
        currentHeight += lineheight;
    }

    /*
    var src=$('#carousel-image-1').attr('src');
    if (src.substring(0, 5) == "data:") {

    	//Page 2 up Images
    	pdf.addPage();
    	outputPageHeader();	
    	outputPageFooter();	
    	
    	//Image 1

    	if (src.substring(0, 5) == "data:") {
    		pdf.rect(90,75,440,330);
    		pdf.addImage(src, 'png', 90,75,440,330);
    	}
    	//Image 2
    	src=$('#carousel-image-2').attr('src');
    	if (src.substring(0, 5) == "data:") {
    		pdf.rect(90,425,440,330);
    		pdf.addImage(src, 'png', 90,425,440,330);
    	}

    	
    	src=$('#carousel-image-3').attr('src');
    	if (src.substring(0, 5) == "data:") {
    		//Page 2 up Images
    		pdf.addPage();
    		outputPageHeader();	
    		outputPageFooter();

    		//Image 3
    		if (src.substring(0, 5) == "data:") {
    			pdf.rect(90,75,440,330);
    			pdf.addImage(src, 'png', 90,75,440,330);
    		}
    		//Image 4
    		src=$('#carousel-image-4').attr('src');
    		if (src.substring(0, 5) == "data:") {
    			pdf.rect(90,425,440,330);
    			pdf.addImage(src, 'png', 90,425,440,330);
    		}
    		
    		src=$('#carousel-image-5').attr('src');
    		if (src.substring(0, 5) == "data:") {
    			//Page 2 up Images
    			pdf.addPage();
    			outputPageHeader();
    			outputPageFooter();	

    			//Image 5
    			if (src.substring(0, 5) == "data:") {
    				pdf.rect(90,75,440,330);
    				pdf.addImage(src, 'png', 90,75,440,330);
    			}
    			//Image 6
    			src=$('#carousel-image-6').attr('src');
    			if (src.substring(0, 5) == "data:") {
    				pdf.rect(90,425,440,330);
    				pdf.addImage(src, 'png', 90,425,440,330);
    			}
    		}
    	}
    }
    */

    pdf.save('RoofEstimateReport.pdf');
}


function outputPageHeader() {
    pdf.setFontSize(15);
    pdf.text(30, 40, 'Roof Estimate Report');
    pdf.setFontSize(10);
    pdf.text(450, 35, 'Report Date: ' + datestring);
    //Property Address               
    pdf.setFontSize(10)
    pdf.text(30, 55, 'Property Address:' + $('#PropertyAddress').val());
}

function outputCompactHeader() {
    //Property Address               
    pdf.setFontSize(10)
    pdf.text(30, 30, 'Property Address:' + $('#PropertyAddress').val());
}

function outputPageFooter() {
    pdf.setFontSize(8)
    pdf.text(400, pageheight - 15, 'Report provided by ' + REPORT_FOOTER_URL);
}