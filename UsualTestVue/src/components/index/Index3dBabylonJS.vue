
<template>
  <div>
    <canvas class="CVS0 Index2dwith3d" id="indexBabylonCanvas"></canvas>
    <div class="CVS1 Index2dwith3d">test_canvas</div>
  </div>
</template>

<script>
// https://doc.cnbabylon.com/3-0-how-to-get-babylon-js/
import { ref, reactive, onMounted } from 'vue'
// import {Engine,Scene,ArcRotateCamera,Vector3,HemisphericLight,PointLight,MeshBuilder} from 'babylonjs';
import { author } from './config'
import * as BABYLON from 'babylonjs'
export default {
  name: 'Index3d_首页',
  //  components: { HelloWorld },
  props: {
    // ENV_TEST: { type: String }
  },
  setup(props) {
    const getViewer = async () => {
      console.log('-------------1', author)
      // Get the canvas DOM element
      var canvas = document.getElementById('indexBabylonCanvas') // 得到canvas对象的引用
      // Load the 3D engine // 初始化 BABYLON 3D engine
      var engine = new BABYLON.Engine(canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      })
      /******* CreateScene function that creates and return the scene ******/

      var createScene = function () {
        // Create a basic BJS Scene object 创建一个场景scene
        var scene = new BABYLON.Scene(engine)
        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}  添加一个相机，并绑定鼠标事件
        var camera = new BABYLON.FreeCamera(
          'camera1',
          new BABYLON.Vector3(0, 5, -10),
          scene
        )
        // Target the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero())
        // Attach the camera to the canvas
        camera.attachControl(canvas, false)
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky 添加一组灯光到场景
        var light = new BABYLON.HemisphericLight(
          'light1',
          new BABYLON.Vector3(0, 1, 0),
          scene
        )
        var light2 = new BABYLON.PointLight(
          'light2',
          new BABYLON.Vector3(0, 1, -1),
          scene
        )
        //添加一个球体到场景中
        // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        var sphere = BABYLON.Mesh.CreateSphere(
          'sphere1',
          16,
          2,
          scene,
          false,
          BABYLON.Mesh.FRONTSIDE
        )
        // Move the sphere upward 1/2 of its height
        sphere.position.y = 1
        // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision, scene, updatable
        var ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene, false)
        // Return the created scene
        return scene
      }
      // call the createScene function
      var scene = createScene()
      // run the render loop 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来
      engine.runRenderLoop(function () {
        scene.render()
      })
      // the canvas/window resize event handler 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
      window.addEventListener('resize', function () {
        engine.resize()
      })
    }

    onMounted(getViewer)

    return {
      // getViewer,
    }
  }
}
</script>

<style>
.indexBabylonCanvas {
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
