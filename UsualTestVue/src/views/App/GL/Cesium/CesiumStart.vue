
<template>
  <div>
    <div class="Index2dwith3d" id="cesiumContainer" :ref="cesiumRefFn"></div>
    <div id="datGui"></div>
  </div>
</template>
<script>
import { ref, reactive, onMounted, onActivated } from 'vue'
import * as Cesium from 'cesium'
import dat from 'dat.gui'
import '../../../../assets/css/index/datgui.css'
// import 'cesium/Source/Widgets/widgets.css'
let viewer
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
      viewer = new Cesium.Viewer(cesiumRef)
      viewer._cesiumWidget._creditContainer.style.display = 'none' // 隐藏logo

      /**控制 */
      // config
      let options_0 = {
        message: 'dat.gui_0_root'
      }

      // js
      const box = document.querySelector('#datGui')
      const gui_0_root = new dat.GUI({ autoPlace: false })

      box.appendChild(gui_0_root.domElement)
      gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'
      gui_0_root.add(options_0, 'message')

      let options_1 = {
        noiseStrength: 10,
        growthSpeed: 0.2,
        maxSize: 6,
        message: 'pizza',
        speed: 0.1,
        speedChange: 0.8,
        displayOutline: false,
        button_function: () => {
          console.log('test---------------gui_0_root')
        }
      }
      var gui_0_f0 = gui_0_root.addFolder('Flow Field')
      gui_0_f0.add(options_1, 'noiseStrength').step(5) // 增长的步长
      gui_0_f0.add(options_1, 'growthSpeed', -5, 5) // 最大、最小值
      gui_0_f0.add(options_1, 'maxSize').min(0).step(0.25) // 最大值和步长
      // 文本输入项
      gui_0_f0.add(options_1, 'message', ['pizza', 'chrome', 'hooray'])

      // 下拉框形式选择文案
      gui_0_f0.add(options_1, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 })
      let controller_speed = gui_0_f0.add(options_1, 'speedChange', -5, 5)
      controller_speed.onChange(function (value) {
        console.log('onChange:' + value)
      })

      controller_speed.onFinishChange(function (value) {
        console.log('onFinishChange' + value)
      })
      gui_0_f0.add(options_1, 'displayOutline')
      gui_0_f0.add(options_1, 'button_function')
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
