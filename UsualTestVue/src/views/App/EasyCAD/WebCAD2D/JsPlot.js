import * as zrender from 'zrender/index.js'
// import { ZRender } from 'zrender/index.js'
import CanvasPainter from 'zrender/lib/canvas/Painter'
/**
 * 二维单canvas绘制
 * pixijs??   极简和复杂  直接bbl
 *
 * 依赖一个矩阵计算库   webgl/webgpu
 *
 */
class Engine {
  /**
   *
   * @param {Element} dom
   */
  constructor(dom, opts) {
    // 5.11必须添加
    zrender.registerPainter('canvas', CanvasPainter)
    let defaultRenderer = 'canvas'
    this._dom = dom
    this._zr = zrender.init(dom, { renderer: 'canvas' })
    // this._zr = zrender.init(dom, {
    //   renderer: opts.renderer || defaultRenderer,
    //   devicePixelRatio: opts.devicePixelRatio,
    //   width: opts.width,
    //   height: opts.height,
    //   // useDirtyRect: opts.useDirtyRect == null ? defaultUseDirtyRect : opts.useDirtyRect
    // });
    this.options = new Map()
    // this._zr.resize()

    this.canvasRect = dom.getBoundingClientRect()
    this.canvasWidthHeight = [this.canvasRect.width, this.canvasRect.height]
    this.canvasWidth = this.canvasWidthHeight[0]
    this.canvasHeight = this.canvasWidthHeight[1]
  }

  /**
   *
   * @returns [w,h]
   */
  getWidthHeightArray() {
    this._zr.resize()
    // return [this._zr.getWidth(), this._zr.getHeight()]
    let canvasRect = this._dom.getBoundingClientRect()
    let canvasWidthHeight = [canvasRect.width, canvasRect.height]
    return canvasWidthHeight
  }

  addOption(option) {
    //TODO option预处理
    //
    this.options.set(option.name, option)
  }

  /**
   * 分group 支持统一挪动
   */
  show() {
    this.options.forEach((option) => {
      // this.groups.set()
      let group = new zrender.Group()
      // 绑定group  辅助整组偏移
      option.group = this.group
      this._zr.add(group)

      if (option.type == 'BaseShape') {
        let baseShape = new BaseShape(group, option, this._zr)
        // baseShape.test()
        baseShape.show()
      }
    })
  }

  /**
   * TODO 自动缩放
   */
  resize() {
    this._zr.resize()
    this.options.forEach((option) => {})
  }
  vector() {
    return this._zr.vector()
  }
}

class BaseShape {
  /**
   *
   * @param {Object} state
   */
  constructor(group, state, _zr) {
    this.group = group
    this.state = state
    this._zr = _zr
  }

  show() {
    let baseX = this.state.center[0]
    let baseY = this.state.center[1]

    // this.state.backgroundPolygons && this.state.backgroundPolygons.forEach((shapeState) => {

    //   shapeState.shape.points.forEach(point => {
    //     point[0] += baseX
    //     point[1] = baseY - point[1]
    //   });
    //   let polyline = new zrender.Polygon(shapeState)
    //   this.group.add(polyline)
    // })

    this.state.arcs &&
      this.state.arcs.forEach((shapeState) => {
        shapeState.shape.cx += baseX
        shapeState.shape.cy = baseY - shapeState.shape.cy
        let arc = new zrender.Arc(shapeState)
        this.group.add(arc)
      })

    this.state.bezierCurves &&
      this.state.bezierCurves.forEach((shapeState) => {
        shapeState.shape.x1 += baseX
        shapeState.shape.y1 = baseY - shapeState.shape.y1
        shapeState.shape.x2 += baseX
        shapeState.shape.y2 = baseY - shapeState.shape.y2
        shapeState.shape.cpx1 += baseX
        shapeState.shape.cpy1 = baseY - shapeState.shape.cpy1
        let bezierCurve = new zrender.BezierCurve(shapeState)
        this.group.add(bezierCurve)
      })

    this.state.circles &&
      this.state.circles.forEach((shapeState) => {
        shapeState.shape.cx += baseX
        shapeState.shape.cy = baseY - shapeState.shape.cy
        let circle = new zrender.Circle(shapeState)
        // 事件
        shapeState.actionBool &&
          shapeState.action(circle, shapeState, this._zr, this.group)

        this.group.add(circle)
      })

    // CompoundPath
    this.state.droplets &&
      this.state.droplets.forEach((shapeState) => {
        shapeState.shape.cx += baseX
        shapeState.shape.cy = baseY - shapeState.shape.cy
        let droplet = new zrender.Droplet(shapeState)
        this.group.add(droplet)
      })
    this.state.ellipses &&
      this.state.ellipses.forEach((shapeState) => {
        let shapeNew = trans2DSimple12(
          [shapeState.shape.cx, shapeState.shape.cy],
          this.state.center
        )
        shapeState.shape.cx = shapeNew[0]
        shapeState.shape.cy = shapeNew[1]
        shapeNew = trans2DSimple12(
          [shapeState.shape.rx, shapeState.shape.ry],
          this.state.center
        )
        shapeState.shape.rx = shapeNew[0]
        shapeState.shape.ry = shapeNew[1]
        // shapeState.shape.cx += baseX
        // shapeState.shape.cy = baseY - shapeState.shape.cy
        // shapeState.shape.rx += baseX
        // shapeState.shape.ry = baseY - shapeState.shape.ry
        let ellipse = new zrender.Ellipse(shapeState)
        this.group.add(ellipse)
      })

    this.state.lines &&
      this.state.lines.forEach((shapeState) => {
        let shapeNew = trans2DSimple12(
          [shapeState.shape.x1, shapeState.shape.y1],
          this.state.center
        )
        shapeState.shape.x1 = shapeNew[0]
        shapeState.shape.y1 = shapeNew[1]
        shapeNew = trans2DSimple12(
          [shapeState.shape.x2, shapeState.shape.y2],
          this.state.center
        )
        shapeState.shape.x2 = shapeNew[0]
        shapeState.shape.y2 = shapeNew[1]
        let line = new zrender.Line(shapeState)
        this.group.add(line)
      })

    this.state.polygons &&
      this.state.polygons.forEach((shapeState) => {
        shapeState.shape.points.forEach((point) => {
          trans2DSimple12(point, this.state.center)
        })
        let polyline = new zrender.Polygon(shapeState)
        this.group.add(polyline)
      })

    this.state.polylines &&
      this.state.polylines.forEach((shapeState) => {
        shapeState.shape.points.forEach((point) => {
          trans2DSimple12(point, this.state.center)
        })
        let polyline = new zrender.Polyline(shapeState)
        this.group.add(polyline)
      })

    this.state.rects &&
      this.state.rects.forEach((shapeState) => {
        let shapeNew = trans2DSimple12(
          [shapeState.shape.x, shapeState.shape.y],
          this.state.center
        )
        shapeState.shape.x = shapeNew[0]
        shapeState.shape.y = shapeNew[1]
        let rect = new zrender.Rect(shapeState)
        // 事件
        shapeState.actionBool &&
          shapeState.action(rect, shapeState, this._zr, this.group)
        this.group.add(rect)
      })

    this.state.texts &&
      this.state.texts.forEach((shapeState) => {
        shapeState.position[0] += baseX
        shapeState.position[1] = baseY - shapeState.position[1]
        let text = new zrender.Text(shapeState)

        this.group.add(text)
      })
  }
}

class EngineCAD extends Engine {
  /**
   *
   * @param {*} dom
   * @param {*} opts
   */
  constructor(dom, opts) {
    super(dom, opts)
    // super()
  }

  /**
   *
   * @param {*} option 制定具体单数据比例尺等
   */
  addOption(option) {
    this.centerTrans(option)
    this.addBound(option)
    // this.addinfo(option)
    this.setListen(option)

    if (option.ScaleAxisShow) {
      this.setScaleAxisLegend(option.dpi, option.Cx, option.Cy, option)
    }
    super.addOption(option)
  }

  // // 跟踪点信息
  // addinfo(option) {

  // }
  //
  /**
   * 设置比例尺图例
   * @param {*} dpi  像素pixel/英寸inches
   * @param {*} scaleX 横轴 pixel/米m（真实距离）
   * @param {*} scaleY 纵轴 pixel/米m（真实距离）
   */
  setScaleAxisLegend(dpi, scaleX, scaleY, option) {
    const inches = 0.0254 //  0.0254m（屏幕距离）/英寸inches
    let xScaleGraphReal = dpi / (inches * scaleX) //real（真实距离）/graph（屏幕距离） 比例尺1:xScaleGraphReal
    let yScaleGraphReal = dpi / (inches * scaleY) //real/graph
    let fontSize = 20
    option.texts.push({
      style: {
        fontSize: fontSize,
        stroke: '#ccc',
        text: '比例尺（dpi96）',
      },
      position: [
        option.xyLinesCanvas[0] - 7.5 * fontSize,
        option.xyLinesCanvas[3] - 10,
      ],
    })
    option.texts.push({
      style: {
        fontSize: fontSize,
        stroke: '#ccc',
        text: '横轴：1/' + Math.round(xScaleGraphReal),
      },
      position: [
        option.xyLinesCanvas[0] - 7.5 * fontSize,
        option.xyLinesCanvas[3] - 15 - fontSize,
      ],
    })
    option.texts.push({
      style: {
        fontSize: fontSize,
        stroke: '#ccc',
        text: '纵轴：1/' + Math.round(yScaleGraphReal),
      },
      position: [
        option.xyLinesCanvas[0] - 7.5 * fontSize,
        option.xyLinesCanvas[3] - 20 - 2 * fontSize,
      ],
    })
  }

  // 横纵坐标监听绘制
  setListen(option) {
    // 鼠标坐标轴监听
    let mouseLineDraw = (
      offsetX,
      offsetY,
      offsetXdata,
      offsetYdata,
      option,
      mouseCrosshairX,
      mouseCrosshairY,
      mouseCrosshairXOption,
      mouseCrosshairYOption,
      style,
      mouseCrosshairXText,
      mouseCrosshairYText,
      mouseCrosshairXTextOption,
      mouseCrosshairYTextOption,
      textStyleUnRealTime
    ) => {
      if (
        offsetX > option.xyLinesCenterChangeCanvas[0] &&
        offsetY < option.xyLinesCenterChangeCanvas[1] &&
        offsetX < option.xyLinesCenterChangeCanvas[2] &&
        offsetY > option.xyLinesCenterChangeCanvas[3]
      ) {
        mouseCrosshairXOption = {
          shape: {
            x1: offsetXdata,
            y1: option.xyLinesCenterChangeCanvas[1],
            x2: offsetXdata,
            y2: option.xyLinesCenterChangeCanvas[3],
          },
          style: style || { lineDash: [4] },
        }
        mouseCrosshairYOption = {
          shape: {
            x1: option.xyLinesCenterChangeCanvas[0],
            y1: offsetYdata,
            x2: option.xyLinesCenterChangeCanvas[2],
            y2: offsetYdata,
          },

          style: style || { lineDash: [4] },
        }
        mouseCrosshairXTextOption = {
          position: [offsetXdata - 5, option.xyLinesCenterChangeCanvas[1] + 5],
          style: textStyleUnRealTime[0],
        }
        mouseCrosshairYTextOption = {
          position: [option.xyLinesCenterChangeCanvas[0] - 30, offsetYdata - 5],
          style: textStyleUnRealTime[1],
        }
      } else {
        mouseCrosshairXOption = {
          shape: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          },
        }
        mouseCrosshairYOption = {
          shape: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          },
        }
        mouseCrosshairXTextOption = {
          position: [0, 0],
          style: {
            fontSize: 8,
            text: null,
          },
        }
        mouseCrosshairYTextOption = {
          position: [0, 0],
          style: {
            fontSize: 8,
            text: null,
          },
        }
      }

      mouseCrosshairX.setShape(mouseCrosshairXOption.shape)
      mouseCrosshairY.setShape(mouseCrosshairYOption.shape)
      mouseCrosshairX.setStyle(mouseCrosshairXOption.style)
      mouseCrosshairY.setStyle(mouseCrosshairYOption.style)
      mouseCrosshairXText.setStyle(mouseCrosshairXTextOption.style)
      mouseCrosshairXText.setPosition(mouseCrosshairXTextOption.position)
      mouseCrosshairYText.setStyle(mouseCrosshairYTextOption.style)
      mouseCrosshairYText.setPosition(mouseCrosshairYTextOption.position)
    }

    if (option.mouseListen) {
      let mouseCrosshairXRealTime, mouseCrosshairYRealTime
      mouseCrosshairXRealTime = new zrender.Line()
      mouseCrosshairYRealTime = new zrender.Line()
      this._zr.add(mouseCrosshairXRealTime)
      this._zr.add(mouseCrosshairYRealTime)
      let mouseCrosshairX, mouseCrosshairY
      mouseCrosshairX = new zrender.Line()
      mouseCrosshairY = new zrender.Line()
      this._zr.add(mouseCrosshairX)
      this._zr.add(mouseCrosshairY)

      let mouseCrosshairXText, mouseCrosshairYText
      mouseCrosshairXText = new zrender.Text()
      mouseCrosshairYText = new zrender.Text()
      this._zr.add(mouseCrosshairXText)
      this._zr.add(mouseCrosshairYText)

      let mouseCrosshairXTextRealTime, mouseCrosshairYTextRealTime
      mouseCrosshairXTextRealTime = new zrender.Text()
      mouseCrosshairYTextRealTime = new zrender.Text()
      this._zr.add(mouseCrosshairXTextRealTime)
      this._zr.add(mouseCrosshairYTextRealTime)

      // 信息
      let pipeinfoGroup

      // 鼠标监听
      let mouseNow = [0, 0]
      let mouseOld = [999, 999]
      let mouseNoMove = null
      this._zr.on('mousemove', (mouse) => {
        let styleUnRealTime = { lineDash: [4] }
        let styleRealTime = { lineDash: [4], stroke: '#708090' }
        let mouseCrosshairXOption, mouseCrosshairYOption
        let mouseCrosshairXRealTimeOption, mouseCrosshairYRealTimeOption
        let mouseCrosshairXTextOption, mouseCrosshairYTextOption
        let mouseCrosshairXTextOptionRealTime, mouseCrosshairYTextOptionRealTime
        let textStyleUnRealTime = [
          {
            fontSize: 8,
            text: 'test0',
          },
          {
            fontSize: 8,
            text: 'test1',
          },
        ]
        let textStyleRealTime = [
          {
            fill: '#708090',
            fontSize: 8,
            text: 'test0R',
          },
          {
            fill: '#708090',
            fontSize: 8,
            text: 'test1R',
          },
        ]
        // 是否实时计算
        if (!option.mouseListen.moveLinesRealTime) {
          mouseNow = [mouse.offsetX, mouse.offsetY]
          // 鼠标停顿一秒计算显示数值
          if (!mouseNoMove) {
            mouseNoMove = setInterval(() => {
              if (mouseOld[0] == mouseNow[0]) {
                //比较一个轴就可以
                styleRealTime = { lineDash: [4] }
                //根据mouseNow计算最近数据

                let mouseDataPositon = trans2DSimple02back(
                  [mouseNow[0], mouseNow[1]],
                  option.Cx,
                  option.Tx,
                  option.Cy,
                  option.Ty,
                  option.center
                )
                let mindOld =
                  Math.pow(mouseDataPositon[0] - option.ground[0][0], 2) +
                  Math.pow(mouseDataPositon[1] - option.ground[0][1], 2)
                let mindNew
                // 地表选择
                let mindIndexGround = -1 //游标  最终值-1不启用
                for (let i = 0; i < option.ground.length; i++) {
                  const element = option.ground[i]
                  mindNew =
                    Math.pow(mouseDataPositon[0] - element[0], 2) +
                    Math.pow(mouseDataPositon[1] - element[1], 2)
                  if (mindNew <= mindOld) {
                    mindOld = mindNew
                    mindIndexGround = i
                  }
                }
                // mouseDataPositon = option.ground[mindIndexGround]
                // 管线选择
                let mindIndexPipes = -1
                for (let i = 0; i < option.pipes.length; i++) {
                  const element = option.pipes[i].position
                  mindNew =
                    Math.pow(mouseDataPositon[0] - element[0], 2) +
                    Math.pow(mouseDataPositon[1] - element[1], 2)
                  if (mindNew <= mindOld) {
                    mindOld = mindNew
                    mindIndexPipes = i
                  }
                }
                let dataPositon
                let endDataPositon
                if (mindIndexGround >= 0 && mindIndexPipes < 0) {
                  dataPositon = option.ground[mindIndexGround]
                  endDataPositon = trans2DSimple02(
                    dataPositon.slice(),
                    option.Cx,
                    option.Tx,
                    option.Cy,
                    option.Ty,
                    option.center
                  )
                }

                // 管线信息
                if (pipeinfoGroup) {
                  pipeinfoGroup.removeAll()
                } else {
                  pipeinfoGroup = new zrender.Group()
                  this._zr.add(pipeinfoGroup)
                }
                if (mindIndexPipes >= 0) {
                  dataPositon = option.pipes[mindIndexPipes].position
                  endDataPositon = trans2DSimple02(
                    dataPositon.slice(),
                    option.Cx,
                    option.Tx,
                    option.Cy,
                    option.Ty,
                    option.center
                  )

                  // 显示管线信息

                  let fontSize = 10
                  let count = 10
                  option.pipes[mindIndexPipes].info &&
                    option.pipes[mindIndexPipes].info.forEach((pipeinfo) => {
                      let pipeinfoTextName = new zrender.Text()
                      pipeinfoGroup.add(pipeinfoTextName)
                      console.log('endDataPositon', endDataPositon)
                      count += fontSize * 1.5
                      let pipeinfoTexttOption = {
                        position: [
                          endDataPositon[0] + fontSize,
                          endDataPositon[1] + count,
                        ],
                        style: {
                          fontSize: fontSize,
                          text: pipeinfo.name + ':',
                        },
                      }
                      pipeinfoTextName.setPosition(pipeinfoTexttOption.position)
                      pipeinfoTextName.setStyle(pipeinfoTexttOption.style)
                      // let pipeinfoTextValue
                      // pipeinfoTextValue = new zrender.Text()
                      // this._zr.add(pipeinfoTextValue)

                      let pipeinfoTextValue = new zrender.Text()
                      pipeinfoGroup.add(pipeinfoTextValue)
                      let pipeinfoTextValueOption = {
                        position: [
                          endDataPositon[0] + fontSize * 5.5,
                          endDataPositon[1] + count,
                        ],
                        style: {
                          fontSize: fontSize - 1,
                          text: pipeinfo.value,
                        },
                      }
                      pipeinfoTextValue.setPosition(
                        pipeinfoTextValueOption.position
                      )
                      pipeinfoTextValue.setStyle(pipeinfoTextValueOption.style)
                    })

                  // 计算地表插值
                }

                // 整体数据变换   、、、、TODO复用？？
                styleUnRealTime = { lineDash: [4] }
                textStyleUnRealTime = [
                  {
                    // fill: '#708090',
                    fontSize: 8,
                    text: dataPositon[0],
                  },
                  {
                    // fill: '#708090',
                    fontSize: 8,
                    text: dataPositon[1],
                  },
                ]

                mouseLineDraw(
                  mouseNow[0],
                  mouseNow[1],
                  endDataPositon[0],
                  endDataPositon[1],
                  option,
                  mouseCrosshairX,
                  mouseCrosshairY,
                  mouseCrosshairXOption,
                  mouseCrosshairYOption,
                  styleUnRealTime,
                  mouseCrosshairXText,
                  mouseCrosshairYText,
                  mouseCrosshairXTextOption,
                  mouseCrosshairYTextOption,
                  textStyleUnRealTime
                )

                // 隐藏实时线
                if (!option.mouseListen.mouseLinesRealTimeEndShow) {
                  styleRealTime = { lineDash: [4], stroke: '#FF000000' }
                  textStyleRealTime = [
                    {
                      fill: '#708090',
                      fontSize: 8,
                      text: null,
                    },
                    {
                      fill: '#708090',
                      fontSize: 8,
                      text: null,
                    },
                  ]
                }

                mouseLineDraw(
                  mouseNow[0],
                  mouseNow[1],
                  mouseNow[0],
                  mouseNow[1],
                  option,
                  mouseCrosshairXRealTime,
                  mouseCrosshairYRealTime,
                  mouseCrosshairXRealTimeOption,
                  mouseCrosshairYRealTimeOption,
                  styleRealTime,
                  mouseCrosshairXTextRealTime,
                  mouseCrosshairYTextRealTime,
                  mouseCrosshairXTextOptionRealTime,
                  mouseCrosshairYTextOptionRealTime,
                  textStyleRealTime
                )
                clearInterval(mouseNoMove)
                mouseNoMove = null
              }
              mouseOld = mouseNow.slice() //mouseNow必须引用  新值   mouse.offsetX为旧值
            }, 168)
          }
        }
        // 绘制实时线和标注
        let mouseTextPositon = trans2DSimple02back(
          [mouseNow[0], mouseNow[1]],
          option.Cx,
          option.Tx,
          option.Cy,
          option.Ty,
          option.center
        )
        textStyleRealTime = [
          {
            fill: '#708090',
            fontSize: 8,
            text: mouseTextPositon[0].toFixed(2),
          },
          {
            fill: '#708090',
            fontSize: 8,
            text: mouseTextPositon[1].toFixed(2),
          },
        ]
        mouseLineDraw(
          mouse.offsetX,
          mouse.offsetY,
          mouse.offsetX,
          mouse.offsetY,
          option,
          mouseCrosshairXRealTime,
          mouseCrosshairYRealTime,
          mouseCrosshairXRealTimeOption,
          mouseCrosshairYRealTimeOption,
          styleRealTime,
          mouseCrosshairXTextRealTime,
          mouseCrosshairYTextRealTime,
          mouseCrosshairXTextOptionRealTime,
          mouseCrosshairYTextOptionRealTime,
          textStyleRealTime
        )
      })
    }
  }
  //坐标转换参数确认 坐标轴 比例尺线
  centerTrans(option) {
    // 预处理
    debugger
    let dataXReal = [option.dataXYRealMinMax[0], option.dataXYRealMinMax[2]]
    let dataYReal = [option.dataXYRealMinMax[1], option.dataXYRealMinMax[3]] //数据外延1/10 data
    let dataXCanvasScale = [
      option.dataXYCanvasScaleMinMax[0],
      option.dataXYCanvasScaleMinMax[2],
    ] //相对总坐标原点
    let dataYCanvasScale = [
      option.dataXYCanvasScaleMinMax[1],
      option.dataXYCanvasScaleMinMax[3],
    ]
    // 真实数据 区间步长
    let dataXYRealIntervalLength = [
      dataXReal[1] - dataXReal[0],
      dataYReal[1] - dataYReal[0],
    ]
    // 获取比例尺显示最小单位    比例尺显示   外扩
    option.yScaleplate ||
      (option.yScaleplate = Math.ceil(
        dataXYRealIntervalLength[1] / option.yScaleplateNumber
      )) //坐标轴步长
    dataYReal[0] =
      Math.floor(dataYReal[0] / option.yScaleplate) * option.yScaleplate
    dataYReal[1] =
      Math.ceil(dataYReal[1] / option.yScaleplate) * option.yScaleplate
    // 更新
    dataXYRealIntervalLength = [
      dataXReal[1] - dataXReal[0],
      dataYReal[1] - dataYReal[0],
    ]

    // 数据区间canvas比例范围
    let dataXYCanvasScaleIntervalLength = [
      dataXCanvasScale[1] - dataXCanvasScale[0],
      dataYCanvasScale[1] - dataYCanvasScale[0],
    ]
    let dataXYCanvasIntervalLength = [
      this.canvasWidth * dataXYCanvasScaleIntervalLength[0],
      this.canvasHeight * dataXYCanvasScaleIntervalLength[1],
    ]

    // TODO   ！！！根据数据宽高比修改canvas长宽

    option.center = [
      this.canvasWidth * option.centerScale[0],
      this.canvasHeight * (1 - option.centerScale[1]),
    ]
    // 仿射变换参数
    // let Cx, Cy, Tx, Ty
    // xy轴比例尺是否固定一致    不一致按xy固定
    if (!option.dataXYCanvasScaleAxisConsistent) {
      option.Cx = dataXYCanvasIntervalLength[0] / dataXYRealIntervalLength[0]
      option.Cy = dataXYCanvasIntervalLength[1] / dataXYRealIntervalLength[1]
    } else if (
      dataXYRealIntervalLength[0] / this.canvasWidth >
      dataXYRealIntervalLength[1] / this.canvasHeight
    ) {
      //x轴长为主轴  考虑总尺寸拉伸
      option.Cy = option.Cx =
        dataXYCanvasIntervalLength[0] / dataXYRealIntervalLength[0]
    } else {
      // 数据-> canvas 仿射 尺寸-平移
      // 尺寸变换
      option.Cx = option.Cy =
        dataXYCanvasIntervalLength[1] / dataXYRealIntervalLength[1]
    }

    // 平移变换
    option.Tx =
      this.canvasWidth * dataXCanvasScale[0] - dataXReal[0] * option.Cx
    option.Ty =
      this.canvasHeight * dataYCanvasScale[0] - dataYReal[0] * option.Cy
    if (option.dataXYCanvasScaleMinMaxDefine) {
      //固定时
      // 数据-> canvas 仿射 尺寸-平移
      // 尺寸变换
      option.Cx = dataXYCanvasIntervalLength[0] / dataXYRealIntervalLength[0]
      option.Cy = dataXYCanvasIntervalLength[1] / dataXYRealIntervalLength[1]
      // 平移变换
      option.Tx =
        this.canvasWidth * dataXCanvasScale[0] - dataXReal[0] * option.Cx
      option.Ty =
        this.canvasHeight * dataYCanvasScale[0] - dataYReal[0] * option.Cy
    }

    //坐标轴比例范围[xmin  ymin xmax ymax]  优先根据数据计算
    if (!option.xyLines) {
      option.xyLines = [
        0,
        0,
        dataXCanvasScale[0] +
          1 / 20 +
          (dataXYRealIntervalLength[0] / this.canvasWidth) * option.Cx,
        dataYCanvasScale[0] +
          1 / 10 +
          (dataXYRealIntervalLength[1] / this.canvasHeight) * option.Cy,
      ]
    }

    // 1场景数据范围
    option.xyLinesCanvas = [
      option.xyLines[0] * this.canvasWidth,
      option.xyLines[1] * this.canvasHeight,
      option.xyLines[2] * this.canvasWidth,
      option.xyLines[3] * this.canvasHeight,
    ]
    // 2场景数据范围
    option.xyLinesCenterChangeCanvas = [
      option.xyLinesCanvas[0] + option.center[0],
      option.center[1] - option.xyLinesCanvas[1],
      option.xyLinesCanvas[2] + option.center[0],
      option.center[1] - option.xyLinesCanvas[3],
    ]

    // 平移尺寸 简单仿射变换n*2
    option.circles.forEach((data) => {
      data.shape.r = data.shape.r * option.Cy //!!!!!圆形以y轴为准
      data.shape.cx = data.shape.cx * option.Cx + option.Tx
      data.shape.cy = data.shape.cy * option.Cy + option.Ty
    })
    option.rects.forEach((data) => {
      //矩形拉伸
      data.shape.width = data.shape.width * option.Cx
      data.shape.height = data.shape.height * option.Cy
      data.shape.x = data.shape.x * option.Cx + option.Tx
      data.shape.y = data.shape.y * option.Cy + option.Ty
    })
    option.polylines.forEach((data) => {
      data.shape.points.forEach((point) => {
        point[0] = point[0] * option.Cx + option.Tx
        point[1] = point[1] * option.Cy + option.Ty
      })
    })

    // x分割轴
    let lineyWeight = 5 //坐标轴x轴线宽
    option.lines.push({
      shape: {
        x1: option.xyLinesCanvas[0] - lineyWeight / 2,
        y1: option.xyLinesCanvas[1],
        x2: option.xyLinesCanvas[0] - lineyWeight / 2,
        y2: option.xyLinesCanvas[3],
      },
      style: {
        lineWidth: lineyWeight,
      },
    })
    let yScaleplateCanvas = option.yScaleplate * option.Cy

    // let yLinesD = (option.xyLines[3] - option.xyLines[1]) * this.canvasHeight
    let yLinesDup =
      (option.xyLines[3] - option.dataXYCanvasScaleMinMax[1]) *
      this.canvasHeight
    let yLinesDdown =
      (option.dataXYCanvasScaleMinMax[1] - option.xyLines[0]) *
      this.canvasHeight

    // y轴比例尺线
    for (let index = 0; index < yLinesDup / yScaleplateCanvas / 2; index++) {
      let x1 =
        option.dataXYCanvasScaleMinMax[0] * this.canvasWidth - lineyWeight / 2
      let y1 =
        option.dataXYCanvasScaleMinMax[1] * this.canvasHeight +
        2 * index * yScaleplateCanvas
      let x2 =
        option.dataXYCanvasScaleMinMax[0] * this.canvasWidth - lineyWeight / 2
      let y2 =
        option.dataXYCanvasScaleMinMax[1] * this.canvasHeight +
        (2 * index + 1) * yScaleplateCanvas
      option.lines.push({
        shape: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        },
        style: {
          lineWidth: (lineyWeight - 1) / 2,
          stroke: '#FFFFFF',
          // stroke: '#FF0000a0'
        },
      })

      if (index % 2 == 0 || true) {
        option.texts.push({
          style: {
            fontSize: 8,
            stroke: '#ccc',
            text: Math.round(
              trans2DSimple01Back(
                x1,
                y1,
                option.Cx,
                option.Cy,
                option.Tx,
                option.Ty
              )[1]
            ),
          },
          position: [x1 - 24, y1 + 8],
        })
      }
    }
    for (
      let index = 0;
      index < yLinesDdown / yScaleplateCanvas / 2 - 1;
      index++
    ) {
      let x1 =
        option.dataXYCanvasScaleMinMax[0] * this.canvasWidth - lineyWeight / 2
      let y1 =
        option.dataXYCanvasScaleMinMax[1] * this.canvasHeight -
        (2 * index + 1) * yScaleplateCanvas
      let x2 =
        option.dataXYCanvasScaleMinMax[0] * this.canvasWidth - lineyWeight / 2
      let y2 =
        option.dataXYCanvasScaleMinMax[1] * this.canvasHeight -
        2 * (index + 1) * yScaleplateCanvas

      option.lines.push({
        shape: {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
        },
        style: {
          lineWidth: (lineyWeight - 1) / 2,
          stroke: '#FFFFFF',
          // stroke: '#FF0000a0'
        },
      })
    }
    // x分割轴
    option.lines.push({
      shape: {
        // x1: option.xyLinesCanvas[0] - lineyWeight,
        x1: -lineyWeight,
        y1: option.xyLinesCanvas[1],
        x2: option.xyLinesCanvas[2],
        y2: option.xyLinesCanvas[1],
      },
    })
  }

  addBound(option) {
    // 绘制区域  包围盒
    let boundingRectPositionArray = [
      [option.xyLinesCanvas[0], option.xyLinesCanvas[1]],
      [option.xyLinesCanvas[0], option.xyLinesCanvas[3]],
      [option.xyLinesCanvas[2], option.xyLinesCanvas[3]],
      [option.xyLinesCanvas[2], option.xyLinesCanvas[1]],
    ]
    let boundingRect
    if (option.backgroundPolygons) {
      option.backgroundPolygons = [
        {
          shape: {
            points: boundingRectPositionArray,
          },
          style: {
            stroke: '#00000040',
            fill: '#FFFFFFA0',
          },
        },
      ]
    }
    option.backgroundPolygons.forEach((shapeState) => {
      shapeState.shape.points.forEach((point) => {
        point[0] += option.center[0]
        point[1] = option.center[1] - point[1]
      })
      boundingRect = new zrender.Polygon(shapeState)
      this._zr.add(boundingRect)
    })
  }
}

class EngineCADPipCross extends EngineCAD {
  /**
   *
   * @param {*} dom
   * @param {*} opts
   */
  constructor(dom, opts) {
    super(dom, opts)
    // super()
  }

  /**
   *
   * @param {*} option 制定具体单数据比例尺等
   */
  addOption(option) {
    option.circles = []
    option.lines = []
    option.rects = []
    option.polylines = []
    option.texts = []

    //初始化包围盒
    option.dataXYRealMinMax = [...option.ground[0], ...option.ground[0]] //[xmin ymin xmax  ymax]
    // 预处理
    this.transPipe(option)
    this.transGround(option)
    debugger
    super.addOption(option)
  }

  // 横纵坐标监听绘制
  addListen() {}

  // 数据范围获取

  // 管线格式化
  transPipe(option) {
    option.pipes.forEach((data) => {
      // 更新数据包围盒

      option.dataXYRealMinMax[0] > data.position[0] &&
        (option.dataXYRealMinMax[0] = data.position[0])
      option.dataXYRealMinMax[1] > data.position[1] &&
        (option.dataXYRealMinMax[1] = data.position[1])
      option.dataXYRealMinMax[2] < data.position[0] &&
        (option.dataXYRealMinMax[2] = data.position[0])
      option.dataXYRealMinMax[3] < data.position[1] &&
        (option.dataXYRealMinMax[3] = data.position[1])

      switch (data.type) {
        case 'rect':
          option.rects.push({
            shape: {
              // 修改矩形中心位置
              x: data.position[0] - data.shape[0] / 2,
              y: data.position[1] + data.shape[1] / 2,
              width: data.shape[0],
              height: data.shape[1],
            },
            style: {
              stroke: '#000000',
              fill: 'white',
              lineWidth: 2,
            },
            actionBool: true,
            action: (shape, shapeState, _zr, group) => {
              shape
                .on('mousemove', () => {
                  shape.setStyle({
                    stroke: '#FF0000',
                  })
                })
                .on('mouseout', () => {
                  shape.setStyle({
                    stroke: '#000000',
                  })
                })
            },
          })
          break
        case 'circle':
          option.circles.push({
            shape: {
              cx: data.position[0],
              cy: data.position[1],
              r: data.shape,
            },
            style: {
              stroke: '#000000',
              fill: '#FFFFFF',
              lineWidth: 2,
            },
            actionBool: true,
            action: (shape, shapeState, _zr, group) => {
              console.log('r:' + data.position)
              let shapeMark = null
              shape
                .on('mousemove', () => {
                  shape.setStyle({
                    stroke: '#FF0000',
                  })
                })
                .on('mouseout', () => {
                  shape.setStyle({
                    stroke: '#000000',
                  })
                })
            },
          })
          break

        default:
          break
      }
    })
  }
  // 地表格式化
  transGround(option) {
    option.ground.forEach((data) => {
      // 更新数据包围盒
      option.dataXYRealMinMax[0] > data[0] &&
        (option.dataXYRealMinMax[0] = data[0])
      option.dataXYRealMinMax[1] > data[1] &&
        (option.dataXYRealMinMax[1] = data[1])
      option.dataXYRealMinMax[2] < data[0] &&
        (option.dataXYRealMinMax[2] = data[0])
      option.dataXYRealMinMax[3] < data[1] &&
        (option.dataXYRealMinMax[3] = data[1])

      // 数信息据和线
    })
    // 地表
    option.polylines.push({
      shape: {
        points: JSON.parse(JSON.stringify(option.ground)), //地表数据转换
      },
    })
  }

  transXYLine(option) {
    // option.
  }
}

// TODO  构建场景图
// 尺寸平移简单仿射变换n*2  0->1
function trans2DSimple01(x, y, Cx, Cy, Tx, Ty) {
  x = x * Cx + Tx
  y = y * Cy + Ty
  return [x, y]
}
// 尺寸平移简单仿射变换n*2 逆
function trans2DSimple01Back(x, y, Cx, Cy, Tx, Ty) {
  x = (x - Tx) / Cx
  y = (y - Ty) / Cy
  return [x, y]
}
/**
 * 1->2场景图转换
 * @param {Array} point
 * @param {Array} center
 * @returns
 */
function trans2DSimple12(point, center) {
  point[0] = point[0] + center[0]
  point[1] = center[1] - point[1]
  return point
}
/**
 * 0->1->2场景图转换
 * @param {*} x
 * @param {*} y
 * @param {*} Cx
 * @param {*} Tx
 * @param {*} Cy
 * @param {*} Ty
 * @param {Array} center 2场景中心转换
 * @returns
 */
function trans2DSimple02(point, Cx, Tx, Cy, Ty, center) {
  point[0] = point[0] * Cx + Tx + center[0]
  point[1] = center[1] - (point[1] * Cy + Ty)
  return point
}

function trans2DSimple02back(point, Cx, Tx, Cy, Ty, center) {
  point[0] = (point[0] - center[0] - Tx) / Cx
  point[1] = (center[1] - point[1] - Ty) / Cy
  return point
}

export { Engine, EngineCAD, EngineCADPipCross }
