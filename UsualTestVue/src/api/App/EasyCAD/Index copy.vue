<!-- CAD_23D zrender_2d babylon_3d-->
<template>
  <div class="displayList">
    <div id="container0" class="display"></div>
    <div id="container1" class="display"></div>
    <div id="container2" class="display"></div>
    <div id="container3" class="display"></div>
  </div>
</template>

<script >
import * as zrender from 'zrender/index.js'
import CanvasPainter from 'zrender/lib/canvas/Painter'
// import zrender from 'zrender'
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'

import * as JsPlot from './JsPlot'
export default {
  name: 'EasyCAD',
  setup() {
    //开始创建组件
    const object = reactive({ foo: 'bar' })
    //组件挂载页面之前执行
    onBeforeMount(() => {})
    //组件挂载到页面之后执行
    onMounted(() => {
      {
        // 加载canvas或svg渲染器  调试默认加载两种
        zrender.registerPainter('canvas', CanvasPainter)
        // 模拟管线CAD  横截面
        console.log('zrender版本1', zrender.version)
        let container = document.getElementsByClassName('display')[0]
        let viewerZr = zrender.init(container, { renderer: 'canvas' })

        let w = viewerZr.getWidth()
        let h = viewerZr.getHeight()

        let isMouseDown = false
        viewerZr.on('mousedown', function () {
          isMouseDown = true
        })
        viewerZr.on('mouseup', function () {
          isMouseDown = false
        })

        let elementStyle = {
          stroke: '#ccc',
          fill: 'white'
        }

        let group = new zrender.Group()
        for (let i = 0; i < 10; ++i) {
          let r = 50 * Math.random() + 20
          let circle = new zrender.Circle({
            shape: {
              cx: 0,
              cy: 0,
              r: r
            },
            position: [
              (w * 0.6 - r * 2) * Math.random() + r + w * 0.2,
              (h * 0.6 - r * 2) * Math.random() + r + h * 0.2
            ],
            style: elementStyle,
            draggable: true
          }).on('mousemove', function () {
            if (isMouseDown) {
              let rect = group.getBoundingRect()
              boundingRect.setShape({
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: rect.height
              })
            }
          })
          group.add(circle)
        }
        viewerZr.add(group)

        let rect = group.getBoundingRect()
        let boundingRect = new zrender.Rect({
          shape: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          },
          style: {
            fill: 'none',
            stroke: '#14f1ff'
          }
        })
        viewerZr.add(boundingRect)
        viewerZr.resize()
      }
      /******************************************************************************************* */
      {
        // // 加载canvas或svg渲染器  调试默认加载两种
        // zrender.registerPainter('canvas', CanvasPainter)
        // // 模拟管线CAD  横截面
        // console.log('zrender版本1', zrender.version)
        let container = document.getElementsByClassName('display')[1]
        let viewerZr = zrender.init(container, { renderer: 'canvas' })
        viewerZr.resize()
        let w = viewerZr.getWidth()
        let h = viewerZr.getHeight()

        let isMouseDown = false
        viewerZr.on('mousedown', function () {
          isMouseDown = true
        })
        viewerZr.on('mouseup', function () {
          isMouseDown = false
        })

        let elementStyle = {
          stroke: '#ccc',
          fill: 'white'
        }

        // x坐标轴标注
        let text = new zrender.Text({
          style: {
            stroke: '#ccc',
            text: 'x标注resize测试'
            // textPosition:
          }
        })
        viewerZr.add(text)

        // 管线
        let r = 10
        let circle = new zrender.Circle({
          shape: {
            cx: viewerZr.getWidth() / 2,
            cy: viewerZr.getHeight() / 2,
            r: r
          },
          style: elementStyle
          // draggable: true //拖动
        })

        viewerZr.add(circle)
        // window.onresize = () => {
        //   console.log('-------------------', viewerZr.getHeight())
        //   viewerZr.resize()
        // }
        window.addEventListener('resize', () => {
          console.log('-------------------', viewerZr.getHeight())
          console.log('-------------------', viewerZr.getWidth())
          // viewerZr.refresh()
          viewerZr.resize()
          console.log('-----------1111--------', viewerZr.getHeight())
          console.log('----------333---------', viewerZr.getWidth())
        })
      }
      /**************************33333333 */
      {
 

        // 默认文本列位置？？？

        let container = document.getElementsByClassName('display')[2]
        let engine = new JsPlot.Engine(container)
        let canvasWidthHeight = engine.getWidthHeightArray()
        
        
        // 比例尺

        let canvasWidth =canvasWidthHeight[0]
        let canvasHeight =canvasWidthHeight[1]
        let centerScale = [1/3,/1/5]

        let center = [canvasWidth*centerScale[0],canvasHeight*(1-centerScale[1])]
// resize
        // window.addEventListener('resize', () => {
        //   engine.resize()
        //   console.log('-------------------', viewerZr.getHeight())
        //   console.log('-------------------', viewerZr.getWidth())
        //   // viewerZr.refresh()
        //   viewerZr.resize()
        //   console.log('-----------1111--------', viewerZr.getHeight())
        //   console.log('----------333---------', viewerZr.getWidth())
        // })
               // 坐标轴中心
        // 比例尺
        // let xScale =
        let option = {
          name: '坐标轴和管点',
          type: 'BaseShape',
          center: center,
          lines: [
            {
              style: { fill: '#ff0000' },
              shape: { x1: 0, y1: 0, x2: 400, y2: 0 }
            },
            { shape: { x1: 0, y1: 0, x2: 0, y2: 300 } }
          ],
          circles: [
            {
              shape: {
                cx: 10,
                cy: 10,
                r: 10
              },
              position: [0, 0],
              style: {
                stroke: '#ccc',
                fill: 'white'
              },
              draggable: true //拖动
            }
          ],
          rects: [
            {
              style: {
                stroke: '#000000',
                fill: '#FFFF0040'
              },
              shape: { x: 0, y: 0, width: 60, height: 60 }
            },
            {
              style: { fill: '#ff0000', text: 'testrects1' },
              shape: { x: 100, y: 0, width: 30, height: 10 }
            },
            {
              style: { fill: '#ff0000', text: 'testrects1' },
              shape: { x: 200, y: 200, width: 30, height: 30 }
            }
          ],
          texts: [
            {
              style: {
                stroke: '#ccc',
                text: 'x标注测试'
                // textPosition:
              },
              position: [10, 10]
            }
          ]
        }
        engine.addOption(option)
        engine.show()
      }
    })
    return {
      object
    }
  }
}
</script>
<style scoped>
.displayList {
  /* width: 100%; */
  height: 100%;
  display: flex;
  flex-wrap: wrap;
}

.display {
  width: 50%;
  height: 50%;
  /* border: 0.1rem solid rgba(0, 0, 0, 0.418); */
  box-shadow: inset 0px 0px 0px 1px rgba(0, 0, 0, 0.267);
  /* float: left; */
  /* touch-action: none; */
}
</style>