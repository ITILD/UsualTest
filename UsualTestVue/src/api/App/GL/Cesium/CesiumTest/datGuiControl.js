import { viwerSettingFull } from './viwerSettingFull.js'
import * as cesiumPlugin from '../../../../../../public/lib/in/cesiumplugin.mjs'
import { SceneInteraction } from './sceneParam/SceneInteraction.js'
import { CesiumPrimitivesProvider_CameraCenter2D } from './spatialTree/CesiumPrimitivesProvider_CameraCenter2D.js'
import { UsualGeoOctree } from './spatialTree/UsualGeoOctree.js'
import { GeojsonMock } from './dataMock/GeojsonMock.js'
import { MoveEntityCollection } from './Animation/MoveEntityCollection.js'
import { TetrahedronGeometry } from './CustomGeometry/TetrahedronGeometry.js'
// TetrahedronGeometry
// TetrahedronGeometry
function datGuiControl(guiRoot, controlParams) {
  let dataSore = {

  }


  const gui_0_root = guiRoot
  const viewer = controlParams.viewer
  // c添加测试
  let sceneInteraction = new SceneInteraction(viewer)
  let baseLayers = new cesiumPlugin.BaseLayers(viewer)

  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'

  let options_0 = {
    CONTROL: 'CesiumTest',
  }
  gui_0_root.add(options_0, 'CONTROL')
  let gui_0_f0 = gui_0_root.addFolder(viwerSettingFull.sceneParam.title)
  // --------------------------------------------场景参数---------------------------------------------------
  // 视角控制
  let cameras = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'cameraList',
    viwerSettingFull.sceneParam.cameraListFull
  )
  cesiumPlugin.CameraPro.cameraSetViewGraphic(
    viwerSettingFull.sceneParam.cameras[viwerSettingFull.sceneParam.cameraList],
    viewer
  )
  cameras.onFinishChange((value) => {
    console.log('onChange:' + value)
    cesiumPlugin.CameraPro.cameraSetViewGraphic(
      viwerSettingFull.sceneParam.cameras[value],
      viewer
    )
  })
  // 参数设置：抗锯齿 深度检测
  // viewer.scene.globe.depthTestAgainstTerrain = true;
  let depthTestAgainstTerrain = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'depthTestAgainstTerrain'
  )
  viewer.scene.globe.depthTestAgainstTerrain = true
  depthTestAgainstTerrain.onChange((value) => {
    console.log('depthTestAgainstTerrain:' + value)
    viewer.scene.globe.depthTestAgainstTerrain = value
  })
  let fxaa = gui_0_f0.add(viwerSettingFull.sceneParam, 'fxaa') //是否开启抗锯齿
  viewer.scene.fxaa = true
  viewer.scene.postProcessStages.fxaa.enabled = true
  fxaa.onChange((value) => {
    console.log('fxaa:' + value)
    viewer.scene.globe.fxaa = value
    viewer.scene.postProcessStages.fxaa.enabled = value
  })

  // --------------------------------------------场景监听---------------------------------------------------
  let gui_0_f1 = gui_0_root.addFolder(viwerSettingFull.sceneListen.title)
  // 下拉框形式选择文案
  let cameraMove = gui_0_f1.add(viwerSettingFull.sceneListen, 'cameraMove')
  cameraMove.onChange((value) => {
    console.log('onChange:' + value)
  })
  // 下拉框形式选择文案
  let mouseClick = gui_0_f1.add(viwerSettingFull.sceneListen, 'mouseClick')
  mouseClick.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {
      sceneInteraction.getClick()
    } else {
      sceneInteraction.destroy()
    }
  })
  // 下拉框形式选择文案
  let mouseMove = gui_0_f1.add(viwerSettingFull.sceneListen, 'mouseMove')
  mouseMove.onChange((value) => {
    console.log('onChange:' + value)
  })
  // --------------------------------------------时间监听---------------------------------------------------
  let gui_0_f2 = gui_0_root.addFolder(viwerSettingFull.timeCotrol.title)
  // 归零
  viwerSettingFull.timeCotrol.timeReturn = () => {
    viwerSettingFull.timeCotrol['timeMark⏲'] = 0
  }
  gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeReturn')
  //监听开关
  let timeListen = gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeListen')
  let timeMark
  timeListen.onChange((value) => {
    console.log('timeListen_onChange:' + value)
    if (value) {
      timeMark = setInterval(() => {
        viwerSettingFull.timeCotrol['timeMark⏲']++
      }, 1000)
    } else {
      clearInterval(timeMark)
    }
  })
  // 时间
  gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeMark⏲').step(1).listen() // 增长的步长

  // --------------------------------------------分块---------------------------------------------------
  let gui_0_f3 = gui_0_root.addFolder(viwerSettingFull.spatialTree.title)
  // 下拉框形式选择文案
  /**
     *  simple2D: false,
    simple3D: false,
    geohash: false,
    octree: false,
    ocGeo: false,
     */
  let simple2D = gui_0_f3.add(viwerSettingFull.spatialTree, 'simple2D')
  let simple2DPrimitivesProvider
  simple2D.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {
      simple2DPrimitivesProvider = new cesiumPlugin.CesiumPrimitivesProvider(
        viewer
      )
      simple2DPrimitivesProvider.setParams(16, 2, 20000, [0, 3000])
      simple2DPrimitivesProvider.startListener() //矫正分块
    } else {
      simple2DPrimitivesProvider && simple2DPrimitivesProvider.endListener()
      simple2DPrimitivesProvider = null
    }
  })
  let CameraCenter2D = gui_0_f3.add(
    viwerSettingFull.spatialTree,
    'CameraCenter2D'
  )
  let cameraCenter2DPrimitivesProvider
  CameraCenter2D.onChange((value) => {
    console.log('onChange:' + value)
    // CesiumPrimitivesProvider_CameraCenter2D
    if (value) {
      cameraCenter2DPrimitivesProvider =
        new CesiumPrimitivesProvider_CameraCenter2D(viewer)
      cameraCenter2DPrimitivesProvider.setParams(16, 2, 20000, [0, 30000])
      cameraCenter2DPrimitivesProvider.startListener() //矫正分块
    } else {
      cameraCenter2DPrimitivesProvider &&
        cameraCenter2DPrimitivesProvider.endListener()
      cameraCenter2DPrimitivesProvider = null
    }
  })
  // 下拉框形式选择文案
  let simple3D = gui_0_f3.add(viwerSettingFull.spatialTree, 'simple3D')
  simple3D.onChange((value) => {
    console.log('onChange:' + value)
  })
  // 下拉框形式选择文案
  let geohash = gui_0_f3.add(viwerSettingFull.spatialTree, 'geohash')
  geohash.onChange((value) => {
    console.log('onChange:' + value)
  })
  // 下拉框形式选择文案

  let octree = gui_0_f3.add(viwerSettingFull.spatialTree, 'octree')
  octree.onChange((value) => {
    console.log('onChange:' + value)
  })
  // 下拉框形式选择文案
  // UsualGeoOctree
  let usualGeoOctree
  let ocGeo = gui_0_f3.add(viwerSettingFull.spatialTree, 'ocGeo')
  ocGeo.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {
      usualGeoOctree = new UsualGeoOctree(viewer)
      usualGeoOctree.setParams(16, 2, 20000, [0, 30000])
      usualGeoOctree.startListener() //矫正分块
    } else {
      usualGeoOctree && usualGeoOctree.endListener()
      usualGeoOctree = null
    }
  })

  // --------------------------------------------动态房屋---------------------------------------------------
  let gui_0_f4 = gui_0_root.addFolder(viwerSettingFull.LODBuilding.title)
  // 基础设置 白膜
  let baimo = gui_0_f4.add(viwerSettingFull.LODBuilding, 'baimo') //是否开启抗锯齿
  baimo.onChange((value) => {
    console.log('baimo:' + value)
    viwerSettingFull.LODBuilding.baimo = value
    if (value) {
      baseLayers.addLayer(viwerSettingFull.LODBuilding.baimoConfig)
      // 清除鼠标监听
      handler && handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    } else {
      // viwerSettingFull.LODBuilding.damage = false //消除损伤
      baseLayers.layersIdConfig.get(
        viwerSettingFull.LODBuilding.baimoConfig.id
      ) && baseLayers.remove(viwerSettingFull.LODBuilding.baimoConfig)
    }
  })
  // 损伤变色 damage
  // 下拉框形式选择文案
  // let conditionsTest = []

  // let conditionsMax = 50000
  // let conditionsLength = 50000/255
  // for (let index = 0; index < conditionsMax/conditionsLength; index++) {
  //   conditionsTest.push(['${地上面积} > '+ index*conditionsLength +' && (${地上面积} < '+(index+1)*conditionsLength +')', 'rgb('+index+', 0, 0)'])
  // }

  let damage = gui_0_f4.add(viwerSettingFull.LODBuilding, 'damage').listen()
  damage.onChange((value) => {
    console.log('damage:' + value)
    if (!viwerSettingFull.LODBuilding.baimo) {
      viwerSettingFull.LODBuilding.damage = false
      alert('baimo false')
      return
    }
    // 损伤变色
    let baimoTileset = baseLayers.layersIdConfig.get(
      viwerSettingFull.LODBuilding.baimoConfig.id
    ).layer
    console.log(baimoTileset)
    if (value) {
      baimoTileset.style = new Cesium.Cesium3DTileStyle({
        // defines: {
        //   material: "${feature['building:id']}",
        // },
        color: {
          conditions:
            // conditionsTest
            [
              // objectid 	106887 		106884  
              ['${objectid} == 106887 ', "color('red')"],
              ['${objectid} == 106884 ', 'rgb(0, 0, 151)'],
              // ['${id} > 40000.0 && (${id} < 4000000.0)', "color('red')"],
              ['true', "color('black')"],

              // ['${地上面积} > 0 && (${地上面积} < 2000.0)', 'rgb(102, 71, 151)'],
              // ['${地上面积} > 2000.0 && (${地上面积} < 4000.0)', "color('red')"],



              // ['${地上面积} > 2000', "color('yellow')"],
              // ['${地上面积} < 2000', "color('red')"],
              // ["${地上面积} <= 2000'", "color('green', 0.5)"],
              // ['true', "color('red')"], // This is the else case
            ],
        },
      })
    } else {
      baimoTileset.style = null
    }
  })

  // 动态挖坑

  // 动态添加动态房屋
  let rockBuildiong = gui_0_f4.add(
    viwerSettingFull.LODBuilding,
    'rockBuildiong'
  )
  let rockBuildiongPrimitivesProvider
  rockBuildiong.onChange((value) => {
    console.log('onChange:' + value)
    // CesiumPrimitivesProvider_rockBuildiong
    if (value) {
      rockBuildiongPrimitivesProvider =
        new CesiumPrimitivesProvider_CameraCenter2D(viewer)
      rockBuildiongPrimitivesProvider.setParams(14, 2, 20000, [0, 30000])
      rockBuildiongPrimitivesProvider.startListener() //矫正分块
    } else {
      rockBuildiongPrimitivesProvider &&
        rockBuildiongPrimitivesProvider.endListener()
      rockBuildiongPrimitivesProvider = null
    }
  })



  // --------------------------------------------动态---------------------------------------------------
  // 动态房屋
  let damage_time_unit = "s"
  let moveEntity
  let myEntityCollection
  let gui_0_f5 = gui_0_root.addFolder(viwerSettingFull.Animation.title)
  // 
  // let eBuildSimple
  let eBuildSimple = gui_0_f5.add(viwerSettingFull.Animation, 'eBuildSimple')
  eBuildSimple.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

      let res = dataSore.buildings
      myEntityCollection = new Cesium.CustomDataSource('testEntityCollection')
      viewer.dataSources.add(myEntityCollection)
      let entities = myEntityCollection.entities
      // 起始时间
      // let start = Cesium.JulianDate.fromDate(new Date(2017, 7, 11))//北京时间     8小时差
      let start = Cesium.JulianDate.fromIso8601(res.features[0].properties.time_start) // TODO 先查询批次 起始时间和最大时间  回调查询数据 直接输入？？
      // 结束时间
      let stop = Cesium.JulianDate.fromIso8601(res.features[0].properties.time_end) // TODO 先查询批次 起始时间和最大时间  回调查询数据 直接输入？？

      // 设置始时钟始时间
      viewer.clock.startTime = start.clone()

      // 设置时钟当前时间
      viewer.clock.currentTime = start.clone()

      // 设置始终停止时间
      viewer.clock.stopTime = stop.clone()

      // 时间速率，数字越大时间过的越快
      viewer.clock.multiplier = 0.5 //TODO 测试 或传值

      // 时间轴
      viewer.timeline.zoomTo(start, stop)
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; //终止时间终止
      // 设置时间添加方法
      let timeAddFun = Cesium.JulianDate.addSeconds;
      if (damage_time_unit === "d") {
        timeAddFun = Cesium.JulianDate.addDays;
      }
      // debugger TODO displacement_time_unit
      let timeAddFun_displacement_s = 0.005
      let timeAddFun_displacement_ms = 0.005 * 1000
      let amplitudeIncrease = 100
      moveEntity = new MoveEntityCollection(
        viewer,
        entities,
        start,
        stop,
        0.4,
        timeAddFun,
        timeAddFun_displacement_s,
        timeAddFun_displacement_ms,
        amplitudeIncrease
      )



      // 查询单片几何
      // let dataLength = res.features.length
      let dataLength = 10
      for (let index = 0; index < dataLength; index++) {
        const feature = res.features[index];
        const floors = feature.properties.floors
        const height = feature.properties.height * 5 //总高程

        const damage = feature.properties.damage //损伤数据
        const displacement = feature.properties.displacement //时程数据
        if (!displacement) { //时程数据不存在
          continue
        }

        const time_start = feature.properties.time_start //损伤数据
        const bsm = feature.properties.bsm

        const geometry = JSON.parse(feature.geometry)

        let coordinatesArrays = geometry.coordinates[0][0].flat() //降维
        let postyionsArrays = Cesium.Cartesian3.fromDegreesArray(coordinatesArrays);

        // moveEntity.add(postyionsArrays, height / floors, floors, bsm, damage, displacement, time_start, height)
        moveEntity.add(postyionsArrays, height / floors, floors, bsm, damage, displacement, time_start, height)

      }
      // resolve(moveEntity)

    } else {

      moveEntity.removeAll()

    }
  })


  let eBuildMove = gui_0_f5.add(viwerSettingFull.Animation, 'eBuildMove')
  eBuildMove.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {



    } else {

    }
  })


  // 
  let gBuildSimple = gui_0_f5.add(viwerSettingFull.Animation, 'gBuildSimple')
  gBuildSimple.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

      let res = dataSore.buildings

      // 查询单片几何
      // let dataLength = res.features.length
      let dataLength = 2
      for (let index = 0; index < dataLength; index++) {
        const feature = res.features[index];
        const floors = feature.properties.floors
        const height = feature.properties.height //总高程

        const damage = feature.properties.damage //损伤数据
        const displacement = feature.properties.displacement //时程数据
        if (!displacement) { //时程数据不存在
          continue
        }

        const time_start = feature.properties.time_start //损伤数据
        const bsm = feature.properties.bsm

        const geometry = JSON.parse(feature.geometry)

        let coordinatesArrays = geometry.coordinates[0][0].flat() //降维
        let postyionsArrays = Cesium.Cartesian3.fromDegreesArray(coordinatesArrays);

        // moveEntity.add(postyionsArrays, height / floors, floors, bsm, damage, displacement, time_start, height)


      }

    } else {
      moveEntity.removeAll()

    }
  })

  let gBuildMove = gui_0_f5.add(viwerSettingFull.Animation, 'gBuildMove')
  gBuildMove.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

    } else {

    }
  })


  // --------------------------------------------仿真数据---------------------------------------------------
  // 动态房屋
  let gui_0_f6 = gui_0_root.addFolder(viwerSettingFull.DataMock.title)
  // 
  // let eBuildSimple
  let points = gui_0_f6.add(viwerSettingFull.DataMock, 'points')
  points.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

    } else {

    }
  })


  let lines = gui_0_f6.add(viwerSettingFull.DataMock, 'lines')
  lines.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

    } else {

    }
  })


  // 
  let polygons = gui_0_f6.add(viwerSettingFull.DataMock, 'polygons')
  polygons.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {

    } else {

    }
  })

  let buildings = gui_0_f6.add(viwerSettingFull.DataMock, 'buildings')
  buildings.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {
      dataSore.buildings = GeojsonMock.testBuilding()
      // console.log(dataSore)



    } else {
      dataSore.buildings = null
    }
  })



  // --------------------------------------------自定义几何体---------------------------------------------------
  // 动态房屋
  let gui_0_f7 = gui_0_root.addFolder(viwerSettingFull.CustomGeometry.title)
  // 
  // let eBuildSimple
  let Tetrahedron = gui_0_f7.add(viwerSettingFull.CustomGeometry, 'Tetrahedron')
  Tetrahedron.onChange((value) => {
    console.log('onChange:' + value)
    if (value) {


      let ellipsoid = viewer.scene.globe.ellipsoid;


      //模型矩阵
      let tempMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(ellipsoid.cartographicToCartesian(
        Cesium.Cartographic.fromDegrees(-100.0, 40.0)
      ))
      // debugger
      let tempMatrix1 = Cesium.Matrix4.multiplyByTranslation(
        tempMatrix,
        new Cesium.Cartesian3(0.0, 0.0, 200000.0),new Cesium.Matrix4())
      debugger
      let modelMatrix = Cesium.Matrix4.multiplyByUniformScale(tempMatrix1,
        500000.0,new Cesium.Matrix4() );
        debugger
      //四面体的实例

      let instance = new Cesium.GeometryInstance({
        geometry: TetrahedronGeometry(),
        modelMatrix: modelMatrix,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.WHITE) //白色
        }
      });

      //加入场景
      viewer.scene.primitives.add(new Cesium.Primitive({
        geometryInstances: instance,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false
        })
      }));





    } else {

    }
  })



  // --------------------------------------------图层---------------------------------------------------
}

export { datGuiControl }