
<template>
  <div>
    <div class="Index2dwith3d" id="cesiumContainer" :ref="cesiumRefFn"></div>
    <div class="CVS1 Index2dwith3d">test_canvas</div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, onActivated } from "vue";
import { author } from "./config";
import * as Cesium from "cesium";
// import 'cesium/Source/Widgets/widgets.css'
let viewer;
export default {
  name: "Index3d_首页",
  //  components: { HelloWorld },
  props: {
    // ENV_TEST: { type: String }
  },
  setup(props) {
    let cesiumRef;
    const cesiumRefFn = (el) => {
      cesiumRef = el;
    };

    const getViewer = async () => {

      //三部分  散射后期处理   夜光一半   阴影光照
      viewer = new Cesium.Viewer(cesiumRef, {
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        timeline: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        infoBox: false,
        orderIndependentTranslucency: false,
        homeButton: false,
        sceneModePicker: false,
        fullscreenButton: false,
        vrButton: false,
        skyBox: false,
        // selectionIndicator:false    // 是否可以选中
        contextOptions: {
          webgl: {
            alpha: true,
          },
        },
      });
      viewer._cesiumWidget._creditContainer.style.display = "none"; // 隐藏logo
      // viewer.scene.skyAtmosphere.show=false;    // 关闭大气层
      viewer.scene.globe.depthTestAgainstTerrain = true; // 地面以下不可见（高程遮挡）
      viewer.scene.backgroundColor = new Cesium.Color(0.0, 0.0, 0.0, 0.0);
      // 不能远近变化  下一步鉴定范围
      viewer.scene.screenSpaceCameraController.enableZoom  = false;
      viewer.scene.screenSpaceCameraController.enableTilt  = false;//航向
       
    };
    onMounted(getViewer);
    // onActivated(getViewer)

    return {
      // getViewer,
      cesiumRefFn,
    };
  },
};
</script>

<style>
/* @import url('/node_modules/cesium/Build/Cesium/Widgets/widgets.css'); */
/* @import url(); */
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
