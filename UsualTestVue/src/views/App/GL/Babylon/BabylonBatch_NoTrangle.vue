<template>
  <div>
    <canvas class="Index2dwith3d" id="indexBabylonCanvas"></canvas>
    <div id="datGui"></div>
  </div>
</template>

<script>
// https://doc.cnbabylon.com/3-0-how-to-get-babylon-js/
import { ref, reactive, onMounted } from 'vue'
import dat from 'dat.gui'
import '../../../../assets/css/index/datgui.css'
// import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,PointLight,MeshBuilder} from 'babylonjs';
// import { author } from './config'
import * as BABYLON from 'babylonjs'
// import { GLTF2Export } from '@babylonjs/serializers/glTF'
import { GLTF2Export } from 'babylonjs-serializers'

import { fullJson } from './BabylonBatchData/fullJson.js'
import { matrixSimple } from './modelTest1/matrixSimple.js'
import * as earcut from 'earcut' //三角剖切
import { datGuiControl } from '../../../../api/App/GL/Babylon/BabylonTest/datGuiControl.js'
import { BabylonHelp } from '../../../../api/App/GL/Babylon/BabylonPlugin/BabylonHelp.js'
import { BatchModel } from './BabylonBatchData/BatchModel.js'
window.earcut = earcut
/**
 * 左手坐标系
 * X 轴为right，Y 轴为up，Z 轴为to
 *
 *
 *
 */

//
window.BABYLON = BABYLON

export default {
  name: 'Index3d_首页',
  //  components: { HelloWorld },
  props: {
    // ENV_TEST: { type: String }
  },
  setup(props) {
    const getViewer = async () => {
      // 二维数组转一维度
      function flatten(arr) {
        return [].concat(...arr.map((x) => (Array.isArray(x) ? flatten(x) : x)))
      }
      // console.log('-------------1', author)
      // Get the canvas DOM element
      let canvas = document.getElementById('indexBabylonCanvas') // 得到canvas对象的引用
      // Load the 3D engine // 初始化 BABYLON 3D engine
      let engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      })
      /******* CreateScene function that creates and return the scene ******/

      let createScene = function () {
        // Create a basic BJS Scene object 创建一个场景scene
        let scene = new BABYLON.Scene(engine)
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}  添加一个相机
        let camera = new BABYLON.FreeCamera(
          'camera1',
          new BABYLON.Vector3(0, 1000, -500),
          scene
        )
        camera.setTarget(new BABYLON.Vector3(0, -20, 10))
        camera.attachControl(canvas, false)
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky 添加一组灯光到场景
        let light = new BABYLON.HemisphericLight(
          'light1',
          new BABYLON.Vector3(1, 1, 0),
          scene
        )
        window.scene = scene
        /**
         * EPSG 右手3D坐标系 4978  wgs84地心空间直角坐标系、右手3D坐标系，由3个正交轴组成，X轴和Y轴在赤道平面上，正Z轴平行于地球平均旋转轴并指向北极。
         * 转babylon引擎左手系  y与z轴互换！！！  视角与坐标
         *
         *  */

        let testPosition = [186000, 2496000]
        for (let index = 0; index < fullJson.features.length; index++) {
          // for (let index = 0; index < 1; index++) {
          const feature = fullJson.features[index]
          let geometry = feature.geometry
          let properties = feature.properties
          let coordinatesArrayUp = geometry.coordinates[0][0]
          // 预处理底面
          BatchModel.moveXY(coordinatesArrayUp, [197322.8269951, 2507964.03])
          // let  coordinatesArrayDown =BatchModel.creatWallArrays(coordinatesArrayUp, 0)
          BatchModel.createWallExtrudePolygon(
            coordinatesArrayUp.slice(0, coordinatesArrayUp.length - 1),
            200
          )
          // // 墙面
          // // console.log('coordinatesArray', coordinatesArray)
          // BatchModel.createWall(coordinatesArrayUp, coordinatesArrayDown)
          // // 底面
          // let walldownOne = flatten(
          //     coordinatesArrayUp.slice(0, coordinatesArrayUp.length - 1)
          //   )
          // BatchModel.makePlogon3DUp(walldownOne)
          // walldownOne = flatten(
          //     coordinatesArrayDown.slice(0, coordinatesArrayDown.length - 1)
          //   )
          // BatchModel.makePlogon3DDown(walldownOne)
        }

        return scene
      }
      // call the createScene function
      let scene = createScene()

      engine.runRenderLoop(function () {
        scene.render()
      })
      window.addEventListener('resize', function () {
        engine.resize()
      })
      /***************************End World Axes***************************/
      // -----------------------------------------------------------------坐标轴
      if (window.debug_xu) {
        BabylonHelp.showAxis(1000)
      }
      //

      // -----------------------------------------------------------------datgui场景控制
      let controlParams = {
        scene: scene,
        engine: engine,
        GLTF2Export: GLTF2Export,
        scene: scene
      }
      const box = document.querySelector('#datGui')
      const gui_0_root = new dat.GUI({ autoPlace: false })
      box.appendChild(gui_0_root.domElement)
      datGuiControl(gui_0_root, controlParams)
    }

    onMounted(getViewer)

    return {
      // getViewer,
    }
  }
}
</script>


<style>
.Index2dwith3d {
  position: absolute;
  width: 100%;
  height: 100%;
}
.CVS1 {
  /* //穿透该层 */
  pointer-events: none;
  /* //恢复点击处理 */
  /* pointer-events:auto; */
}
</style>