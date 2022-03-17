/**
 * MoveEntityCollection.js
 *
 * @author wangxu
 * @date 2021/11/12
 */
 import * as cesiumPlugin from '../../../../../../../public/lib/in/cesiumplugin.mjs'

class MoveEntityCollection {

    /**
     * 同样动画
     * @param {*} viewer
     * @param {*} entities
     * @param {*} startTime
     * @param {*} endTime
     * @param {*} timenew 加时 区分晃动
     * @param {*} amplitudeIncrease 晃动增幅
     */
    constructor(viewer, entities, startTime, endTime, timenew,timeAddFun, timeAddFun_displacement_s,timeAddFun_displacement_ms,amplitudeIncrease ) {
        this.viewer = viewer
        this.entities = entities
        this.startTime = startTime
        this.endTime = endTime
        this.timenew = timenew //不同
        this.timeAddFun = timeAddFun
        this.timeAddFun_displacement_s = timeAddFun_displacement_s
        this.timeAddFun_displacement_ms = timeAddFun_displacement_ms
        this.loop = null
        this.amplitudeIncrease = amplitudeIncrease
    }

    /**
     *
     * @param geomPositionsDown
     * @param height
     // * @param precision 插值精度 单层高
     */
    add(geomPositionsDown, oneFloorHeight, floors, bsm, damageInfo, displacementInfo, time_start, height) {
        geomPositionsDown.pop()
        // let Cartesian3ZERO = { x: 0, y: 0, Z: 0 }
        // // 局部ENU坐标系 转换系数'
        // cesiumPlugin.
        let localAndWorldTransform = new cesiumPlugin.LocalAndWorldTransform(
            geomPositionsDown[1]//简写 没用中心点 底面边角可能翘边
        )
        let groundPositionsLength = geomPositionsDown.length //底面点数 柱子数
        let pillarsPositoinsLength = floors + 1 //加1顶面 柱子点数
        let pillarsPositoinsArrays = [] //柱子集合
        let geomPositionsUp = [] //上表面
        let geomPositionsFullArrays = [geomPositionsDown, geomPositionsUp] //总面[底面,上表面，立面]

        for (let i = 0; i < groundPositionsLength; i++) {
            let pillarsPositoins = []
            pillarsPositoinsArrays.push(pillarsPositoins)
            let thisPointPositionLocal =
                localAndWorldTransform.WorldCoordinatesTolocal(geomPositionsDown[i])
            let h = 0
            let j = 0
            for (let index = 0; index < pillarsPositoinsLength; index++) { //单个柱子底面到顶

                thisPointPositionLocal.z = index * oneFloorHeight//节点高度
                let newPillarsPositoin = localAndWorldTransform.localToWorldCoordinates(
                    thisPointPositionLocal
                )
                pillarsPositoins.push(newPillarsPositoin)
            }
        }
        // 绑定并初始化
        for (let i = 0; i < groundPositionsLength; i++) {
            let indexNext = (i + 1) % groundPositionsLength
            let thisPillarsPositoins = pillarsPositoinsArrays[i]
            let nextPillarsPositoins = pillarsPositoinsArrays[indexNext]
            geomPositionsFullArrays.push([])

            // 垂直面和顶面
            for (let j = 0; j < pillarsPositoinsLength; j++) {
                geomPositionsFullArrays[i + 2][j] = thisPillarsPositoins[j]
                geomPositionsFullArrays[i + 2][pillarsPositoinsLength + j] =
                    nextPillarsPositoins[pillarsPositoinsLength - 1 - j]
            }
            geomPositionsFullArrays[1][i] =
                thisPillarsPositoins[pillarsPositoinsLength - 1]
        }

        let pillarsPositoinsArraysClone = JSON.parse(
            JSON.stringify(pillarsPositoinsArrays)
        )

        // 循环更新位置
        // let loop = setInterval(() => {
        //     if (
        //         this.viewer.clock.currentTime.secondsOfDay > this.endTime.secondsOfDay
        //
        //     ) {
        //         // clearInterval(loop)
        //         return
        //     }
        //
        //     // // 生成垂直边
        //     let dtime =
        //         this.viewer.clock.currentTime.secondsOfDay - this.startTime.secondsOfDay
        //     // console.log('dtime', dtime)
        //     if (dtime > 0.5) {
        //         dtime += this.timenew
        //         for (let i = 0; i < groundPositionsLength; i++) {
        //             for (let j = 0; j < pillarsPositoinsLength; j++) {
        //                 let pillarsPositoins = pillarsPositoinsArrays[i][j]
        //                 let pillarsPositoinsClone = pillarsPositoinsArraysClone[i][j]
        //
        //                 // ENU局部坐标下不同高度位移
        //                 let thisPillarsPositoins =
        //                     localAndWorldTransform.WorldCoordinatesTolocal(pillarsPositoins)
        //                 let thisPillarsPositoinsClone =
        //                     localAndWorldTransform.WorldCoordinatesTolocal(
        //                         pillarsPositoinsClone
        //                     )
        //
        //                 //polygon各节点 摆动变化
        //                 thisPillarsPositoins.x =
        //                     thisPillarsPositoinsClone.x +
        //                     this.moveSin(dtime, thisPillarsPositoins.z)
        //                 thisPillarsPositoins.y =
        //                     thisPillarsPositoinsClone.y +
        //                     this.moveSin(dtime + 1, thisPillarsPositoins.z)
        //                 //转回世界坐标
        //                 let newPillarsPositoin =
        //                     localAndWorldTransform.localToWorldCoordinates(
        //                         thisPillarsPositoins
        //                     )
        //                 pillarsPositoins.x = newPillarsPositoin.x
        //                 pillarsPositoins.y = newPillarsPositoin.y
        //                 pillarsPositoins.z = newPillarsPositoin.z
        //             }
        //         }
        //     }
        // }, this.timeAddFun_displacement)
        let dtime = 0
        if(displacementInfo){//数据存在
            this.loop = setInterval(() => {
                if (this.viewer.clock.currentTime.secondsOfDay > this.endTime.secondsOfDay||!this.viewer.clock.shouldAnimate) {
                    // clearInterval(loop)
                    return
                }

                // dtime = this.timeAddFun_displacement_s*100
                //精确到0.05 TODO 精确依据后续工程需要 0.05？？   16
                dtime = Math.round((this.viewer.clock.currentTime.secondsOfDay -this.startTime.secondsOfDay)/0.05)*0.05
                const displacementValue = displacementInfo[dtime]
                if(!displacementValue){
                    return
                }

                for (let i = 0; i < groundPositionsLength; i++) {
                    for (let j = 1; j < pillarsPositoinsLength; j++) {//楼层
                        if(!displacementValue[j-1]) continue;//楼层不存在!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

                        let move = displacementValue[j-1]//3层   123      012数据
                        let pillarsPositoins = pillarsPositoinsArrays[i][j]
                        let pillarsPositoinsClone = pillarsPositoinsArraysClone[i][j]

                        // ENU局部坐标下不同高度位移
                        let thisPillarsPositoins =
                            localAndWorldTransform.WorldCoordinatesTolocal(pillarsPositoins)
                        let thisPillarsPositoinsClone =
                            localAndWorldTransform.WorldCoordinatesTolocal(
                                pillarsPositoinsClone
                            )

                        //polygon各节点 摆动变化
                        thisPillarsPositoins.x =
                            thisPillarsPositoinsClone.x +move[0]*2000*this.amplitudeIncrease
                        thisPillarsPositoins.y =
                            thisPillarsPositoinsClone.y +move[1]*2000*this.amplitudeIncrease
                        thisPillarsPositoins.z=
                            thisPillarsPositoinsClone.z +move[2]*100*this.amplitudeIncrease

                        //转回世界坐标
                        let newPillarsPositoin =
                            localAndWorldTransform.localToWorldCoordinates(
                                thisPillarsPositoins
                            )
                        pillarsPositoins.x = newPillarsPositoin.x
                        pillarsPositoins.y = newPillarsPositoin.y
                        pillarsPositoins.z = newPillarsPositoin.z
                    }
                }

                // console.log(this.viewer.clock.currentTime.secondsOfDay -this.startTime.secondsOfDay ,bsm,dtime,'坐标;',pillarsPositoinsArrays)

            //监听间隔
            }, 500)
        }



        let startData = Cesium.JulianDate.fromIso8601(time_start)

        let colorProperty = new Cesium.SampledProperty(Cesium.Color)

        for (let damageTime in damageInfo) {
            const damageValue = damageInfo[damageTime]
            // let thisColor = getColorByNumber(damageValue)
            //色度带从0.5-0
            let thisColor = Cesium.Color.fromHsl(0.5 - 0.5 * damageValue, 0.7, 0.7, 1)
            //新时间
            let newData = new Cesium.JulianDate()
            this.timeAddFun(startData, parseFloat(damageTime), newData)//newData浅拷贝
            // console.log(Cesium.JulianDate.toDate(newData), damageValue, thisColor)
            colorProperty.addSample(
                newData,
                thisColor
            )

        }

        //
        // var property = new Cesium.SampledProperty(Cesium.Cartesian3);
        // let polygonData =  new Cesium.PropertyArray(value)


        //添加动态图形 待删除
        for (let index = 0; index < geomPositionsFullArrays.length; index++) {
            let mousePolygonGroundEntity = this.entities.add({
                polygon: {
                    perPositionHeight: true,
                    //固定值 形状颜色s
                    //动态 形状颜色
                    hierarchy: new Cesium.CallbackProperty(() => {
                        return new Cesium.PolygonHierarchy(geomPositionsFullArrays[index])
                    }, false),
                    // material: new Cesium.ColorMaterialProperty(
                    //     new Cesium.CallbackProperty(function() {
                    //         return Cesium.Color.fromRandom({
                    //             minimumRed : 0.75,
                    //             minimumGreen : 0.75,
                    //             minimumBlue : 0.75,
                    //             alpha : 1.0
                    //         });
                    //     }, false))
                    outline: true,
                    outlineColor: Cesium.Color.BLUE,
                    outlineWidth: 1,

                    material: new Cesium.ColorMaterialProperty(
                        colorProperty
                    )
                },
                // id:bsm
            })
        }
    }


    /**
     * 清空绑定的map和场景实体
     */
    removeAll() {
        // this.entitiesMap.clear()
        this.entities.removeAll()
        clearInterval(this.loop)
    }
    /**
     * 模拟偏移
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

export{MoveEntityCollection}