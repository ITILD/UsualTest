<template>
  <!-- // https://2x.antdv.com/components/tree-cn#components-tree-demo-switcher-icon -->

  <!-- 控制 -->
  <div class="qk_z2 qk_fullscreen click_none">
    <!-- <a-button ghost @click="showDrawer"><template #icon><RightSquareTwoTone twoToneColor="#52c41a" /></template>Open</a-button> -->
    <div class="icons-list"></div>
    <!-- webgpu谷歌浏览器bug 抽屉css遮挡问题 -->
    <a-drawer
      placement="left"
      :closable="false"
      v-model:visible="visibleDraw"
      :after-visible-change="afterVisibleChange"
    >
      <!-- 列表 -->
      <div>
        <a-input-search
          v-model:value="searchValue"
          style="margin-bottom: 8px"
          placeholder="Search"
        />
        <a-tree
          :expandedKeys="expandedKeys"
          :auto-expand-parent="autoExpandParent"
          :tree-data="gData"
          @expand="onExpand"
          @select="selectThis"
          show-line
          show-icon
        >
          <template #title="{ title }">
            <!-- <router-link to="/ChidProject"> -->
            <!-- 如果包含   则部分变红 -->
            <span v-if="title.indexOf(searchValue) > -1">
              <span style="color: #000">{{
                title.substr(0, title.indexOf(searchValue))
              }}</span>
              <span style="color: #40a9ff; font-weight: bold">{{
                searchValue
              }}</span>
              <span style="color: #000">{{
                title.substr(title.indexOf(searchValue) + searchValue.length)
              }}</span>
            </span>
            <span v-else>{{ title }}</span>
            <!-- </router-link> -->
          </template>
        </a-tree>
      </div>
    </a-drawer>
  </div>
  <div class="qk_z0 qk_fullscreen blueTest">
    <router-view />
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { RightSquareTwoTone } from '@ant-design/icons-vue'
import { useRouter } from 'vue-router'

import { IndexInfo } from '../data/setting/IndexInfo.js'
import { ControlDefault } from '../api/AppUsual/Control/ControlDefault.js'
const dataList = []

//genData  转 list dataList
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    const title = node.title
    dataList.push({
      key,
      title: title
    })

    if (node.children) {
      generateList(node.children)
    }
  }
}
const genData = IndexInfo.workList
generateList(genData)

const getParentKey = (key, tree) => {
  let parentKey

  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]

    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }

  return parentKey
}

//--debugger
console.log(dataList, genData)

export default defineComponent({
  components: { RightSquareTwoTone },
  setup() {
    // ******************抽屉
    const visibleDraw = ref(false)
    // 显隐后work
    const afterVisibleChange = (bool) => {
      console.log('visibleDraw', bool)
    }

    // 手机控制和电脑控制 缩小后显示  esc
    const showDrawer = () => {
      console.log('click')
      visibleDraw.value = true
    }

    // **************列表
    const expandedKeys = ref([])
    const searchValue = ref('')
    // 父节点
    const autoExpandParent = ref(false)
    const gData = ref(genData)

    let thisExpandedKeysValue // 搜索前状态
    // 每次点击开合栏
    const onExpand = (keys) => {
      expandedKeys.value = keys
      thisExpandedKeysValue = keys // 搜索前状态
    }

    watch(searchValue, (value) => {
      const expanded = dataList
        .map((item) => {
          //筛选value符合title
          if (item.title.indexOf(value) > -1) {
            return getParentKey(item.key, gData.value)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i) //防止undifined？？？

      //  搜索不存在或空  恢复搜索前状态
      if (expanded.length == 0 || !value || value == '') {
        expandedKeys.value = thisExpandedKeysValue
      } else {
        // 展开搜索到的
        expandedKeys.value = expanded
        searchValue.value = value
      }

      // autoExpandParent.value = true
    })
    // function(selectedKeys, e:{selected: bool, selectedNodes, node, event})
    const router = useRouter()
    const selectThis = (selectedKeys, e) => {
      // console.log(
      //   'selectThis',
      //   selectedKeys,
      //   e,
      //   e.selectedNodes[0].props,
      //   e.selectedNodes[0].props.dataRef.title
      // )

      router.push({
        // path:e.selectedNodes[0].props.dataRef.title
        path:e.selectedNodes[0].props.dataRef.key
        // path: '/App/GL/Cesium/CesiumStart'
      })
      // useRouter().push('/ChidProject')
    }

    // 控制
    ControlDefault.debuggerStart = true
    ControlDefault.index(visibleDraw)

    return {
      visibleDraw,
      afterVisibleChange,
      showDrawer,
      // 列表
      expandedKeys,
      searchValue,
      autoExpandParent,
      gData,
      onExpand,
      selectThis
    }
  }
})
</script>
<style>
.redTest {
  /* width: 100%;
  height: 100%; */
  background-color: rgba(194, 4, 77, 0.603);
}
.blueTest {
  /* width: 100%;
  height: 100%; */
  background-color: rgba(4, 33, 194, 0.603);
}
</style>