import { ClippingPlanesByGeom, CameraPro, RenderGlb, LocalAndWorldTransform, RenderSimple } from '../../lib/geo/cesiumplugin.mjs'
/**
 * 高度分层
 */
class MoveEntityCollectionRow {

  /**
   * 同样动画
   * @param {*} viewer
   * @param {*} entities
   * @param {*} startTime
   * @param {*} endTime
   */
  constructor(viewer, entities, startTime, endTime, timenew) {
    this.viewer = viewer
    this.entities = entities
    this.startTime = startTime
    this.endTime = endTime
    this.timenew = timenew //不同
  }

  /**
   * 
   * @param {*} geomPositionsDown 
   * @param {*} oneFloorHeight  单层高度
   * @param {*} floors 楼层数
   * @param {*} precision 单层分割数（精度）  默认单层不分层1   （？多层三点贝塞尔？）
   */
  add(geomPositionsDown, oneFloorHeight, floors,precision) {
    // 默认单层1
    precision||(precision=1)
    let realOneFloorHeight = oneFloorHeight/precision//纵向节点间高度
    // let Cartesian3ZERO = { x: 0, y: 0, Z: 0 }
    // // 局部ENU坐标系 转换系数
    let localAndWorldTransform = new LocalAndWorldTransform(
      geomPositionsDown[1]//简写 没用中心点 底面边角可能翘边
    ) 
    let groundPositionsLength = geomPositionsDown.length //上底面点数 柱子数
    // let pillarsPositoinsLength = Math.floor(height / precision) + 1 //柱子点数
    let pillarsPositoinsLength = floors*precision+ 1 //加1顶面 柱子点数
    let pillarsPositoinsArrays = [] //柱子集合
    // let geomPositoinsSideArrays = [] //侧面集合
    let geomPositionsUp = [] //上表面
    let geomPositionsFullArrays = [geomPositionsDown, geomPositionsUp] //总面[底面,上表面，立面]

    //以enu局部坐标系参数 初始化垂直边
    for (let i = 0; i < groundPositionsLength; i++) {
      let pillarsPositoins = []
      pillarsPositoinsArrays.push(pillarsPositoins)
      let thisPointPositionLocal =
        localAndWorldTransform.WorldCoordinatesTolocal(geomPositionsDown[i])
      let h = 0
      let j = 0
      for (let index = 0; index < pillarsPositoinsLength; index++) {//单个柱子底面到顶

        thisPointPositionLocal.z = index*realOneFloorHeight//节点高度
        let newPillarsPositoin = localAndWorldTransform.localToWorldCoordinates(
          thisPointPositionLocal
        )
        pillarsPositoins.push(newPillarsPositoin)
      }
    }

    for (let index = 0; index < (pillarsPositoinsLength-1)*groundPositionsLength; index++) {
      geomPositionsFullArrays.push([])
    }
    // console.log('pillarsPositoinsArrays', pillarsPositoinsArrays)

    // 柱子绑定到具体面(点位内存关联)    绑定并初始化
    for (let i = 0; i < groundPositionsLength; i++) {
      let indexNext = (i + 1) % groundPositionsLength
      let thisPillarsPositoins = pillarsPositoinsArrays[i]
      let nextPillarsPositoins = pillarsPositoinsArrays[indexNext]
      // geomPositionsFullArrays.push([])
      // 包围立面
  
      for (let j = 0; j < pillarsPositoinsLength-1; j++) {
        // 单立柱拼接
        let thisI = i+j + 2
        geomPositionsFullArrays[thisI][0] = thisPillarsPositoins[j]//下
        geomPositionsFullArrays[thisI][1] =thisPillarsPositoins[j+1]// 上
        geomPositionsFullArrays[thisI][2] = nextPillarsPositoins[j+1]//下
        geomPositionsFullArrays[thisI][3] =nextPillarsPositoins[j]// 上
      }

      // 顶面
      geomPositionsFullArrays[1][i] =
        thisPillarsPositoins[pillarsPositoinsLength - 1]
    }

    // let geomPositoinsArrays = [geomPositionsDown, []] //总面[底面,上表面，立面]

    let pillarsPositoinsArraysClone = JSON.parse(
      JSON.stringify(pillarsPositoinsArrays)
    )

    console.log(geomPositionsFullArrays)
    debugger
    // 循环更新位置
    let loop = setInterval(() => {
      if (
        this.viewer.clock.currentTime.secondsOfDay > this.endTime.secondsOfDay
      ) {
        clearInterval(loop)
      }

      // // 生成垂直边
      let dtime =
        this.viewer.clock.currentTime.secondsOfDay - this.startTime.secondsOfDay
      console.log('dtime', dtime)
      if (dtime > 0.5) {
        dtime += this.timenew
        for (let i = 0; i < groundPositionsLength; i++) {
          for (let j = 0; j < pillarsPositoinsLength; j++) {
            let pillarsPositoins = pillarsPositoinsArrays[i][j]
            let pillarsPositoinsClone = pillarsPositoinsArraysClone[i][j]

            // ENU局部坐标下不同高度位移
            let thisPillarsPositoins =
              localAndWorldTransform.WorldCoordinatesTolocal(pillarsPositoins)
            let thisPillarsPositoinsClone =
              localAndWorldTransform.WorldCoordinatesTolocal(
                pillarsPositoinsClone
              )

            // thisPillarsPositoins.x += 1
            // thisPillarsPositoins.x = thisPillarsPositoinsClone.x
            thisPillarsPositoins.x =
              thisPillarsPositoinsClone.x +
              this.moveSin(dtime, thisPillarsPositoins.z)
            thisPillarsPositoins.y =
              thisPillarsPositoinsClone.y +
              this.moveSin(dtime + 1, thisPillarsPositoins.z)
            let newPillarsPositoin =
              localAndWorldTransform.localToWorldCoordinates(
                thisPillarsPositoins
              )
            pillarsPositoins.x = newPillarsPositoin.x
            pillarsPositoins.y = newPillarsPositoin.y
            pillarsPositoins.z = newPillarsPositoin.z
          }
        }
      }
    }, 100)

    // // this._mouseMovePointPrimitives.position = geomPositoinsArrays[1][2]
    for (let index = 0; index < geomPositionsFullArrays.length; index++) {
    // for (let index = 0; index < 3; index++) {
      
      let mousePolygonGroundEntity = this.entities.add({

        // name: 'polygon',
        polygon: {
          // hierarchy: new Cesium.PolygonHierarchy(geomPositionsFullArrays[index].slice(2,7)),
          // hierarchy: new Cesium.PolygonHierarchy(geomPositionsFullArrays[index]),
          hierarchy: new Cesium.CallbackProperty(() => {
            return new Cesium.PolygonHierarchy(geomPositionsFullArrays[index])
          }, false),
          perPositionHeight: true,
          material: Cesium.Color.fromAlpha(Cesium.Color.WHITE, 0.8),
        },
      })
    }
  }

  /**
   * 单方向偏移规则   高度修改
   * @param {*} dtime 相对时间
   * @param {*} h 相对底面高度
   * @returns
   */
  moveSin(dtime, h) {

    // console.log('dtime', h)

    // y=Asin(ωx+φ)+k
    //画正弦曲线
    //dot 原点
    let amplitude = 2 //振幅 -- A 最大振幅m
    let initialPhase = 0 //初相 -- φ 位置
    let setover = 0 // 偏距 -- k
    let palstance = 2 //角速度 -- ω  波宽
    //len 周期数
    let x = dtime + h / 100
    let y =
      (h / 60) * amplitude * Math.sin(palstance * x + initialPhase) + setover

    // console.log('y', y)
    return y //单方向偏移量
  }
}

export{MoveEntityCollectionRow}