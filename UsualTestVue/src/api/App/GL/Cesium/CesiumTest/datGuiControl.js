import { viwerSettingFull } from './viwerSettingFull.js'
import * as cesiumPlugin from '../../../../../../public/lib/in/cesiumplugin.mjs'
import { SceneInteraction } from './sceneParam/SceneInteraction.js'
import { CesiumPrimitivesProvider_CameraCenter2D } from './spatialTree/CesiumPrimitivesProvider_CameraCenter2D.js'
import { UsualGeoOctree } from './spatialTree/UsualGeoOctree.js'

function datGuiControl(guiRoot, controlParams) {
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
  handler&&handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
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

  // --------------------------------------------图层---------------------------------------------------
  // --------------------------------------------图层---------------------------------------------------
}

export { datGuiControl }
