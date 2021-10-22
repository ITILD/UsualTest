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
import { datGuiControl } from '../../../../api/App/GL/Babylon/BabylonTest/datGuiControl.js'

import { fullJson } from './modelTest1/fullJson.js'
import { matrixSimple } from './modelTest1/matrixSimple.js'
import * as earcut from 'earcut'
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
          new BABYLON.Vector3(0, 20, -10),
          // new BABYLON.Vector3(0, 10, 0),
          scene
        )
        // Target the camera to scene origin 朝向
        // camera.setTarget(BABYLON.Vector3.Zero())
        // camera.setTarget(new BABYLON.Vector3(0, -10, 0))
        camera.setTarget(new BABYLON.Vector3(0, -20, 10))

        // Attach the camera to the canvas
        camera.attachControl(canvas, false)
        // Create a basic light, aiming 0, 1, 0 - meaning, to the sky 添加一组灯光到场景
        let light = new BABYLON.HemisphericLight(
          'light1',
          new BABYLON.Vector3(1, 1, 0),
          scene
        )
        // let light2 = new BABYLON.PointLight(
        //   'light2',
        //   new BABYLON.Vector3(0, 0, -1),
        //   scene
        // )
        //添加一个球体到场景中
        // Create a built-in "sphere" shape; its constructor takes 6 params: name, segment, diameter, scene, updatable, sideOrientation
        // let sphere = BABYLON.Mesh.CreateSphere(
        //   'sphere1',
        //   16,
        //   1,
        //   scene,
        //   false,
        //   BABYLON.Mesh.FRONTSIDE
        // )
        // // Move the sphere upward 1/2 of its height
        // sphere.position.x = 0
        // sphere.position.y = 0
        // sphere.position.z = 0

        //  [-2823798.96793429, 4324518.5272128, 3729889.28469956],
        /**
         * EPSG 右手3D坐标系 4978  wgs84地心空间直角坐标系、右手3D坐标系，由3个正交轴组成，X轴和Y轴在赤道平面上，正Z轴平行于地球平均旋转轴并指向北极。
         * 转babylon引擎左手系  y与z轴互换！！！  视角与坐标
         *
         *  */
        let testPosition = [
          -2823798.96793429, 4324518.5272128, 3729889.28469956
        ]

        // let testPositionTransLeng = [2823798, -4324518, -3729889]
        let testPositionTransLeng = [0, -0, -0]

        let transPosition = (testPosition, testPositionTransLeng) => {
          for (let index = 0; index < testPosition.length; index++) {
            testPosition[index] += testPositionTransLeng[index]
          }
        }
        transPosition(testPosition, testPositionTransLeng)
        let yT = (-123.143516903 / 180) * Math.PI //原z
        let zT = (-36 / 180) * Math.PI //纬度
        let yTM = matrixSimple.rotateAroundYAxis(yT) //原z
        let zTM = matrixSimple.rotateAroundZAxis(zT)
        // let makePoint = (testPosition) => {
        //   let sphere1 = BABYLON.Mesh.CreateSphere(
        //     'sphere1',
        //     1,
        //     0.2,
        //     scene,
        //     false,
        //     BABYLON.Mesh.FRONTSIDE
        //   )
        //   //y与z轴互换！！！  视角与坐标
        //   sphere1.position.x = testPosition[0]
        //   sphere1.position.y = testPosition[2]
        //   sphere1.position.z = testPosition[1]
        // }

        let makePoint = (testPosition) => {
          let sphere1 = BABYLON.Mesh.CreateSphere(
            'sphere1',
            1,
            0.2,
            scene,
            false,
            BABYLON.Mesh.FRONTSIDE
          )
          //y与z轴互换！！！  视角与坐标
          sphere1.position.x = testPosition[0]
          sphere1.position.y = testPosition[2]
          sphere1.position.z = testPosition[1]
        }

        // for (let index = 0; index < fullJson.length; index++) {

        // for (let index = 0; index < 2; index++) {
        //   const Points = fullJson[index]
        //   Points.walldown.forEach((walldownPoints) => {
        //     transPosition(walldownPoints, testPositionTransLeng)
        //     makePoint(walldownPoints)
        //   })
        //   Points.wallup.forEach((thisPoints) => {
        //     transPosition(thisPoints, testPositionTransLeng)
        //     makePoint(thisPoints)
        //   })
        //   Points.top84BLH.forEach((json) => {
        //     json.coordinates.forEach((thisPoints) => {
        //       transPosition(thisPoints, testPositionTransLeng)
        //       makePoint(thisPoints)
        //     })
        //   })

        //   // makePoint()
        // }

        let posintArrayTrans = (pointArray) => {
          let newPointArray = []
          pointArray.forEach((element) => {
            newPointArray.push(
              new BABYLON.Vector3(element[0], element[2], element[1])
            )
          })

          return newPointArray
        }

        let posintArrayTransPillars = (pointArray, pointArrayUp) => {
          let newPointArray = []
          pointArray.forEach((element) => {
            newPointArray.push(
              new BABYLON.Vector3(element[0], element[2], element[1])
            )
          })

          return newPointArray
        }
        /**
         * [ 10 , 0 , 1 ,  0 , 50 , 2 ,  60 , 60 , 3 ,  70 , 10 , 4 ]
         * [0.1, 1, 4, 0.1, 1, 1, 0, 10, 1, 0, 10, 5]
         */
        console.log(
          '11111',
          earcut([0.1, 1, 4, 0, 1, 1, 0, 10, 1, 0, 10, 5], null, 3)
        )
        function makePlogon3D(walldownOne) {
          let walldownOneIndex = earcut(walldownOne, null, 3) //walldownOne索引
          console.log(walldownOneIndex, walldownOne)
          for (let index = 0; index < walldownOneIndex.length; index += 3) {
            let index0 = walldownOneIndex[index] * 3
            let index1 = walldownOneIndex[index + 1] * 3
            let index2 = walldownOneIndex[index + 2] * 3
            let myPaths = [
              [
                new BABYLON.Vector3(
                  walldownOne[index0],
                  walldownOne[index0 + 2],
                  walldownOne[index0 + 1]
                ),
                new BABYLON.Vector3(
                  walldownOne[index1],
                  walldownOne[index1 + 2],
                  walldownOne[index1 + 1]
                ),
                new BABYLON.Vector3(
                  walldownOne[index2],
                  walldownOne[index2 + 2],
                  walldownOne[index2 + 1]
                ),
                new BABYLON.Vector3(
                  walldownOne[index2],
                  walldownOne[index2 + 2],
                  walldownOne[index2 + 1]
                )
              ]
            ]

            //Create ribbon with updatable parameter set to true for later changes
            let ribbon = BABYLON.MeshBuilder.CreateRibbon(
              'ribbon',
              {
                pathArray: myPaths,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE,
                updatable: true
              },
              scene
            )
          }
        }
        for (let index = 0; index < 2; index++) {
          const Points = fullJson[index]
          let walldownOne = flatten(
            Points.walldown.slice(0, Points.walldown.length - 1)
          )
          makePlogon3D(walldownOne)

          // let upupwalldown =
          //   //  BABYLON.MeshBuilder.CreatePolygon("polygon", {shape:posintArrayTrans(Points.walldown), sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
          //   BABYLON.MeshBuilder.CreateLines(
          //     'lines',
          //     { points: posintArrayTrans(Points.walldown), updatable: true },
          //     scene
          //   )
          // let upupwallup = BABYLON.MeshBuilder.CreateLines(
          //   'lines',
          //   { points: posintArrayTrans(Points.wallup), updatable: true },
          //   scene
          // )
          // // 墙面
          // for (let index = 0; index < Points.wallup.length-1; index ++) {
          //   // [ 10 , 0 , 1 ,  0 , 50 , 2 ,  60 , 60 , 3 ,  70 , 10 , 4 ]

          //   const up = Points.wallup[index]
          //   const up1 = Points.wallup[index + 1]
          //   const down = Points.walldown[index]
          //   const down1 = Points.walldown[index + 1]
          //   let arrays = [
          //     up[0],
          //     up[1],
          //     up[2],
          //     down[0],
          //     down[1],
          //     down[2],
          //     down1[0],
          //     down1[1],
          //     down1[2],
          //      up1[0],
          //     up1[1],
          //     up1[2],
          //   ]
          //   console.log('!!!!!',arrays)
          //   makePlogon3D(arrays)

          // }
          Points.top84BLH.forEach((json) => {
            // let arraysStart = json.coordinates.slice(
            //   0,
            //   json.coordinates.length - 1
            // )
            let arraysStart =json.coordinates
            for (let index = 0; index < arraysStart.length - 1; index++) {
              // [ 10 , 0 , 1 ,  0 , 50 , 2 ,  60 , 60 , 3 ,  70 , 10 , 4 ]

              const up = arraysStart[index]
              const up1 = arraysStart[index + 1]
              const down = arraysStart[index]
              const down1 = arraysStart[index + 1]
              let arrays = [
                up[0],
                up[1],
                up[2],
                down[0] + 0.002,
                down[1] + 0.001,
                1,
                down1[0] + 0.002,
                down1[1] + 0.001,
                1,
                up1[0],
                up1[1],
                up1[2]
              ]
              console.log('!!!!!', arrays)
              makePlogon3D(arrays)
            }
          })

          Points.top84BLH.forEach((json) => {
            // let walldownOne = flatten(json.coordinates)
            let walldownOne = flatten(
              json.coordinates.slice(0, json.coordinates.length - 1)
            )
            makePlogon3D(walldownOne)
          })
        }

        // // 测试单点
        // let sphere1 = BABYLON.Mesh.CreateSphere(
        //   'sphere1',
        //   1,
        //   0.3,
        //   scene,
        //   false,
        //   BABYLON.Mesh.FRONTSIDE
        // )
        // //y与z轴互换！！！  视角与坐标
        // sphere1.position.x = testPosition[0]
        // sphere1.position.y = testPosition[2]
        // sphere1.position.z = testPosition[1]

        // Create a built-in "ground" shape; its constructor takes 6 params : name, width, height, subdivision方格细分数, scene, updatable
        // let ground = BABYLON.MeshBuilder.CreateGround(
        //   'myGround',
        //   { width: 12, height: 6, subdivisions: 1 },
        //   scene
        // )
        // ground.position.x = 0
        // ground.position.y = 0
        // ground.position.z = 0
        // // Return the created scene
        // ground.rotate(BABYLON.Axis.X, 0, BABYLON.Space.WORLD)
        // ground.rotate(BABYLON.Axis.Y, 0, BABYLON.Space.WORLD)
        // ground.rotate(
        //   BABYLON.Axis.Z,
        //   // -3.1415926/6
        //   zT,
        //   BABYLON.Space.WORLD
        // )
        return scene
      }
      // call the createScene function
      let scene = createScene()
      // Initializer code...
      // scene setup code..
      // run the render loop 最后一步调用engine的runRenderLoop方案，执行scene.render()，让我们的3d场景渲染起来
      // 注册了一个渲染循环来在画布上重复渲染场景：
      engine.runRenderLoop(function () {
        scene.render()
      })
      // the canvas/window resize event handler 监听浏览器改变大小的事件，通过调用engine.resize()来自适应窗口大小
      window.addEventListener('resize', function () {
        engine.resize()
      })
      let showAxis = function (size) {
        let makeTextPlane = (text, color, size) => {
          let dynamicTexture = new BABYLON.DynamicTexture(
            'DynamicTexture',
            150,
            scene,
            true
          )
          dynamicTexture.hasAlpha = true
          dynamicTexture.drawText(
            text,
            5,
            40,
            'bold 36px Arial',
            color,
            'transparent',
            true
          )
          let plane = new BABYLON.Mesh.CreatePlane(
            'TextPlane',
            size,
            scene,
            true
          )
          plane.material = new BABYLON.StandardMaterial(
            'TextPlaneMaterial',
            scene
          )
          plane.material.backFaceCulling = false
          plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
          plane.material.diffuseTexture = dynamicTexture
          return plane
        }

        let axisX = BABYLON.Mesh.CreateLines(
          'axisX',
          [
            new BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0),
            new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
          ],
          scene
        )
        axisX.color = new BABYLON.Color3(1, 0, 0)
        let xChar = makeTextPlane('xRyGzB', 'red', size / 2)
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
        let axisY = BABYLON.Mesh.CreateLines(
          'axisY',
          [
            new BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0),
            new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
          ],
          scene
        )
        axisY.color = new BABYLON.Color3(0, 1, 0)
        // let yChar = makeTextPlane("Y", "green", size / 10);
        // yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
        let axisZ = BABYLON.Mesh.CreateLines(
          'axisZ',
          [
            new BABYLON.Vector3.Zero(),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size),
            new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
          ],
          scene
        )
        axisZ.color = new BABYLON.Color3(0, 0, 1)
        // let zChar = makeTextPlane("Z", "blue", size / 10);
        // zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
        // return [axisX,axisY,axisZ,xChar,yChar,zChar]
      }
      /***************************End World Axes***************************/

      // showAxis(8)

      // BABYLON.Mesh.

      // ---------------------------------datgui
      /**
       * datgui场景控制
       */
      let controlParams = {
        // scene: scene,
        engine: engine,
        GLTF2Export: GLTF2Export,
        scene: scene
      }
      const box = document.querySelector('#datGui')
      const gui_0_root = new dat.GUI({ autoPlace: false })
      box.appendChild(gui_0_root.domElement)
      datGuiControl(gui_0_root, controlParams)

      // GLTF2Export.GLTFAsync(scene, 'fileName').then((gltf) => {
      //   gltf.downloadFiles()
      // })
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