let viwerSettingFull = {
  // --------------------------------------------场景参数---------------------------------------------------
  sceneParam: {
    title: '场景参数',
    depthTestAgainstTerrain:true,//深度检测
    fxaa:true,//抗锯齿
    cameraNow:{
      h: 0,
      heading: 0,
      lat: 0,
      lon: 0,
      pitch: 0,
      roll: 0,
      x: 0,
      y: 0,
      z: 0,
    },
    cameraList: 'dalianXianRoad',
    cameraListFull: ['dalian', 'dalianXianRoad', 'testBst'],
    cameras: {
      dalian: {
        h: 210917.61076129225,
        heading: 4.776914625139059,
        lat: 38.19657408526269,
        lon: 121.48883525561368,
        pitch: -65.21776378376678,
        roll: 359.9680681011566,
        x: -2708150.075832754,
        y: 4421232.87098219,
        z: 4053038.1199376937
      },
      dalianXianRoad: {
        h: 6760.697812575909,
        heading: 358.6088835072762,
        lat: 38.86539786948894,
        lon: 121.59026376376555,
        pitch: -52.19888585050776,
        roll: 359.9976649251927,
        x: -2607671.6254940815,
        y: 4240324.098070308,
        z: 3984935.5819013957
      },
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
  },

  // --------------------------------------------场景监听---------------------------------------------------
  sceneListen: {
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
  spatialTree: {
    title: 'spatialTree',
    simple2D: false,
    quadtree: false,
    simple3D: false,
    geohash: false,
    octree: false,
    ocGeo: false,
  },
}

export { viwerSettingFull }
