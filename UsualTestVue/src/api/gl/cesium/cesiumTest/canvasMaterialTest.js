// canvas作为纹理贴图 兼容性透明度失效
// 尝试cad贴在场景内

var viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: Cesium.createWorldTerrain(),
})

var redWall = viewer.entities.add({
  name: 'Red wall at height',
  wall: {
    positions: Cesium.Cartesian3.fromDegreesArrayHeights([
      121.444409, 31.247417, 200.0, 121.533521, 31.235685, 200.0, 121.563273,
      31.190347, 200.0, 121.546744, 31.194054, 200.0, 121.516705, 31.191459,
      200.0, 121.502188, 31.203074, 200.0,
    ]),
    minimumHeights: [3000.0, 2000.0, 2000, 2000, 2000, 3000],
    material: getColorRamp([0.0, 0.045, 0.1, 0.15, 0.37, 0.54, 1.0], true),
  },
})

viewer.zoomTo(viewer.entities)

function getColorRamp(elevationRamp, isVertical = true) {
  var ramp = document.createElement('canvas')
  ramp.width = isVertical ? 1 : 100
  ramp.height = isVertical ? 100 : 1
  var ctx = ramp.getContext('2d')

  var values = elevationRamp
  var grd = isVertical
    ? ctx.createLinearGradient(0, 0, 0, 100)
    : ctx.createLinearGradient(0, 0, 100, 0)
  grd.addColorStop(values[0], '#FFFFFFFF') //w

  grd.addColorStop(values[6], '#FF000000') //white

  ctx.fillStyle = grd
  if (isVertical) ctx.fillRect(0, 0, 1, 100)
  else ctx.fillRect(0, 0, 100, 1)
  return ramp
}
