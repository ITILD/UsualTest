<template>
  <div>
    <canvas id="CADMain_Start" class="Index2dwith3d"></canvas>
    <div id="datGui"></div>
  </div>
</template>

<script>

// -------LIB_UI
import { ref, reactive, onMounted } from 'vue'


import '../../../../assets/css/index/datgui.css'
import { test } from '../../../../api/App/Templates/GL/TemplateControls/todo/test.js'
import { MainControl } from '../../../../api/App/Templates/GL/TemplateControls/datguiControl/MainControl.js'

export default {
  name: 'test',
  props: {
  },
  setup(props) {
    const getViewer = async () => {
      // test()
      MainControl()
    }

    onMounted(getViewer)

    return {
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
</style>