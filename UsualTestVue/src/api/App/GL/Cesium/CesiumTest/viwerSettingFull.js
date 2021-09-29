let viwerSettingFull = {
  //
  cameras: {
    dalian: { a: 1 },
    dalianXianRoad: 0.1,
    testBst: {
      h: 1567.9855743901433,
      heading: 21.98044650951645,
      lat: 42.3534417026535,
      lon: -71.05980083549828,
      pitch: -77.75571355232125,
      roll: 0.34294193787960303,
      x: 1532606.6091789035,
      y: -4466150.142919737,
      z: 4275754.210693352,
    },
  },
  // --------------------------------------------场景监听---------------------------------------------------
  sceneListen:{
    title: '场景监听',
    cameraMove: false,
    mouseClick: false,
    mouseMove: false,
  },
  // --------------------------------------------时间监听---------------------------------------------------
  timeCotrol: {
    title: '时间监听🕐',
    'timeMark⏲': 0,
    timeListen: false,
    timeReturn: null,
  },
  spatialTree:{
    title: '分块',
    simple2D: false,
    quadtree:false,
    simple3D: false,
    geohash: false,
    octree: false,
    ocGeo: false,
  },
}

export { viwerSettingFull }
