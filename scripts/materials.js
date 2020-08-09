//Shingles object
function Shingles(name, color, cost, sqft, waste) {
    this.name = name;
    this.color = color;
    this.unit = "Bundle";
    this.size = 33;
    this.cost = cost;
    this.sqft = sqft;
    this.waste = waste;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil((this.sqft * (1.0 + this.waste)) / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }

    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil((this.sqft * (1.0 + this.waste)) / this.size);
        } else {
            return this.qty;
        }
    };
}

//Underlayment object
function Underlayment(name, cost, sqft) {
    this.name = name;
    this.unit = "1000 sqft Role";
    this.size = 1000;
    this.cost = cost;
    this.sqft = sqft;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil(this.sqft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil(this.sqft / this.size);
        } else {
            return this.qty;
        }
    };
}

//IceAndWaterShield
function IceAndWaterShield(name, unit, cost, ft) {
    this.name = name;
    this.unit = "75' x 3' Role";
    this.size = 75;
    this.cost = cost;
    this.ft = ft;
    this.qty = 0;
    this.coverage = 1;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * this.coverage * Math.ceil(this.ft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return this.coverage * Math.ceil(this.ft / this.size);
        } else {
            return this.qty;
        }
    };
}

//Drip Edge
function DripEdge(name, unit, cost, ft) {
    this.name = name;
    this.unit = "10' Section";
    this.size = 10;
    this.cost = cost;
    this.ft = ft;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil(this.ft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil(this.ft / this.size);
        } else {
            return this.qty;
        }
    };
}

//Ridge Cap
function RidgeCap(name, unit, cost, ft) {
    this.name = name;
    this.unit = "Hip and Ridge (20 linear ft. per Bundle)";
    this.size = 20;
    this.cost = cost;
    this.ft = ft;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil(this.ft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil(this.ft / this.size);
        } else {
            return this.qty;
        }
    };
}

//Ridge Cap
function RidgeVent(name, unit, cost, ft) {
    this.name = name;
    this.unit = "Rolled Ridge Vent (20 linear ft. per Roll)";
    this.size = 20;
    this.cost = cost;
    this.ft = ft;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil(this.ft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil(this.ft / this.size);
        } else {
            return this.qty;
        }
    };
}

//Nails object
function Nails(name, cost, sqft) {
    this.name = name;
    this.unit = "10 lb Box";
    this.size = 1000;
    this.cost = cost;
    this.sqft = sqft;
    this.qty = 0;
    this.price = function() {
        if (this.qty == 0) {
            return (this.cost * Math.ceil(this.sqft / this.size)).toFixed(2);
        } else {
            return (this.cost * this.qty).toFixed(2);
        }
    };
    this.quantity = function() {
        if (this.qty == 0) {
            return Math.ceil(this.sqft / this.size);
        } else {
            return this.qty;
        }
    };
}

function MaterialState(x) {
    this.x = x;
    this.shingles = new Shingles("Shingles", "Charcoal", 32.50, 0, 0);
    this.underlayment = new Underlayment("Rhino", 83.90, 0);
    this.iceandwatershield = new IceAndWaterShield("Grace", "", 138.00, 0);
    this.dripedge = new DripEdge("Drip Edge", "", 5.99, 0);
    this.ridgecap = new RidgeCap("Ridge Cap", "", 52.50, 0);
    this.ridgevent = new RidgeVent("Ridge Vent", "", 48.95, 0);
    this.nails = new Nails("Nails", 21.97, 0);

    this.CalcTotal = function() {
        var price = 0.0;
        price += parseFloat(this.shingles.price());
        price += parseFloat(this.underlayment.price());
        price += parseFloat(this.iceandwatershield.price());
        price += parseFloat(this.dripedge.price());
        price += parseFloat(this.ridgecap.price());
        price += parseFloat(this.ridgevent.price());
        price += parseFloat(this.nails.price());

        return price.toFixed(2);
    };
}

function updateMaterialQuantity(el) {
    var theMaterial = el.id.replace('qty_', '');
    switch (theMaterial) {
        case "shingles":
            materials.shingles.qty = parseInt(el.value);
            break;
        case "underlayment":
            materials.underlayment.qty = parseInt(el.value);
            break;
        case "iceandwater":
            materials.iceandwatershield.qty = parseInt(el.value);
            break;
        case "dripedge":
            materials.dripedge.qty = parseInt(el.value);
            break;
        case "ridgecap":
            materials.ridgecap.qty = parseInt(el.value);
            break;
        case "ridgevent":
            materials.ridgevent.qty = parseInt(el.value);
            break;
        case "nails":
            materials.nails.qty = parseInt(el.value);
            break;
    }

    //update
    updateMaterialTotal();
}

function updateMaterialCost(el) {
    var theMaterial = el.id.replace('price_', '');
    switch (theMaterial) {
        case "shingles":
            materials.shingles.cost = parseFloat(el.value);
            break;
        case "underlayment":
            materials.underlayment.cost = parseFloat(el.value);
            break;
        case "iceandwater":
            materials.iceandwatershield.cost = parseFloat(el.value);
            break;
        case "dripedge":
            materials.dripedge.cost = parseFloat(el.value);
            break;
        case "ridgecap":
            materials.ridgecap.cost = parseFloat(el.value);
            break;
        case "ridgevent":
            materials.ridgevent.cost = parseFloat(el.value);
            break;
        case "nails":
            materials.nails.cost = parseFloat(el.value);
            break;
    }

    //update
    updateMaterialTotal();
}

function updateMaterialOption(el) {
    var theMaterial = el.id.replace('option_', '');
    switch (theMaterial) {
        case "shingles":
            materials.shingles.waste = parseInt(el.value) / 100;
            break;
        case "iceandwater":
            materials.iceandwatershield.coverage = parseInt(el.value);
            break;
    }

    //update
    updateMaterialTotal();
}

function resetAutoQuantityCalculation() {
    materials.shingles.qty = 0;
    materials.underlayment.qty = 0;
    materials.iceandwatershield.qty = 0;
    materials.dripedge.qty = 0;
    materials.ridgecap.qty = 0;
    materials.ridgevent.qty = 0;
    materials.nails.qty = 0;

    //update
    updateMaterialTotal();
}