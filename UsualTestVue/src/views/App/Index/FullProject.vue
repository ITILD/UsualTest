<template>
  <!-- accordion唯一展开 -->
  <a-collapse v-model:activeKey="activeKey" :accordion="false">
    <a-collapse-panel
      v-for="item in workList"
      :key="item.key"
      :header="item.title + '  ' + item.abstract"
      :disabled="item.disabled"
    >
      <p>{{ item.title }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { Info } from '../../Info'
const workList = Info.workList

export default defineComponent({
  setup() {
    const text = `test.`  
    // const activeKey = ref(['1']);
    let activeKey = ref([])
    // watch(activeKey, val => {
    //   console.log(val);
    // });
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
      text,
      activeKey,
      workList
    }
  }
})
</script>