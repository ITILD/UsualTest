Cesium.Math.setRandomNumberSeed(1234);

var viewer = new Cesium.Viewer("cesiumContainer", { infoBox: false });
var entities = viewer.entities;

var i;
var height;
var positions;
var stripeMaterial = new Cesium.StripeMaterialProperty({
  evenColor: Cesium.Color.WHITE.withAlpha(0.5),
  oddColor: Cesium.Color.BLUE.withAlpha(0.5),
  repeat: 5.0,
});

entities.add({
  rectangle: {
    coordinates: Cesium.Rectangle.fromDegrees(
      -118.0,
      38.0,
      -116.0,
      40.0
    ),
    extrudedHeight: 500000.0,
    outline: true,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 4,
    stRotation: Cesium.Math.toRadians(45),
    material: Cesium.Color.fromRandom({ alpha: 0.6 }),
  },
});

// ----------------------------------带高程
entities.add({
  polygon: {
    hierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        -118.0,
        30.0,
        -115.0,
        30.0,
        -117.1,
        31.1,
        -118.0,
        33.0,
      ])
    ),
    height: 300000.0,
    extrudedHeight: 700000.0,
    outline: true,
    outlineColor: Cesium.Color.WHITE,
    outlineWidth: 4,
    material: Cesium.Color.fromRandom({ alpha: 0.8 }),
  },
});




entities.add({
  polygon: {
    hierarchy: new Cesium.PolygonHierarchy(
      Cesium.Cartesian3.fromDegreesArray([
        -113.0,
        30.0,
        -110.0,
        30.0,
        -110.0,
        33.0,
        -111.5,
        31.0,
        -113.0,
        33.0,
      ])
    ),
    extrudedHeight: 300000.0,
    material: Cesium.Color.fromRandom({ alpha: 0.87 }),
  },
});



viewer.zoomTo(viewer.entities);