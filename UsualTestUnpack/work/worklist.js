/* eslint-disable no-undef */
import { initSimple } from "../work/viwerWork/initSimple.js";
import { TestDataAdd } from "../work/dataAdd/TestDataAdd.js";
import { TestInteraction } from "../work/interaction/TestInteraction.js";
import { ConstControl } from "../work/draw/ConstControl.js";
import { MouseListen, BaseDraw, HoleDraw} from "../../../src/cesiumplugin.js";

function workList() {

  // 初始化viewer
  initSimple()
  let viewer = window.viewer

  //是否开启抗锯齿
  viewer.scene.fxaa = true;
  viewer.scene.postProcessStages.fxaa.enabled = true;

  //添加测试
  {
    let testDataAdd = new TestDataAdd(viewer)
    let testInteraction = new TestInteraction(viewer)
    let mouseListen = new MouseListen(viewer)
    let baseDraw = new BaseDraw(viewer)
    let holeDraw = new HoleDraw(viewer)
    let testConfig = [

      // 控制
      { title: '控制', class: 'leftWorkListTitle' },

      // { name: '相机控制', func: () => { testInteraction.getCamera() }, class: 'leftWorkListButton' },
      { name: 'flyto', func: () => { testInteraction.flyto() }, class: 'leftWorkListButton' },
      { name: '场景参数', func: () => { testInteraction.getClick() }, class: 'leftWorkListButton' },
      { name: '清空', func: () => { testInteraction.destroy() }, class: 'leftWorkListButton' },
      { name: '深度检测', func: () => { testInteraction.destroy() }, class: 'leftWorkListButton' },
      { name: '抗锯齿', func: () => { testInteraction.destroy() }, class: 'leftWorkListButton' },

      // 添加数据

      { title: '添加数据', class: 'leftWorkListTitle' },
      { name: '3dtiles', func: () => { testDataAdd.addTest3dtiles() }, class: 'leftWorkListButton' },
      { name: '3dtilesOSM', func: () => { testDataAdd.addTest3dtilesOSM() }, class: 'leftWorkListButton' },
      { name: '地形', func: () => { testDataAdd.addTestTerrain() }, class: 'leftWorkListButton' },
      { name: 'glb', func: () => { testDataAdd.addTestGlb() }, class: 'leftWorkListButton' },
      { name: 'entity', func: () => { testDataAdd.addTestEntity() }, class: 'leftWorkListButton' },

      // 绘制
      { title: '鼠标', class: 'leftWorkListTitle' },
      { name: '测试监听', func: () => { mouseListen.drawListen() }, class: 'leftWorkListButton' },
      { name: '启动监听', func: () => { baseDraw.drawListen() }, class: 'leftWorkListButton' },
      { name: '点', func: () => { baseDraw.drawPointStart() }, class: 'leftWorkListButton' },
      { name: '线', func: () => { baseDraw.drawLineStart() }, class: 'leftWorkListButton' },
      { name: '面', func: () => { baseDraw.drawPolygonStart() }, class: 'leftWorkListButton' },
      { name: '贴地线', func: () => { baseDraw.drawGroundLineStart() }, class: 'leftWorkListButton' },
      { name: '贴地面', func: () => { baseDraw.drawGroundPolygonStart() }, class: 'leftWorkListButton' },
      { name: '清空监听', func: () => { baseDraw.removeAll() }, class: 'leftWorkListButton' },
      { name: '保留', func: () => { baseDraw.storeEntitiesStart() }, class: 'leftWorkListButton' },

      // 挖坑
      { title: '挖坑', class: 'leftWorkListTitle' },
      { name: '启动监听', func: () => { holeDraw.drawListen() }, class: 'leftWorkListButton' },
      { name: '地形开挖', func: () => { holeDraw.holeTerrainDrawStart() }, class: 'leftWorkListButton' },
      { name: '3dtiles开挖', func: () => { holeDraw.hole3DtilesDrawStart() }, class: 'leftWorkListButton' },
      { name: 'glb开挖', func: () => { console.log(this) }, class: 'leftWorkListButton' },
      { name: '清空监听', func: () => { holeDraw.removeAll() }, class: 'leftWorkListButton' },

      // 固定值
      { title: '固定值', class: 'leftWorkListTitle' },
      { name: '固定值挖坑', func: () => { ConstControl.drawHole(viewer) }, class: 'leftWorkListButton' },
      { name: 'cesium线程', func: () => { ConstControl.webwork(viewer) }, class: 'leftWorkListButton' },

      // 局部替换动
      { title: '局部替换动', class: 'leftWorkListTitle' },
      { name: '视角监测', func: () => { ConstControl.drawHole(viewer) }, class: 'leftWorkListButton' },
      { name: '视角锥体', func: () => { ConstControl.webwork(viewer) }, class: 'leftWorkListButton' },
      { name: '动态替换', func: () => { ConstControl.webwork(viewer) }, class: 'leftWorkListButton' },
    ]
    addTest(testConfig, '.leftWorkListBox')

  }

}

export { workList };

// 添加简单测试按钮
function addTest(testConfig, jqString) {
  let inHtml = ''
  for (let i = 0; i < testConfig.length; i++) {
    const element = testConfig[i];
    if (element.title) {
      inHtml += ('<div ' + 'class="' + element.class + '">' + element.title + '</div>')
    }
    if (element.name) {
      inHtml += ('<button id = "' + element.name + i + '" class="' + element.class + '">' + element.name + '</button>')
    }

  }
  $(jqString).append(inHtml)
  for (let i = 0; i < testConfig.length; i++) {
    const element = testConfig[i];
    if (element.name) {
      $('#' + element.name + i).click(element.func)
    }
  }
}

// 按键 键值表
// https://www.jb51.net/article/173741.htm