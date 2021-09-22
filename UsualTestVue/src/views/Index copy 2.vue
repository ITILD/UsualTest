<template>
  <!-- // https://2x.antdv.com/components/tree-cn#components-tree-demo-switcher-icon -->

  <div class="index_box qk_fullscreen">
    <a-button  ghost @click="showDrawer">Open</a-button>
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
          show-line
          show-icon
        >
          <template #title="{ title }">
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
          </template>
        </a-tree>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue';

</script>
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
const genData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: 'test',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0test',
            key: '0-0-0-0'
          },
          {
            title: '0-0-0-1test',
            key: '0-0-0-1'
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2'
          }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0'
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1'
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2'
          }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0',
        key: '0-1-0',
        children: [
          {
            title: '0-1-0-0',
            key: '0-1-0-0'
          },
          {
            title: '0-1-0-1',
            key: '0-1-0-1'
          },
          {
            title: '0-1-0-2',
            key: '0-1-0-2'
          }
        ]
      },
      {
        title: '0-1-1',
        key: '0-1-1',
        children: [
          {
            title: '0-1-1-0',
            key: '0-1-1-0'
          },
          {
            title: '0-1-1-1',
            key: '0-1-1-1'
          },
          {
            title: '0-1-1-2',
            key: '0-1-1-2'
          }
        ]
      },
      {
        title: '0-1-2',
        key: '0-1-2'
      }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]
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
      SearchOutlined//按钮
    }
  }
})
</script>
<style>
.index_box {
  width: 100%;
  height: 100%;
  background-color: aliceblue;
}
</style>