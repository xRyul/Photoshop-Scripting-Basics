
//////////////////////////////////////////////////////////////// Option 1. STRAIGHTEN FRANCE
// var strtRulerUnits = preferences.rulerUnits
// preferences.rulerUnits = Units.PIXELS

// // // =======================================================
// var id199 = charIDToTypeID("Rtte");
// var desc55 = new ActionDescriptor();
// var id200 = charIDToTypeID("null");
// var ref11 = new ActionReference();
// var id201 = charIDToTypeID("Dcmn");
// var id202 = charIDToTypeID("Ordn");
// var id203 = charIDToTypeID("Frst");
// ref11.putEnumerated(id201, id202, id203);
// desc55.putReference(id200, ref11);
// var id204 = charIDToTypeID("Angl");
// var id205 = charIDToTypeID("#Ang");
// desc55.putUnitDouble(id201, id204, id205);
// var debutAngle = executeAction(id199, desc55, DialogModes.NO);

// preferences.rulerUnits = strtRulerUnits;

/////////////////////////////////////////////////////////////////// Option 2. STRAIGHTEN official by PS reduced
$.localize = true;

var g_StackScriptFolderPath =
  app.path +
  "/" +
  localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") +
  "/" +
  localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");

$.evalFile(g_StackScriptFolderPath + "Geometry.jsx");
$.evalFile(g_StackScriptFolderPath + "Terminology.jsx");

function Straightener() {
  this.pluginName = "Straighten";
}

var straighten = new Straightener();

straighten.getUnitPoint = function (desc) {
  var x = desc.getUnitDoubleValue(kxStr);
  var y = desc.getUnitDoubleValue(kyStr);
  return new TPoint(x, y);
};

straighten.clearRuler = function () {
  var desc = new ActionDescriptor();
  var eventClearRuler = app.stringIDToTypeID("clearRuler");
  executeAction(eventClearRuler, desc, DialogModes.NO);
};

straighten.getRulerEndpoints = function () {
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putProperty(classProperty, krulerPointsStr);
  ref1.putEnumerated(classDocument, typeOrdinal, enumTarget);
  desc1.putReference(typeNULL, ref1);

  var result = executeAction(eventGet, desc1, DialogModes.NO);

  if (result.hasKey(kpointsStr)) {
    var i,
      ptList = result.getList(kpointsStr);

    var p0 = this.getUnitPoint(ptList.getObjectValue(0));
    var p1 = this.getUnitPoint(ptList.getObjectValue(2));
    if (p0.fX < p1.fX) return [p0, p1];
    else return [p1, p0];
  } else return [];
};

straighten.getRotationAngle = function (p0, p1) {
  if (p0.fX == p1.fX || p0.fY == p1.fY) return 0.0;

  var a,
    t,
    v = p1 - p0;
  if (Math.abs(v.fY) > Math.abs(v.fX)) {
    t = v.fX;
    v.fX = v.fY;
    v.fY = t;
    if (v.fX < 0) {
      v.fX = -v.fX;
      a = v.vectorAngle();
    } else a = -v.vectorAngle();
  } else a = v.vectorAngle();

  return -a;
};

straighten.getRulerAngle = function () {
  var rulerPts = this.getRulerEndpoints();
  if (rulerPts.length == 0) return 0.0;

  return this.getRotationAngle(rulerPts[0], rulerPts[1]);
};

straighten.rotateLayerToRuler = function () {
  var angle = this.getRulerAngle();

  if (angle == 0.0) return;

  if (!app.activeDocument.activeLayer.visible) {
    alert(
      localize(
        "$$$/Straighten/StraightenHiddenLayer=Could not straighten the layer because the target layer is hidden."
      )
    );
    return;
  }

  layerRef = app.activeDocument.activeLayer;
  layerRef.rotate((angle * 180.0) / Math.PI);
};

if (
  typeof runstraightenFromScript == "undefined" ||
  runstraightenFromScript == false
)
straighten.rotateLayerToRuler();



//////////////////////////////////////////////////////////////// Option 3. STRAIGHTEN & CROP
// CropStraighten();
// function CropStraighten() {
// 	executeAction( stringIDToTypeID('CropPhotosAuto0002'), undefined, DialogModes.NO );
// };


//////////////////////////////////////////////////////////////// Option 4. STRAIGHTEN based on floor line
// https://community.adobe.com/t5/photoshop-ecosystem-discussions/how-do-i-automatically-straighten-the-horizon-in-a-photo/m-p/13483377
// ///////////////////////////////////////////////////////////////////////////////////////////
// var apl = new AM('application'),
//     doc = new AM('document'),
//     lr = new AM('layer'),
//     floorY = [];
// const ERR_RATE = 5;
// // try {
//     if (apl.getProperty('numberOfDocuments')) {
//         var docRes = doc.getProperty('resolution'),
//             docW = doc.getProperty('width') * docRes / 72,
//             docH = doc.getProperty('height') * docRes / 72;
//         activeDocument.suspendHistory('Find floor line', 'function() {}')
//         activeDocument.suspendHistory('Get left stripe', 'measureDocument(floorY)')
//         doc.stepBack();
//         activeDocument.suspendHistory('Get right stripe', 'measureDocument(floorY)')
//         doc.stepBack();
//         activeDocument.suspendHistory('Rotate Document', 'rotateDocument()')
//     }
// // } catch (e) { alert('A lot of things can go wrong in this script. :(\n\n' + e) }
// function measureDocument(floor) {
//     doc.flatten()
//     doc.convertToGrayscale();
//     floor.length ? doc.selectStrip(0, docW - 1, docH, docW) : doc.selectStrip(0, 0, docH, 1)
//     doc.crop()
//     var f = new File(Folder.temp + '/colors.raw');
//     doc.saveToRAW(f)
//     floor.push(findFloor(f));
// }
// function rotateDocument() {
//     var title = lr.getProperty('name'),
//         id = lr.getProperty('layerID')
//     lr.duplicate(title)
//     lr.deleteLayer(id)
//     lr.rotate(Math.atan2(floorY[1] - floorY[0], docW) * 180 / Math.PI)
// }
// function findFloor(f) {
//     var content = '';
//     if (f.exists) {
//         f.open('r');
//         f.encoding = "BINARY";
//         content = f.read();
//         f.close();
//         f.remove();
//         var colors = function (s) {
//             var m = 0, c = [];
//             for (var i = 0; i < s.length; i++) {
//                 var k = s.charCodeAt(i); m += k; c.push(k)
//             };
//             return { colors: c, median: m / s.length }
//         }(content),
//             dE = function (c) {
//                 var m = 0; d = [];
//                 for (var i = 0; i < c.colors.length; i++) {
//                     var k = Math.sqrt(Math.pow(c.median - c.colors[i], 2)); d.push(k); m += k
//                 };
//                 return { dE: d, median: m / c.colors.length }
//             }(colors),
//             threshold = function (dE) {
//                 var t = [];
//                 for (var i = 0; i < dE.dE.length; i++)
//                     t.push(dE.dE[i] > dE.median ? 1 : 0);
//                 return t.reverse();
//             }(dE);
//         var height = 0,
//             err = 0;
//         for (var i = 0; i < threshold.length; i++) {
//             height++
//             if (threshold[i] == 1) {
//                 err = 0
//             } else {
//                 err++
//                 if (err >= ERR_RATE) {
//                     height -= err;
//                     break;
//                 }
//             }
//         }
//     }
//     return height;
// }
// function AM(target) {
//     var s2t = stringIDToTypeID,
//         t2s = typeIDToStringID;
//     target = target ? s2t(target) : null;
//     this.getProperty = function (property, id, idxMode) {
//         property = s2t(property);
//         (r = new ActionReference()).putProperty(s2t('property'), property);
//         id != undefined ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id)) :
//             r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
//         return getDescValue(executeActionGet(r), property)
//     }
//     this.hasProperty = function (property, id, idxMode) {
//         property = s2t(property);
//         (r = new ActionReference()).putProperty(s2t('property'), property);
//         id ? (idxMode ? r.putIndex(target, id) : r.putIdentifier(target, id))
//             : r.putEnumerated(target, s2t('ordinal'), s2t('targetEnum'));
//         return executeActionGet(r).hasKey(property)
//     }
//     this.convertToGrayscale = function () {
//         (d = new ActionDescriptor()).putClass(s2t("to"), s2t("grayscaleMode"));
//         executeAction(s2t("convertMode"), d, DialogModes.NO);
//     }
//     this.selectStrip = function (top, left, bottom, right) {
//         (r = new ActionReference()).putProperty(s2t("channel"), s2t("selection"));
//         (d = new ActionDescriptor()).putReference(s2t("null"), r);
//         (d1 = new ActionDescriptor()).putUnitDouble(s2t("top"), s2t("pixelsUnit"), top);
//         d1.putUnitDouble(s2t("left"), s2t("pixelsUnit"), left);
//         d1.putUnitDouble(s2t("bottom"), s2t("pixelsUnit"), bottom);
//         d1.putUnitDouble(s2t("right"), s2t("pixelsUnit"), right);
//         d.putObject(s2t("to"), s2t("rectangle"), d1);
//         executeAction(s2t("set"), d, DialogModes.NO);
//     }
//     this.flatten = function () {
//         executeAction(s2t("flattenImage"), new ActionDescriptor(), DialogModes.NO);
//     }
//     this.crop = function () {
//         (d = new ActionDescriptor()).putBoolean(s2t("delete"), true);
//         executeAction(s2t("crop"), d, DialogModes.NO);
//     }
//     this.saveToRAW = function (f) {
//         (d = new ActionDescriptor()).putBoolean(s2t('copy'), true);
//         (d1 = new ActionDescriptor()).putObject(s2t("as"), s2t("rawFormat"), d);
//         d1.putPath(s2t("in"), f);
//         executeAction(s2t("save"), d1, DialogModes.NO);
//     }
//     this.stepBack = function () {
//         (r = new ActionReference()).putEnumerated(charIDToTypeID('HstS'), s2t('ordinal'), s2t('previous'));
//         (d = new ActionDescriptor()).putReference(s2t('null'), r);
//         executeAction(s2t('select'), d, DialogModes.NO);
//     }
//     this.duplicate = function (title) {
//         (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
//         (d = new ActionDescriptor()).putReference(s2t("null"), r);
//         d.putString(s2t("name"), title);
//         executeAction(s2t("duplicate"), d, DialogModes.NO);
//     }
//     this.deleteLayer = function (id) {
//         (r = new ActionReference()).putIdentifier(s2t("layer"), id);
//         (d = new ActionDescriptor()).putReference(s2t("null"), r);
//         executeAction(s2t("delete"), d, DialogModes.NO);
//     }
//     this.rotate = function (angle) {
//         (r = new ActionReference()).putEnumerated(s2t("layer"), s2t("ordinal"), s2t("targetEnum"));
//         (d = new ActionDescriptor()).putReference(s2t("null"), r);
//         d.putEnumerated(s2t("freeTransformCenterState"), s2t("quadCenterState"), s2t("QCSAverage"));
//         d.putUnitDouble(s2t("angle"), s2t("angleUnit"), angle);
//         d.putEnumerated(s2t("interfaceIconFrameDimmed"), s2t("interpolationType"), s2t("bicubic"));
//         executeAction(s2t("transform"), d, DialogModes.NO);
//     }
//     function getDescValue(d, p) {
//         switch (d.getType(p)) {
//             case DescValueType.OBJECTTYPE: return { type: t2s(d.getObjectType(p)), value: d.getObjectValue(p) };
//             case DescValueType.LISTTYPE: return d.getList(p);
//             case DescValueType.REFERENCETYPE: return d.getReference(p);
//             case DescValueType.BOOLEANTYPE: return d.getBoolean(p);
//             case DescValueType.STRINGTYPE: return d.getString(p);
//             case DescValueType.INTEGERTYPE: return d.getInteger(p);
//             case DescValueType.LARGEINTEGERTYPE: return d.getLargeInteger(p);
//             case DescValueType.DOUBLETYPE: return d.getDouble(p);
//             case DescValueType.ALIASTYPE: return d.getPath(p);
//             case DescValueType.CLASSTYPE: return d.getClass(p);
//             case DescValueType.UNITDOUBLE: return (d.getUnitDoubleValue(p));
//             case DescValueType.ENUMERATEDTYPE: return { type: t2s(d.getEnumerationType(p)), value: t2s(d.getEnumerationValue(p)) };
//             default: break;
//         };
//     }
// }

////////////////////////////////////////////////////////////////////////////// Option 5. Straighten based on PathItems (1st and Last. It might have many path anchor points)
// var pathItem = app.activeDocument.pathItems[0];
// var subPath = pathItem.subPathItems[0];
// var points = subPath.pathPoints;
// var startPoint = points[0].anchor;
// var endPoint = points[points.length-1].anchor;

// var deltaX = endPoint[0] - startPoint[0];
// var deltaY = endPoint[1] - startPoint[1];
// var angleInRadians = Math.atan2(deltaY, deltaX);
// var angleInDegrees = angleInRadians * 180 / Math.PI;

// // Get the active layer
// var layerRef = app.activeDocument.activeLayer;

// if (angleInDegrees > 51) {
//     layerRef.rotate(90 - angleInDegrees);
// } else if (angleInDegrees < 51) {
//     layerRef.rotate(-angleInDegrees);
// }