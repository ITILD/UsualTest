import { viwerSettingFull } from "./viwerSettingFull.js";
import * as cesiumPlugin from '../../../../../../public/lib/in/cesiumplugin.mjs'
import { SceneInteraction } from "./sceneParam/SceneInteraction.js";

function datGuiControl(guiRoot, controlParams) {
  
  const gui_0_root = guiRoot
  const viewer = controlParams.viewer
  // c添加测试
  let sceneInteraction = new SceneInteraction(viewer)


  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'

  let options_0 = {
    CONTROL: 'CesiumTest',
  }
  gui_0_root.add(options_0, 'CONTROL')
  let gui_0_f0 = gui_0_root.addFolder(viwerSettingFull.sceneParam.title)
  // 视角控制
  let cameras = gui_0_f0.add(viwerSettingFull.sceneParam, 'cameraList',viwerSettingFull.sceneParam.cameraListFull)
  cesiumPlugin.CameraPro.cameraSetViewGraphic(viwerSettingFull.sceneParam.cameras[viwerSettingFull.sceneParam.cameraList], viewer)
  cameras.onFinishChange( value=> {
    console.log('onChange:' + value)
    cesiumPlugin.CameraPro.cameraSetViewGraphic(viwerSettingFull.sceneParam.cameras[value], viewer)
  })
  // 参数设置：抗锯齿 深度检测
  // viewer.scene.globe.depthTestAgainstTerrain = true;
  let depthTestAgainstTerrain = gui_0_f0.add(viwerSettingFull.sceneParam, 'depthTestAgainstTerrain')
  viewer.scene.globe.depthTestAgainstTerrain = true;
  depthTestAgainstTerrain.onChange(value => {
    console.log('depthTestAgainstTerrain:' + value)
    viewer.scene.globe.depthTestAgainstTerrain = value;
  })
  let fxaa = gui_0_f0.add(viwerSettingFull.sceneParam, 'fxaa')  //是否开启抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;
  fxaa.onChange(value => {
    console.log('fxaa:' + value)
    viewer.scene.globe.fxaa = value;
    viewer.scene.postProcessStages.fxaa.enabled = value;
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
    viwerSettingFull.timeCotrol.timeReturn= () => {
      viwerSettingFull.timeCotrol["timeMark⏲"] = 0
    }
    gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeReturn')
    //监听开关
    let timeListen =  gui_0_f2.add(viwerSettingFull.timeCotrol, 'timeListen')
    let timeMark
    timeListen.onChange((value) => {
      console.log('timeListen_onChange:' + value)
      if (value) {
        timeMark = setInterval(()=>{ viwerSettingFull.timeCotrol["timeMark⏲"]++ }, 1000);
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
    simple2D.onChange((value) => {
      console.log('onChange:' + value)
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
    let ocGeo = gui_0_f3.add(viwerSettingFull.spatialTree, 'ocGeo')
    ocGeo.onChange((value) => {
      console.log('onChange:' + value)
    })
    
}

export { datGuiControl }
