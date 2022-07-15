# Photoshop-Scripting-Basics

- Check how many documents are open
- Close
- Log any files processed in Photoshop into `.csv` e.g.: machine ID, user, username, filename etc. macOS
- Get computer name and username on macOS
- Save JPEG with Quality 12
- Save TIFF into subfolder without changing filename
- Save
- Simple and default canvas resize
- Resize Image based on the longest edge (If larger than 3000px then downscale it, if shorter then upscale it)
- Set ruler units to PIXELS
- Purge all cache
- Resize image with Resample method of Bicubic Sharper and custom size
- Delete alpha channel, delete guides, delete path items
- Flatten the document
- Reset swatch to black and white 
- Change Mode to RGB
- Convert to sRGB
- Select any tool in Photoshop / Select move tool/ Select blur tool / Select pen tool
- Create folder with Todays Date/ Current Date. Check if it exists
- Resize based on the longest edge based on input from the dialog box
- Deselect All
- Select any Layer by Name e.g. select and delete "Layer 0 copy"
- Rasterize the layer
- Duplicate active layer
- Check if Selection Exists and if so Expand it by 30px
- Select only transparent pixels
- Make the image square
- Expand Canvas / Canvas Manipulation
- Check if image is vertical or horizontal based on the longest edge
- Crop to selection "Without Delete Cropped Pixels"
- Select Subject
- Convert to smart object
- If/else | Check filename extension, and run the command if it is true 
- Get 1st two characters from the filename
- Get Document Name
- Content Aware Fill - NOT simple "Fill.."
- AutoCrop Utility by William Campbell
- Save TIFF with JPEG Compression 10, ZIP
- Select Gradient Tool

#### Check how many documents are open
```javascript
if (!documents.length) alert("No Open documents");
else alert(documents.length + " images opened");
```

#### Close 
```javascript
app.activeDocument.close();
```

#### Log any files processed in Photoshop into `.csv` e.g.: machine ID, user, username, filename etc.
```javascript
//Make sure it is macOS
function isMacOS() {
  return ($.os.toLowerCase().indexOf('mac') >= 0);
}

///////////////////////////////////////////Prepare for Logging///////////////////////////////////////////////
//Obtains the computers name/username. @returns {String} The name of the computers username.
function getUserName() {
  return (isMacOS()) ? $.getenv("USER") : $.getenv("USERNAME");
}

var userName = getUserName();
$.sleep(2325);

//Log Output
// Create the log file with Today's Date
var now = new Date();
var logfile_name = now.getFullYear() + "-" + ("0" + (now.getMonth() +1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2)

var f = new Folder(folderName + logfile_name);
if ( ! f.exists ) { //1st make sure the path exists, if not create it
        f.create(); //create folder
        var fileOut = new File(f+"/"+ userName +'-UploadedCR'+'.csv');
}else{
    //If "username-Uploaded.csv" already exists, then do nothing
}

//2nd make sure file is there, if not create one. And read through it. 
var fileOut = new File(f+"/"+ userName +'-UploadedCR'+'.csv');
fileOut.open("r");

    var str ="";
    while(!fileOut.eof)
    str += fileOut.readln();
    fileOut.close();

var n = str.match(docRef.name); //input what to search for

// Check if it was already exported
if (n) {
  //do nothing
} else {

      var fileOut = new File(f+"/"+ userName +'-UploadedCR'+'.csv');
      if (!fileOut.exists) {

              fileOut.open("w");
              fileOut.writeln(docRef.name);

              fileOut.close();
        } else {    

            fileOut.open("a+");
            fileOut.writeln(docRef.name);

            fileOut.close();
    }
}
```

#### Get computer name and username on macOS
```javascript
//Make sure it is macOS
function isMacOS() {
  return ($.os.toLowerCase().indexOf('mac') >= 0);
}

function getUserName() {
  return (isMacOS()) ? $.getenv("USER") : $.getenv("USERNAME");
}

var userName = getUserName();
```


#### Save JPEG with Quality 12
```javascript
folderJpegSave = "/Volumes/Custom/Location/Jpegsubfolder/";
var saveJPEG = new JPEGSaveOptions();
saveJPEG.embedColorProfile = true;
saveJPEG.formatOptions = FormatOptions.STANDARDBASELINE;
saveJPEG.quality = 12;
app.activeDocument.saveAs(new File(folderJpegSave + "/" + docRef.name), saveJPEG);
```

#### Save TIFF into subfolder without changing filename
```javscript
folderTiffSave = "/Volumes/Custom/Location/TIFFsubfolder/";

var saveTIFF = new TiffSaveOptions();
saveTIFF.embedColorProfile = true;
saveTIFF.layers = false;
saveTIFF.imageCompression = TIFFEncoding.TIFFLZW;
saveTIFF.alphaChannels = false;
app.activeDocument.saveAs(new File(folderTiffSave + "/" + docRef.name), saveTIFF);

```

#### Save
```javscript
app.activeDocument.save();
```

#### Simple and default canvas resize
```javascript
app.activeDocument.resizeCanvas(3000, 3000, AnchorPosition.MIDDLECENTER); //e..g anchor set to middle makes it square and expands it by 3k pixels
```

#### Resize Image based on the longest edge (If larger than 3000px then downscale it, if shorter then upscale it)
```javascript
var docRef = app.activeDocument; 
var fWidth = 3000;
var fHeight = 3000;
if (docRef.height > 3000 || docRef.width > 3000 || docRef.height < 3000 || docRef.width < 3000) {
  if (docRef.height > docRef.width) {
      docRef.resizeImage(null,UnitValue(fHeight,"px"),null,ResampleMethod.BICUBICSHARPER);
  } else {
      docRef.resizeImage(UnitValue(fWidth,"px"),null,null,ResampleMethod.BICUBICSHARPER);
  }
}
```

#### Set ruler units to PIXELS
```javascript
app.preferences.rulerUnits = Units.PIXELS;
```

#### Purge all cache
```javascript
app.purge(PurgeTarget.ALLCACHES);
```

#### Resize image with Resample method of Bicubic Sharper and custom size
```javascript
app.activeDocument.resizeImage(2000, 2000, 300, ResampleMethod.BICUBICSHARPER);
```

#### Delete alpha channel, delete guides, delete path items
```javascript
//v1
app.activeDocument.channels.removeAll();
app.activeDocument.guides.removeAll();
app.activeDocument.pathItems.removeAll();

//v2 - run only if they exist
var doc = app.activeDocument;
if (doc.channels.length > 3) {
    doc.channels.removeAll();
}

if (doc.guides.length > 0) {
    doc.guides.removeAll();
}

if (doc.pathItems.length > 0) {
    doc.pathItems.removeAll();
}
```

#### Flatten the document
```javascript
app.activeDocument.flatten();
```

#### Reset swatch to black and white 
```javascript
app.backgroundColor.rgb.hexValue = "FFFFFF"; // will keep expanded background white
app.foregroundColor.rgb.hexValue = "000000";
```

### Change Mode to RGB
```javascript
docRef.changeMode(ChangeMode.RGB);
```

#### Convert to sRGB
```javascript
app.activeDocument.convertProfile( "sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, true ); // Convert to sRGB
```

#### Select any tool in Photoshop / Select move tool/ Select blur tool / Select pen tool
```javascript
selectTool('moveTool');
//selectTool('marqueeRectTool');
//selectTool('marqueeEllipTool');
//selectTool('marqueeSingleRowTool');
//selectTool('marqueeSingleColumnTool');
//selectTool('lassoTool');
//selectTool('polySelTool');
//selectTool('magneticLassoTool');
//selectTool('quickSelectTool');
//selectTool('magicWandTool');
//selectTool('cropTool');
//selectTool('sliceTool');
//selectTool('sliceSelectTool');
//selectTool('spotHealingBrushTool');
//selectTool('magicStampTool');
//selectTool('patchSelection');
//selectTool('redEyeTool');
//selectTool('paintbrushTool');
//selectTool('pencilTool');
//selectTool('colorReplacementBrushTool');
//selectTool('cloneStampTool');
//selectTool('patternStampTool');
//selectTool('historyBrushTool');
//selectTool('artBrushTool');
//selectTool('eraserTool');
//selectTool('backgroundEraserTool');
//selectTool('magicEraserTool');
//selectTool('gradientTool');
//selectTool('bucketTool');
//selectTool('blurTool');
//selectTool('sharpenTool');
//selectTool('smudgeTool');
//selectTool('dodgeTool');
//selectTool('burnInTool');
//selectTool('saturationTool');
//selectTool('penTool');
//selectTool('freeformPenTool');
//selectTool('addKnotTool');
//selectTool('deleteKnotTool');
//selectTool('convertKnotTool');
//selectTool('typeCreateOrEditTool');
//selectTool('typeVerticalCreateOrEditTool');
//selectTool('typeCreateMaskTool');
//selectTool('typeVerticalCreateMaskTool');
//selectTool('pathComponentSelectTool');
//selectTool('directSelectTool');
//selectTool('rectangleTool');
//selectTool('roundedRectangleTool');
//selectTool('ellipseTool');
//selectTool('polygonTool');
//selectTool('lineTool');
//selectTool('customShapeTool');
//selectTool('textAnnotTool');
//selectTool('soundAnnotTool');
//selectTool('eyedropperTool');
//selectTool('colorSamplerTool');
//selectTool('rulerTool');
//selectTool('handTool');
//selectTool('zoomTool');

// Replace selectTool(tool) where the "tool" is any tool name from the above list
function selectTool(tool) {
    var desc9 = new ActionDescriptor();
        var ref7 = new ActionReference();
        ref7.putClass( app.stringIDToTypeID(tool) );
    desc9.putReference( app.charIDToTypeID('null'), ref7 );
    executeAction( app.charIDToTypeID('slct'), desc9, DialogModes.NO );
};

```

#### Create folder with Todays Date/ Current Date. Check if it exists
```javascript
var d = new Date(); 
var backupFolder = Folder("~/desktop/Backup"+"/"+""+d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+"/"+"NewFolderName" );
if(!backupFolder.exists) {
	backupFolder.create();
}

```

#### Resize based on the longest edge based on input from the dialog box
```javascript
//Resize the image based on the Longest Edge
//Ask for desired Longest Edge Size
//Resample with Preserve Detail 2.0

try {
	var doc = app.activeDocument;
} catch(e) {
    var noDocs = false;    
} if (noDocs== false){
    alert ("No documents open")
} else {

	// New UI window
	var cal = new Window ("dialog", "Resize x Longest Edge");
	var cal_char = cal.add("edittext", [25,40,135,60], "");

	// buttons
	var btnGroup = cal.add ("group");
	btnGroup.orientation = "row";
	btnGroup.alignment = "center";
	btnGroup.add ("button", undefined, "OK");
	btnGroup.add ("button", undefined, "Cancel")
	cal.center();

	var myReturn = cal.show();

	if (myReturn == 1)
	{
	    // set checkboxes and input here
	    var chars = cal_char.text;
	}

	y = doc.width.value;
	x = doc.height.value;

	var longestEdge = x;
	var longestEdge = y;

	var longestEdge = chars;

	if (x > y) {
		//PORTRAIT MODE
		//Resample 2.0 - If it is in Pprtrait mode - resize Longest edge to 2750px
		var idImgS = charIDToTypeID( "ImgS" );
			var desc35 = new ActionDescriptor();
			var idHght = charIDToTypeID( "Hght" );
			var idPxl = charIDToTypeID( "#Pxl" );
			desc35.putUnitDouble( idHght, idPxl, longestEdge );
			var idscaleStyles = stringIDToTypeID( "scaleStyles" );
			desc35.putBoolean( idscaleStyles, true );
			var idCnsP = charIDToTypeID( "CnsP" );
			desc35.putBoolean( idCnsP, true );
			var idIntr = charIDToTypeID( "Intr" );
			var idIntp = charIDToTypeID( "Intp" );
			var iddeepUpscale = stringIDToTypeID( "deepUpscale" );
			desc35.putEnumerated( idIntr, idIntp, iddeepUpscale );
			var idNose = charIDToTypeID( "Nose" );
			desc35.putInteger( idNose, 100 );
		executeAction( idImgS, desc35, DialogModes.NO );

	} else {
		//LANDSCAPE MODE
		//Resample 2.0 - If it is in Landscape mode - resize Longest edge to 2750px
		var idImgS = charIDToTypeID( "ImgS" );
			var desc46 = new ActionDescriptor();
			var idWdth = charIDToTypeID( "Wdth" );
			var idPxl = charIDToTypeID( "#Pxl" );
			desc46.putUnitDouble( idWdth, idPxl, longestEdge );
			var idscaleStyles = stringIDToTypeID( "scaleStyles" );
			desc46.putBoolean( idscaleStyles, true );
			var idCnsP = charIDToTypeID( "CnsP" );
			desc46.putBoolean( idCnsP, true );
			var idIntr = charIDToTypeID( "Intr" );
			var idIntp = charIDToTypeID( "Intp" );
			var iddeepUpscale = stringIDToTypeID( "deepUpscale" );
			desc46.putEnumerated( idIntr, idIntp, iddeepUpscale );
			var idNose = charIDToTypeID( "Nose" );
			desc46.putInteger( idNose, 100 );
		executeAction( idImgS, desc46, DialogModes.NO );

	}
}
```

#### Deselect all
```javascript
app.activeDocument.selection.deselect();
```

#### Select any Layer by Name e.g. select and delete "Layer 0 copy"
```javascript
// =============Delete Rasterized Layer=================
//Select specific layer and remove it 
//Source: https://stackoverflow.com/questions/46928630/set-layer-active-photoshop-script
select_layer("Layer 0 copy");
app.activeDocument.activeLayer.remove();


function select_layer(id, add, viz)
{  
try {
    var d = new ActionDescriptor();
    if (viz == undefined) viz = false;
    var r = new ActionReference();
    if (typeof(id) == "string") r.putName( charIDToTypeID( "Lyr " ), id);
    else                        r.putIdentifier( charIDToTypeID( "Lyr " ), id);

    d.putReference( charIDToTypeID( "null" ), r );
    d.putBoolean( charIDToTypeID( "MkVs" ), viz );

    if (add == true) d.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "addToSelection" ) );
    if (add == -1)   d.putEnumerated( stringIDToTypeID( "selectionModifier" ), stringIDToTypeID( "selectionModifierType" ), stringIDToTypeID( "removeFromSelection" ) );
    var ok = true;

    try { executeAction( charIDToTypeID( "slct" ), d, DialogModes.NO ); } catch(e) { ok = false; }

    d = null;

    return ok;
    }
catch (e) { alert(e); return false; }
}
```

#### Rasterize the layer
```javascript
// =============Rasterize the layer=======================
newLayer.rasterize(RasterizeType.ENTIRELAYER);
```

#### Duplicate active layer
```javascript
// =============Duplicate Smart Object=================
var newLayer = app.activeDocument.activeLayer.duplicate();
```

#### Check if Selection Exists and if so Expand it by 30px
```javascript
// =============Epand Selection by 30px=================
//Check if Selection Exists and if so Expand it by 30px
//Source: 
//https://community.adobe.com/t5/photoshop-ecosystem-discussions/photoshop-script-for-expand-contract-of-selection/m-p/6718514
//==========================
try {

        // test for active selection
        if (hasSelection(app.activeDocument)) {
            // expand selection
            app.activeDocument.selection.expand(new UnitValue (30, "px"))   
            // contract selection
            // app.activeDocument.selection.contract(new UnitValue (100, "px"))
            }
        else {
            // alert ("ERROR: no active selection \n USAGE: the script requires an active selection")
            }
    }
catch (e) {
        alert ("ERROR: the script did not execute")
    }

//////////// FUNCTIONS ////////////
function hasSelection(doc) {
  var res = false;
  var as = doc.activeHistoryState;
  doc.selection.deselect();
  if (as != doc.activeHistoryState) {
    res = true;
    doc.activeHistoryState = as;
  }
    return res;
}
```

#### Select only transparent pixels
```javascript
// =============Select only transparent pixels=================
SelectTransparency();

function SelectTransparency(){
    var idChnl = charIDToTypeID( "Chnl" );

    var actionSelect = new ActionReference();
    actionSelect.putProperty( idChnl, charIDToTypeID( "fsel" ) );     

    var actionTransparent = new ActionReference();    
    actionTransparent.putEnumerated( idChnl, idChnl, charIDToTypeID( "Trsp" ) );

    var actionDesc = new ActionDescriptor();
    actionDesc.putReference( charIDToTypeID( "null" ), actionSelect );
    actionDesc.putReference( charIDToTypeID( "T   " ), actionTransparent );

    executeAction( charIDToTypeID( "setd" ), actionDesc, DialogModes.NO );

    app.activeDocument.selection.invert();
}
```


#### Make the image square
```javascript
//Make CANVAS square

app.preferences.rulerUnits = Units.PIXELS;

app.backgroundColor.rgb.hexValue = "FFFFFF"; // will keep expanded background white
app.foregroundColor.rgb.hexValue = "000000";

var doc = activeDocument;
doc.resizeCanvas(Math.max(doc.width,doc.height),Math.max(doc.width,doc.height))
```

#### Expand Canvas / Expand Canvas / Canvas Manipulation
```javascript
//Now ready to manipulate the canvas
// replace pixels count within var "descXX.putUnitDouble" to your desired value
// =====================Canvas================================
// Bottom
var idCnvS = charIDToTypeID( "CnvS" );
    var desc42 = new ActionDescriptor();
    var idRltv = charIDToTypeID( "Rltv" );
    desc42.putBoolean( idRltv, true );
    var idHght = charIDToTypeID( "Hght" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc42.putUnitDouble( idHght, idPxl, 1595.000000 );
    var idVrtc = charIDToTypeID( "Vrtc" );
    var idVrtL = charIDToTypeID( "VrtL" );
    var idBttm = charIDToTypeID( "Bttm" );
    desc42.putEnumerated( idVrtc, idVrtL, idBttm );
executeAction( idCnvS, desc42, DialogModes.NO );

// =======================================================
//Top
var idCnvS = charIDToTypeID( "CnvS" );
    var desc47 = new ActionDescriptor();
    var idRltv = charIDToTypeID( "Rltv" );
    desc47.putBoolean( idRltv, true );
    var idHght = charIDToTypeID( "Hght" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc47.putUnitDouble( idHght, idPxl, 530.000000 );
    var idVrtc = charIDToTypeID( "Vrtc" );
    var idVrtL = charIDToTypeID( "VrtL" );
    var idTop = charIDToTypeID( "Top " );
    desc47.putEnumerated( idVrtc, idVrtL, idTop );
executeAction( idCnvS, desc47, DialogModes.NO );

// =======================================================
//Left
var idCnvS = charIDToTypeID( "CnvS" );
    var desc52 = new ActionDescriptor();
    var idRltv = charIDToTypeID( "Rltv" );
    desc52.putBoolean( idRltv, true );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc52.putUnitDouble( idWdth, idPxl, 1558.000000 );
    var idHrzn = charIDToTypeID( "Hrzn" );
    var idHrzL = charIDToTypeID( "HrzL" );
    var idLeft = charIDToTypeID( "Left" );
    desc52.putEnumerated( idHrzn, idHrzL, idLeft );
executeAction( idCnvS, desc52, DialogModes.NO );

// =======================================================
// Right
var idCnvS = charIDToTypeID( "CnvS" );
    var desc114 = new ActionDescriptor();
    var idRltv = charIDToTypeID( "Rltv" );
    desc114.putBoolean( idRltv, true );
    var idWdth = charIDToTypeID( "Wdth" );
    var idPxl = charIDToTypeID( "#Pxl" );
    desc114.putUnitDouble( idWdth, idPxl, 1558.000000 );
    var idHrzn = charIDToTypeID( "Hrzn" );
    var idHrzL = charIDToTypeID( "HrzL" );
    var idRght = charIDToTypeID( "Rght" );
    desc114.putEnumerated( idHrzn, idHrzL, idRght );
executeAction( idCnvS, desc114, DialogModes.NO );
```

#### Check if image is vertical or horizontal based on the longest edge
```javascript
doc = app.activeDocument;
y = doc.width.value;
x = doc.height.value;
if (x > y) {
  // It is Portrait
  ...
} else {
  // It is Landscape
}

```

#### Crop to selection "Without Delete Cropped Pixels"
```javascript
// =================Crop to Selection=================
// Crop to selection "Without Delete Cropped Pixels"
var doc = activeDocument;

try {
    var bound = doc.selection.bounds
    cropToSelection(bound[1], bound[0], bound[3], bound[2])
} catch (e) {}
function cropToSelection(top, left, bottom, right) {
    var idCrop = charIDToTypeID("Crop");
    var desc11 = new ActionDescriptor();
    var idT = charIDToTypeID("T   ");
    var desc12 = new ActionDescriptor();
    var idTop = charIDToTypeID("Top ");
    var idPxl = charIDToTypeID("#Pxl");
    desc12.putUnitDouble(idTop, idPxl, top);
    var idLeft = charIDToTypeID("Left");
    var idPxl = charIDToTypeID("#Pxl");
    desc12.putUnitDouble(idLeft, idPxl, left);
    var idBtom = charIDToTypeID("Btom");
    var idPxl = charIDToTypeID("#Pxl");
    desc12.putUnitDouble(idBtom, idPxl, bottom);
    var idRght = charIDToTypeID("Rght");
    var idPxl = charIDToTypeID("#Pxl");
    desc12.putUnitDouble(idRght, idPxl, right);
    var idRctn = charIDToTypeID("Rctn");
    desc11.putObject(idT, idRctn, desc12);
    var idAngl = charIDToTypeID("Angl");
    var idAng = charIDToTypeID("#Ang");
    desc11.putUnitDouble(idAngl, idAng, 0.000000);
    var idDlt = charIDToTypeID("Dlt ");
    desc11.putBoolean(idDlt, false);
    var idcropAspectRatioModeKey = stringIDToTypeID("cropAspectRatioModeKey");
    var idcropAspectRatioModeClass = stringIDToTypeID("cropAspectRatioModeClass");
    var idtargetSize = stringIDToTypeID("targetSize");
    desc11.putEnumerated(idcropAspectRatioModeKey, idcropAspectRatioModeClass, idtargetSize);
    executeAction(idCrop, desc11, DialogModes.NO);
}
```

#### Select Subject
```javascript
// =================Select Subject=================
var idautoCutout = stringIDToTypeID( "autoCutout" );
    var desc10 = new ActionDescriptor();
    var idsampleAllLayers = stringIDToTypeID( "sampleAllLayers" );
    desc10.putBoolean( idsampleAllLayers, false );
executeAction( idautoCutout, desc10, DialogModes.NO );
```

#### Convert to smart object
```javascript
// =============== Convert to Smart Object=========
var idnewPlacedLayer = stringIDToTypeID( "newPlacedLayer" );
executeAction( idnewPlacedLayer, undefined, DialogModes.NO );
```

#### If/else | Check filename extension, and run the command if it is true 
```javascript
if () {
  ...
} else {
  ...
}

//e.g.: If extension is tif, jpg, or psd
if (defaultName.indexOf('_01.tif') != -1 
    || defaultName.indexOf('_01.psd') != -1 
    || defaultName.indexOf('_01.tiff') != -1
    || defaultName.indexOf('_01.png') != -1
    || defaultName.indexOf('_01.jpg') != -1) {
    
    <COMMAND>
    
}

```

#### Get 1st two characters from the filename / get first 2 digits from the filename
```javascript
doc = app.activeDocument;
defaultName = doc.name;

// Check Department
var firstTwoDigits = doc.name.slice(0,2);
```

#### get document/file name 
```javascript
doc = app.activeDocument;
defaultName = doc.name;
```

#### Content Aware Fill - NOT simple "Fill.."
```javascript
// ====================Content Aware Fill - NOT simpel "Fill.."===================================
cafWorkspace(false, false, false);

function cafWorkspace(cafSampleAllLayers, cafScale, cafMirror) {
    var s2t = function (s) {
        return app.stringIDToTypeID(s);
    };

    var descriptor = new ActionDescriptor();

    descriptor.putEnumerated( s2t( "cafSamplingRegion" ), s2t( "cafSamplingRegion" ), s2t( "cafSamplingRegionAuto" ));
    descriptor.putBoolean( s2t( "cafSampleAllLayers" ), cafSampleAllLayers );
    descriptor.putEnumerated( s2t( "cafColorAdaptationLevel" ), s2t( "cafColorAdaptationLevel" ), s2t( "cafColorAdaptationDefault" ));
    descriptor.putEnumerated( s2t( "cafRotationAmount" ), s2t( "cafRotationAmount" ), s2t( "cafRotationAmountNone" ));
    descriptor.putBoolean( s2t( "cafScale" ), cafScale );
    descriptor.putBoolean( s2t( "cafMirror" ), cafMirror );
    descriptor.putEnumerated( s2t( "cafOutput" ), s2t( "cafOutput" ), s2t( "cafOutputToNewLayer" ));
    executeAction( s2t( "cafWorkspace" ), descriptor, DialogModes.NO );
}
```


#### AutoCrop Utility by William Campbell
- Empty

#### Save TIFF with JPEG Compression 10, ZIP
```javascript
//Save TIFF as JPEG Compression 10, ZIP

saveTIFFasJPEG ();

function saveTIFFasJPEG() {
    // Start======================================================
    save(10, File( app.activeDocument.path ), true);
    function save(extendedQuality, In, lowerCase) {
        var c2t = function (s) {
            return app.charIDToTypeID(s);
        };

        var s2t = function (s) {
            return app.stringIDToTypeID(s);
        };

        var descriptor = new ActionDescriptor();
        var descriptor2 = new ActionDescriptor();

        descriptor2.putEnumerated( s2t( "byteOrder" ), s2t( "platform" ), s2t( "macintosh" ));
        descriptor2.putEnumerated( s2t( "encoding" ), s2t( "encoding" ), c2t( "JPEG" ));
        descriptor2.putInteger( s2t( "extendedQuality" ), extendedQuality );
        descriptor2.putEnumerated( s2t( "layerCompression" ), s2t( "encoding" ), s2t( "zip" ));
        descriptor.putObject( s2t( "as" ), c2t( "TIFF" ), descriptor2 );
        descriptor.putPath( c2t( "In  " ), In );
        descriptor.putInteger( s2t( "documentID" ), 219 );
        descriptor.putBoolean( s2t( "lowerCase" ), lowerCase );
        descriptor.putEnumerated( s2t( "saveStage" ), s2t( "saveStageType" ), s2t( "saveBegin" ));
        executeAction( s2t( "save" ), descriptor, DialogModes.NO );
    }

    // Finish======================================================
    save2(10, File( app.activeDocument.path ), true);
    function save2(extendedQuality, In, lowerCase) {
        var c2t = function (s) {
            return app.charIDToTypeID(s);
        };

        var s2t = function (s) {
            return app.stringIDToTypeID(s);
        };

        var descriptor = new ActionDescriptor();
        var descriptor2 = new ActionDescriptor();

        descriptor2.putEnumerated( s2t( "byteOrder" ), s2t( "platform" ), s2t( "macintosh" ));
        descriptor2.putEnumerated( s2t( "encoding" ), s2t( "encoding" ), c2t( "JPEG" ));
        descriptor2.putInteger( s2t( "extendedQuality" ), extendedQuality );
        descriptor2.putEnumerated( s2t( "layerCompression" ), s2t( "encoding" ), s2t( "zip" ));
        descriptor.putObject( s2t( "as" ), c2t( "TIFF" ), descriptor2 );
        descriptor.putPath( c2t( "In  " ), In );
        descriptor.putInteger( s2t( "documentID" ), 219 );
        descriptor.putBoolean( s2t( "lowerCase" ), lowerCase );
        descriptor.putEnumerated( s2t( "saveStage" ), s2t( "saveStageType" ), s2t( "saveSucceeded" ));
        executeAction( s2t( "save" ), descriptor, DialogModes.NO );
    }
}


```



#### Select Gradient Tool
```javascript
function selectTool(tool){
    var desc9 = new ActionDescriptor();
        var ref7 = new ActionReference();
        ref7.putClass( app.stringIDToTypeID(tool) );
    desc9.putReference( app.charIDToTypeID('null'), ref7 );
    executeAction( app.charIDToTypeID('slct'), desc9, DialogModes.NO );
};

selectTool('gradientTool');

```

