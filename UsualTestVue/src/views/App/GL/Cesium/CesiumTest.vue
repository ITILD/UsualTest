
<template>
  <div>
    <div class="Index2dwith3d" id="cesiumContainer" :ref="cesiumRefFn"></div>
    <div id="datGui"></div>
  </div>
</template>
<script>
import '../../../../assets/css/index/datgui.css'
// 
import { ref, reactive, onMounted, onActivated } from 'vue'
import * as Cesium from 'cesium'
import dat from 'dat.gui'
import * as cesiumPlugin from '../../../../../public/lib/in/cesiumplugin.mjs'
// 
import {datGuiControl} from '../../../../api/App/GL/Cesium/CesiumTest/datGuiControl.js'

window.Cesium = Cesium
// cesiumPlugin.TMFunc1()
export default {
  name: 'Index3d_首页',
  //  components: { HelloWorld },
  props: {
    // ENV_TEST: { type: String }
  },
  setup(props) {
    let cesiumRef
    const cesiumRefFn = (el) => {
      cesiumRef = el
    }

    const getViewer = async () => {
      //三部分  散射后期处理   夜光一半   阴影光照
      console.log(cesiumRef)
      let initViewer = cesiumPlugin.InitViewer.getInstance()
      initViewer.addViewer(cesiumRef)      // initViewer.addViewer('cesiumContainer')
      // 初始viewer
      let viewer = initViewer.viewers.get(cesiumRef)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏logo
      let provider = Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.AERIAL
      })
      viewer.imageryLayers.addImageryProvider(provider)

      /**
       * datgui场景控制
       */
      let controlParams = {
        viewer:viewer
      }
      const box = document.querySelector('#datGui')
      const gui_0_root = new dat.GUI({ autoPlace: false })
      box.appendChild(gui_0_root.domElement)
      datGuiControl(gui_0_root,controlParams)
    }
    // dom完成
    onMounted(getViewer)

    return {
      cesiumRefFn
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
