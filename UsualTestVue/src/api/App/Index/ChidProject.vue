<template >
  <!-- accordion唯一展开 -->
  <a-collapse v-model:activeKey="activeKey" :accordion="false" class="ofy">
    <a-collapse-panel
      v-for="item in workList"
      :key="item.key"
      :header="item.title + '  ' + item.abstract"
      :disabled="item.disabled"
    >
      <p>{{ item.title }}</p>
      <p>{{ item.title }}</p>
      <p>{{ item.title }}</p>
      <p>{{ item.title }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import { defineComponent, ref, watch, reactive, toRefs, toRef } from 'vue'
import { IndexInfo } from '../../../data/setting/IndexInfo.js'
const workList = IndexInfo.workList

export default defineComponent({
  setup() {
    let activeKey = ref([]) 
    let arrayTemp = []
    for (let index = 0; index < workList.length; index++) {
      const element = workList[index]
      arrayTemp.push(element.key)
    }
    setTimeout(() => {
      // 内部set函数
      activeKey.value = arrayTemp
    }, 500)

    return {
      activeKey,
      workList
    }
  }
})
</script>