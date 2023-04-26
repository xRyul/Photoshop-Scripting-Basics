(function () {
    var vAlign;
    // 0 = top
    // 1 = middle
    // 2 = bottom
    vAlign = 1;

    if (!/photoshop/i.test(app.name)) {
        alert("Script for Photoshop", " ", false);
        return;
    }

    var doc;
    var guidesX = [];
    var guidesY = [];
    var i;
    var layer;
    var layerOffset = [0, 0];
    var scale;
    var scaleX;
    var scaleY;

    if (!app.documents.length) {
        alert("Open a document", " ", false);
        return;
    }

    var originalRulerUnits = app.preferences.rulerUnits;
    app.preferences.rulerUnits = Units.PIXELS;
    doc = app.activeDocument;

    // Create array of vertical guides, sorted from left to right.
    for (i = 0; i < doc.guides.length; i++) {
        if (doc.guides[i].direction == Direction.VERTICAL) {
            guidesX.push(parseInt(doc.guides[i].coordinate, 10));
        }
    }
    guidesX.sort(function (a, b) {
        return a - b;
    });

    // Create array of horizontal guides, sorted from top to bottom.
    for (i = 0; i < doc.guides.length; i++) {
        if (doc.guides[i].direction == Direction.HORIZONTAL) {
            guidesY.push(parseInt(doc.guides[i].coordinate, 10));
        }
    }
    guidesY.sort(function (a, b) {
        return a - b;
    });

    // Check for enough guides.
    if (guidesX.length < 2 || guidesY.length < 2) {
        alert("Not enough guides!", " ", true);
        return;
    }

    // Get bound of currently active layer.
    layer = doc.activeLayer;
    var layerBounds = layer.bounds;

    // Calculate scaling to fit layer into guides.
    scaleY = Number(guidesY[guidesY.length - 1] - guidesY[0]) / Number(layerBounds[3] - layerBounds[1]);
    scaleX = Number(guidesX[guidesX.length - 1] - guidesX[0]) / Number(layerBounds[2] - layerBounds[0]);

    // Use lowest of X and Y scale.
    scale = Math.min(scaleX, scaleY);

    // Scale layer.
    layer.resize(scale * 100, scale * 100, AnchorPosition.TOPLEFT);

    // Get the new layer bounds after scaling.
    var newLayerBounds = layer.bounds;

    // Calculate the vertical alignment offset based on vAlign value.
    var vAlignOffset = 0;
    var guidesHeight = guidesY[guidesY.length - 1] - guidesY[0];
    var layerHeight = newLayerBounds[3] - newLayerBounds[1];

    if (vAlign === 0) { // top
        vAlignOffset = 0;
    } else if (vAlign === 1) { // middle
        vAlignOffset = (guidesHeight - layerHeight) / 2;
    } else if (vAlign === 2) { // bottom
        vAlignOffset = guidesHeight - layerHeight;
    }

    // Translate the layer vertically based on the vAlign offset.
    layer.translate(0, guidesY[0] + vAlignOffset - newLayerBounds[1]);

    // Calculate the horizontal alignment offset.
    var guidesWidth = guidesX[guidesX.length - 1] - guidesX[0];
    var layerWidth = newLayerBounds[2] - newLayerBounds[0];
    var hAlignOffset = (guidesWidth - layerWidth) / 2;

    // Translate the layer horizontally based on the hAlign offset.
    layer.translate(guidesX[0] + hAlignOffset - newLayerBounds[0], 0);

    createSelectionFromGuides();
    
    function createSelectionFromGuides () {
        // Create an array of four coordinates for the selection.
        var selectionRef = [
            [guidesX[0], guidesY[0]], // top left
            [guidesX[0], guidesY[guidesY.length - 1]], // bottom left
            [guidesX[guidesX.length - 1], guidesY[guidesY.length - 1]], // bottom right
            [guidesX[guidesX.length - 1], guidesY[0]] // top right
        ];

        // Create a selection from the array.
        doc.selection.select(selectionRef);
    }

    // Call the function with the active document, layer and selection as arguments
    resizeLayerToFitSelection(app.activeDocument, app.activeDocument.activeLayer, app.activeDocument.selection);
    // Function that takes a document, a layer and a selection as parameters
    function resizeLayerToFitSelection(doc, layer, selection) {
        // Save the original ruler units
        var originalRulerUnits = app.preferences.rulerUnits;
        // Set the ruler units to pixels
        app.preferences.rulerUnits = Units.PIXELS;
        // Get the bounds of the selection
        var selectionBounds = selection.bounds;
        // Calculate the scaling factor required to fit the layer into the selection
        var scaleX = selectionBounds[2] / layer.bounds[2];
        var scaleY = selectionBounds[3] / layer.bounds[3];
        // Find the minimum scaling factor to maintain aspect ratio
        var minScale = Math.min(scaleX, scaleY);
        // Resize the layer using the calculated scaling factor, and maintain aspect ratio
        layer.resize(minScale * 100, minScale * 100, AnchorPosition.TOPLEFT);
        // Reposition the layer to align with the selection
        layer.translate(selectionBounds[0] - layer.bounds[0], selectionBounds[1] - layer.bounds[1]);
    }

    // Reset the ruler units.
    app.preferences.rulerUnits = originalRulerUnits;

})();