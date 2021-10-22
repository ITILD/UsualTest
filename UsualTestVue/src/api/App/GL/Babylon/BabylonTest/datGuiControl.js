import { viwerSettingFull } from './viwerSettingFull.js'
// import * as cesiumPlugin from '../../../../../../public/lib/in/cesiumplugin.mjs'
// import { SceneInteraction } from './sceneParam/SceneInteraction.js'
// import { CesiumPrimitivesProvider_CameraCenter2D } from './spatialTree/CesiumPrimitivesProvider_CameraCenter2D.js'
// import { UsualGeoOctree } from './spatialTree/UsualGeoOctree.js'

function datGuiControl(guiRoot, controlParams) {
  const gui_0_root = guiRoot
  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'

  let options_0 = {
    CONTROL: 'CesiumTest',
  }
  gui_0_root.add(options_0, 'CONTROL')
  // --------------------------------------------模型---------------------------------------------------
  let gui_0_f0 = gui_0_root.addFolder(viwerSettingFull.sceneParam.title)
  // 视角控制
  let cameras = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'cameraList',
    viwerSettingFull.sceneParam.cameraListFull
  )


  let outFileNmae = 'defaultFileName'
  viwerSettingFull.sceneParam.OutModelFile = () => {
    let GLTF2Export = controlParams.GLTF2Export
    GLTF2Export.GLBAsync(controlParams.scene, outFileNmae).then((glb) => {
      glb.downloadFiles()
    })
  }
  // 展开
  gui_0_f0.closed = false
  // 输出模型
  let button_outModelFile = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'OutModelFile'
  )
  // store a reference to our file handle
  let fileHandle;

  async function getFile() {
    // open file picker
    [fileHandle] = await window.showOpenFilePicker();

    if (fileHandle.kind === 'file') {
      // run file code
      console.log(fileHandle)
    } else if (fileHandle.kind === 'directory') {
      // run directory code
      console.log('directory', fileHandle)
    }




    // 如果没有选择文件，就不需要继续执行了
    if (!fileHandle) {
      return;
    }

    // 这里的 options 用来声明对文件的权限，能否写入
    const options = {
      writable: true,
      mode: 'readwrite',
    };
    // 然后向用户要求权限
    if ((await fileHandle.queryPermission(options)) !== 'granted' &&
      (await fileHandle.requestPermission(options)) !== 'granted') {
      alert('Please grant permissions to read & write this file.');
      return;
    }

    // 前面获取的是 FileHandle，需要转换 File 才能用
    const file = await fileHandle.getFile();
    // 接下来，`file` 就是普通 File 实例，你想怎么处理都可以，比如，获取文本内容
    const code = await file.text();
    console.log('codecodecodecode',code)

  }
  viwerSettingFull.sceneParam.UpModelFile = () => {getFile()}
  let button_UpModelFile = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'UpModelFile'
  )
}

export { datGuiControl }