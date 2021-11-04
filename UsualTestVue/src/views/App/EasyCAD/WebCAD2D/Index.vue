<!-- CAD_23D zrender_2d babylon_3d-->
<template>
  <div class="displayList">
    <div id="container0" class="display"></div>
    <canvas id="container1" class="display"></canvas>
    <div id="container2" class="display"></div>
    <div id="container3" class="display"></div>
  </div>
</template>

<script>
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
          })
          circle.on('mousemove', function () {
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

        // group.position[0] = 300
        // group.position[1] = 300
      }
      {
        //1准备画布并获取WebGL呈现上下文,我们得到当前的html画布对象,并获得其WebGL呈现上下文。
        let canvas = document.getElementsByClassName('display')[1]
        var gl = canvas.getContext('webgl', { antialias: true, stencil: false })
        var vertices = [
          0.0, 0.0, 0.5, 0.5, 0.5, 0.0, 0.0, 0.0, -0.5, 0.5, -0.5, 0.0
        ]
        //2 Create a new buffer object缓冲对象中存储
        var vertex_buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(vertices),
          gl.STATIC_DRAW
        )
        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        /*3Create and compile Shader programs着色程序 */
        var vertCode =
          'attribute vec2 coordinates;' +
          'void main(void) {' +
          ' gl_Position = vec4(coordinates,0.0, 1.0);' +
          '}'
        var vertShader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(vertShader, vertCode)
        gl.compileShader(vertShader)
        //Fragment shader source code
        var fragCode =
          'void main(void) {' + 'gl_FragColor = vec4(1.0, 0.0, 0.0, 0.1);' + '}'
        var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(fragShader, fragCode)
        gl.compileShader(fragShader)
        // Create a shader program object to store combined shader program
        var shaderProgram = gl.createProgram()
        // Attach a vertex shader
        gl.attachShader(shaderProgram, vertShader)
        // Attach a fragment shader
        gl.attachShader(shaderProgram, fragShader)
        // Link both programs
        gl.linkProgram(shaderProgram)
        // Use the combined shader program object
        gl.useProgram(shaderProgram)
        /* 4: Associate the shader programs to buffer objects色程序与缓冲区对象相关联 */
        //Bind vertex buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer)
        //Get the attribute location
        var coord = gl.getAttribLocation(shaderProgram, 'coordinates')
        //point an attribute to the currently bound VBO
        gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0)
        //Enable the attribute
        gl.enableVertexAttribArray(coord)
        /* 5: Drawing the required object (triangle) */
        // Clear the canvas
        gl.clearColor(0.5, 0.5, 0.5, 0.9)
        // Enable the depth test
        gl.enable(gl.DEPTH_TEST)
        // Clear the color buffer bit
        gl.clear(gl.COLOR_BUFFER_BIT)
        // Set the view port
        gl.viewport(0, 0, canvas.width, canvas.height)
        // Draw the triangle
        gl.drawArrays(gl.TRIANGLES, 0, 1)
      }
      /******************************************************************************************* */
      // {
      //   // // 加载canvas或svg渲染器  调试默认加载两种
      //   // zrender.registerPainter('canvas', CanvasPainter)
      //   // // 模拟管线CAD  横截面
      //   // console.log('zrender版本1', zrender.version)
      //   let container = document.getElementsByClassName('display')[1]
      //   let engine = new JsPlot.EngineCAD(container)

      //   let option = {
      //     name: '坐标轴和管点',
      //     type: 'BaseShape',
      //     centerScale: [0.2, 0.2],
      //     dataXYRealMinMax: [0, 5, 17.5, 25],
      //     xyLines: [0, 0, 3 / 5, 3 / 5], //[xmin  ymin xmax ymax]
      //     dataXYCanvasScaleMinMax: [0, 0.2, 0.4, 0.6],
      //     infolineXYCanvasScaleMinMax: [0, 0.2, 0.4, 0.6],
      //     pipes: [
      //       {
      //         type: 'rect',
      //         position: [3, 5],
      //         shape: [1, 1]
      //       },
      //       {
      //         type: 'circle',
      //         position: [11, 11],
      //         shape: 1.5
      //       },
      //       {
      //         type: 'rect',
      //         position: [17.5, 25],
      //         shape: [2, 1]
      //       }
      //     ],
      //     ground: [
      //       [0, 10],
      //       [10, 13],
      //       [15, 30],
      //       [20, 20]
      //     ],
      //     infoline: [
      //       {
      //         style: {
      //           fill: '#ff0000',
      //           lineDash: [4]
      //         },
      //         shape: {
      //           x1: 0,
      //           y1: 0,
      //           x2: 400,
      //           y2: 0
      //         }
      //       },
      //       {
      //         style: {
      //           fill: '#ff0000',
      //           lineDash: [4]
      //         },
      //         shape: {
      //           x1: 0,
      //           y1: 0,
      //           x2: 0,
      //           y2: 300
      //         }
      //       }
      //     ],
      //     infoShow: [
      //       {
      //         name: '管底埋深',
      //         data: []
      //       },
      //       {
      //         name: '平面距离',
      //         data: []
      //       }
      //     ],
      //     infoCenterShow: [
      //       {
      //         name: '平面距离',
      //         data: []
      //       }
      //     ],
      //     circles: [
      //       {
      //         shape: {
      //           cx: 11,
      //           cy: 11,
      //           r: 1.5
      //         },
      //         style: {
      //           stroke: '#ccc',
      //           fill: 'white'
      //         }
      //       }
      //     ],
      //     rects: [
      //       {
      //         shape: {
      //           x: 3,
      //           y: 5,
      //           width: 1,
      //           height: 1
      //         },
      //         style: {
      //           stroke: '#ccc',
      //           fill: 'white'
      //         }
      //       },
      //       {
      //         shape: {
      //           x: 17.5,
      //           y: 25,
      //           width: 2,
      //           height: 1
      //         },
      //         style: {
      //           stroke: '#ccc',
      //           fill: 'white'
      //         }
      //       }
      //     ],
      //     polylines: [
      //       {
      //         shape: {
      //           points: [
      //             [0, 0],
      //             [10, 13],
      //             [15, 30],
      //             [20, 20]
      //           ]
      //         }
      //       }
      //     ],
      //     texts: [],
      //     lines: []
      //   }
      //   engine.addOption(option)
      //   engine.show()
      // }
      /**************************33333333 */
      {
        // 1 比例尺   坐标轴   数据位置   属性框位置
        // 参考天气不同高度
        // 坐标轴中心
        // 比例尺

        // 默认文本列位置？？？

        let container = document.getElementsByClassName('display')[2]
        let engine = new JsPlot.EngineCAD(container)

        // let canvasRect = container.getBoundingClientRect()
        // let canvasWidthHeight = [canvasRect.width, canvasRect.height]
        // let canvasWidth = canvasWidthHeight[0]
        // let canvasHeight = canvasWidthHeight[1]
        // // 比例尺
        // /****预设值-- */
        // // let centerScale = [1 / 5, 1 / 5] //像素
        // let xyScale = [3 / 5, 7 / 10] //总坐标轴   坐标轴与数据不一致
        // /****--预设值 */
        // // 预
        // // xy轴关联数据
        // let dataMock = [
        //   //mock 数据
        //   [20, 7000],
        //   [23, 8500],
        //   [30, 7000]
        // ] //所有数据依据data计算位置  属性显示单独   防止700-900    200-300中间略
        // let dataMockCile = [
        //   //mock 数据
        //   [10],
        //   [20],
        //   [10]
        // ]
        // // let data1 = [
        // //   [20, 200],
        // //   [23, 350],
        // //   [30, 200]
        // // ]
        // // 数据区间
        // // Math.max(...array1)
        // debugger
        // let dataXReal = [20, 30]
        // let dataYReal = [7000, 9000] //数据外延1/10 data
        // let dataXCanvasScale = [0, 2 / 5] //相对总坐标原点
        // let dataYCanvasScale = [1 / 5, 3 / 5]
        // // 真实数据 区间步长
        // let dataXYRealIntervalLength = [
        //   dataXReal[1] - dataXReal[0],
        //   dataYReal[1] - dataYReal[0]
        // ]
        // // 数据区间canvas比例范围

        // let dataXYCanvasScaleIntervalLength = [
        //   dataXCanvasScale[1] - dataXCanvasScale[0],
        //   dataYCanvasScale[1] - dataYCanvasScale[0]
        // ]
        // let dataXYCanvasIntervalLength = [
        //   canvasWidth * dataXYCanvasScaleIntervalLength[0],
        //   canvasHeight * dataXYCanvasScaleIntervalLength[1]
        // ]

        // // 数据-> canvas 仿射 尺寸-平移
        // // 尺寸变换
        // let Cx = dataXYCanvasIntervalLength[0] / dataXYRealIntervalLength[0]
        // let Cy = dataXYCanvasIntervalLength[1] / dataXYRealIntervalLength[1]

        // // 平移变换
        // let Tx = canvasWidth * dataXCanvasScale[0] - dataXReal[0] * Cx
        // let Ty = canvasHeight * dataYCanvasScale[0] - dataYReal[0] * Cy

        // // 尺寸平移简单仿射变换n*2
        // function trans2DSimple(dataArrays, Cx, Cy, Tx, Ty) {
        //   let dataResultArrays = []
        //   dataResultArrays[0] = dataArrays[0] * Cx + Tx
        //   dataResultArrays[1] = dataArrays[1] * Cy + Ty
        //   return dataResultArrays
        // }

        // let dataMockResult = []
        // dataMock.forEach((data) => {
        //   dataMockResult.push(trans2DSimple(data, Cx, Cy, Tx, Ty))
        // })

        // let circles = [
        //   {
        //     shape: {
        //       cx: 10,
        //       cy: 10,
        //       r: 10
        //     },
        //     position: [0, 0],
        //     style: {
        //       stroke: '#ccc',
        //       fill: 'white'
        //     },
        //     draggable: true //拖动
        //   }
        // ]

        // // console.log(dataMockResult)
        // for (let index = 0; index < dataMockResult.length; index++) {
        //   let data = dataMockResult[index]
        //   circles.push({
        //     shape: {
        //       cx: data[0],
        //       cy: data[1],
        //       r: dataMockCile[index][0]
        //     },
        //     style: {
        //       stroke: '#ccc',
        //       fill: 'white'
        //     },
        //     draggable: true //拖动
        //   })
        // }

        // // new engine.vector()
        // // Ratio
        // // let dataXRealToScaleRatio = [canvasWidth*data0xydScale[0]/]

        // // resize
        // let option = {
        //   name: '坐标轴和管点',
        //   type: 'BaseShape',
        //   centerScale: [1 / 5, 1 / 5], //单个group总体绘制原点
        //   data: [
        //     {
        //       style: { fill: '#ff0000', lineDash: [4] },
        //       shape: { x1: 0, y1: 0, x2: 400, y2: 0 }
        //     },
        //     {
        //       style: { fill: '#ff0000', lineDash: [4] },
        //       shape: { x1: 0, y1: 0, x2: 0, y2: 300 }
        //     }
        //   ],
        //   lines: [
        //     {
        //       style: { fill: '#ff0000', lineDash: [4] },
        //       shape: { x1: 0, y1: 0, x2: 400, y2: 0 }
        //     },
        //     {
        //       style: { fill: '#ff0000', lineDash: [4] },
        //       shape: { x1: 0, y1: 0, x2: 0, y2: 300 }
        //     }
        //   ],
        //   circlesReal: circles,
        //   rects: [
        //     {
        //       style: {
        //         stroke: '#000000',
        //         fill: '#FFFF0040'
        //       },
        //       shape: { x: 0, y: 0, width: 60, height: 60 }
        //     },
        //     {
        //       style: { fill: '#ff0000', text: 'testrects1' },
        //       shape: { x: 100, y: 0, width: 30, height: 10 }
        //     },
        //     {
        //       style: { fill: '#ff0000', text: 'testrects1' },
        //       shape: { x: 200, y: 200, width: 30, height: 30 }
        //     }
        //   ],
        //   polylines: [
        //     {
        //       shape: {
        //         points: [
        //           [0, 10],
        //           [10, 13],
        //           [15, 30],
        //           [20, 20]
        //         ]
        //       }
        //     }
        //   ],
        //   texts: [
        //     {
        //       style: {
        //         stroke: '#ccc',
        //         text: 'x标注测试'
        //         // textPosition:
        //       },
        //       position: [10, 10]
        //     }
        //   ]
        // }

        // engine.addOption(option)
        // engine.show()
      }
      {
        // 1 比例尺   坐标轴   数据位置   属性框位置
        // 参考天气不同高度
        // 坐标轴中心
        // 比例尺

        // 默认文本列位置？？？

        let container = document.getElementsByClassName('display')[3]
        let engineCAD = new JsPlot.EngineCADPipCross(container)

        let option = {
          //没有0的坐标轴   多指示坐标轴   底部分割信息栏轴
          unit: ['m', '米'],
          name: '坐标轴和管点',
          type: 'BaseShape',
          listenBool: true, //全局管线数据监听
          centerScale: [1 / 5, 3 / 20], //单个group总体绘制原点
          dataXYRealMinMax: [], //[xmin  ymin xmax ymax]
          dataXYCanvasScaleMinMax: [0, 1 / 20, 3 / 5, 3 / 5], //数据最大范围[xmin  ymin xmax ymax]相对总坐标原点 4 不与信息框重叠
          dataXYCanvasScaleAxisConsistent: false, //xy轴比例尺是否固定一致
          ScaleAxisShow: true,
          dpi: 96, //默认成图dpi dpi 为每英寸的像素数 辅助分辨率与比例尺换算
          // xyLines: [0, 0, 4 / 5, 7 / 10], //坐标轴范围[xmin  ymin xmax ymax]相对总坐标原点 4 不与信息框重叠
          yScaleplate: 10, //单比例尺标识长度   优先
          yScaleplateNumber: 5, //数据分割单比例尺标识长度数
          pipes: [
            {
              type: 'rect',
              position: [3, 5],
              shape: [1, 1],
              info: [
                { name: '地表高程', value: '1' },
                { name: '高程间距', value: '2' },
                { name: '管线编号', value: '3' },
                { name: '高程间距', value: '4' }
              ]
            },
            {
              type: 'circle',
              position: [11, 11],
              shape: 0.5,
              info: [
                { name: '地表高程', value: '1' },
                { name: '高程间距', value: '2' },
                { name: '管线编号', value: '3' },
                { name: '高程间距', value: '4' }
              ]
            },
            { type: 'rect', position: [17.5, 25], shape: [2, 1] },
            {
              type: 'circle',
              position: [42, -11],
              shape: 1
            },
            {
              type: 'circle',
              position: [32, -5],
              shape: 1
            },
            {
              type: 'circle',
              position: [52, 22],
              shape: 1,
              info: [
                { name: '地表高程', value: '1222' },
                { name: '高程间距', value: '2222' },
                { name: '管线编号', value: '3222' },
                { name: '高程间距', value: '4333' }
              ]
            }
          ], //转局部坐标后  z舍弃  y改为h   x变化拉伸   0起始
          ground: [
            [0, 10],
            [10, 13],
            [15, 30],
            [20, 20],
            [30, 13],
            [45, 30],
            [50, 20],
            [60, 20],
            [65, 30],
            [130, 20]
            // [150, 50],
            // [160, 10],
            // [170, 13]
          ],
          backgroundPolygons: [],
          infoShows: [
            { name: '地表高程', data: [], displayable: {} },
            { name: '里程', data: [], displayable: {} }
          ],
          infoCenterShow: [{ name: '平面间距', data: [], displayable: {} }], //数据插在中间
          mouseListen: {
            moveLinesRealTime: false, //只动态显示 非实时跟踪是否去除
            mouseLinesRealTimeEndShow: false //动态显示保留
          }
        }

        engineCAD.addOption(option)
        engineCAD.show()
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
  background-color: rgba(128, 128, 128, 0.171);
}
</style>
