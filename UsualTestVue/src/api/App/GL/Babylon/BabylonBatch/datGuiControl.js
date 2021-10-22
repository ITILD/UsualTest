import { viwerSettingFull } from './viwerSettingFull.js'
// import * as cesiumPlugin from '../../../../../../public/lib/in/cesiumplugin.mjs'
// import { SceneInteraction } from './sceneParam/SceneInteraction.js'
// import { CesiumPrimitivesProvider_CameraCenter2D } from './spatialTree/CesiumPrimitivesProvider_CameraCenter2D.js'
// import { UsualGeoOctree } from './spatialTree/UsualGeoOctree.js'
import { BatchModel } from './BatchModel.js'

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


  let outFileName = 'defaultFileName'
  viwerSettingFull.sceneParam.OutModelFile = () => {
    let GLTF2Export = controlParams.GLTF2Export
    GLTF2Export.GLBAsync(controlParams.scene, outFileName).then((glb) => {
      glb.downloadFiles()
    })
  }
  // 展开
  gui_0_f0.closed = false
  // 设定参数
  let realHeight
  let height_param = gui_0_f0.add(viwerSettingFull.sceneParam, 'height_param')
  height_param.onChange(function(value) {
    realHeight =value
    console.log("onChange:" + value)
  });

  // 上传
  viwerSettingFull.sceneParam.UpModelFile = () => {
    (polygonToDelete.length > 0) && polygonToDelete.forEach(
      (polygon) => {
        polygon.dispose()
      }
    )
    getFile()
  }
  let button_UpModelFile = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'UpModelFile'
  )
  // 输出模型
  let button_outModelFile = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    'OutModelFile'
  )
  // store a reference to our file handle
  let fileHandle;
  let polygonToDelete = []

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
    outFileName = fileHandle.name.replace('.json', "")
    const file = await fileHandle.getFile();
    // 接下来，`file` 就是普通 File 实例，你想怎么处理都可以，比如，获取文本内容
    const code = await file.text();

    /**
     * EPSG 右手3D坐标系 4978  wgs84地心空间直角坐标系、右手3D坐标系，由3个正交轴组成，X轴和Y轴在赤道平面上，正Z轴平行于地球平均旋转轴并指向北极。
     * 转babylon引擎左手系  y与z轴互换！！！  视角与坐标
     *
     *  */
    let fullJson = JSON.parse(code)


    let testPosition = [186000, 2496000]
    for (let index = 0; index < fullJson.features.length; index++) {
      const feature = fullJson.features[index]
      let geometry = feature.geometry
      let properties = feature.properties
      let downHeight = properties['b']
      if (!downHeight) {
        alert('数据地面高程字段不存在')
        break
      }
      let coordinatesArrayUp = geometry.coordinates[0][0]
      // 预处理底面
      BatchModel.moveXY(coordinatesArrayUp, [197322.8269951, 2507964.03])
      // let  coordinatesArrayDown =BatchModel.creatWallArrays(coordinatesArrayUp, 0)
      let polygon = BatchModel.createWallExtrudePolygon(
        coordinatesArrayUp.slice(0, coordinatesArrayUp.length - 1),
        downHeight
      )
      polygonToDelete.push(polygon)
    }

  }

}

export { datGuiControl }