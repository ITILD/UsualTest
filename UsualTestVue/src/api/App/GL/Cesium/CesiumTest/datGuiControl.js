import { viwerSettingFull } from "./viwerSettingFull.js";
function datGuiControl(guiRoot, controlParams) {
  const gui_0_root = guiRoot
  const viewer = controlParams.viewer
  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'

  let options_0 = {
    CONTROL: 'CesiumTest',
  }
  gui_0_root.add(options_0, 'CONTROL')
  let options_1 = {
    noiseStrength: 0,
    growthSpeed: 0.2,
    maxSize: 6,
    message: 'pizza',
    cameraSetting: viwerSettingFull.cameras.testBst,
    speedChange: 0.8,
    displayOutline: false,
    button_function: () => {
      console.log('test---------------gui_0_root')
    },
  }
  let gui_0_f0 = gui_0_root.addFolder('场景参数')
  // 下拉框形式选择文案
  gui_0_f0.add(options_1, 'cameraSetting',viwerSettingFull.cameras )
  let controller_speed = gui_0_f0.add(options_1, 'speedChange', -5, 5)
  controller_speed.onChange(function (value) {
    console.log('onChange:' + value)
  })

  controller_speed.onFinishChange(function (value) {
    console.log('onFinishChange' + value)
  })

  gui_0_f0.add(options_1, 'noiseStrength').step(1).listen() // 增长的步长

  let myVar = setInterval(()=>{ options_1.noiseStrength++ }, 1000);

  gui_0_f0.add(options_1, 'growthSpeed', -5, 5) // 最大、最小值
  gui_0_f0.add(options_1, 'maxSize').min(0).step(0.25) // 最大值和步长
  // 文本输入项
  gui_0_f0.add(options_1, 'message', ['pizza', 'chrome', 'hooray'])

  gui_0_f0.add(options_1, 'displayOutline')
  gui_0_f0.add(options_1, 'button_function')

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
