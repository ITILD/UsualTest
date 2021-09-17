
<template >
  <!-- App.vue -->

  <v-app>
    <!-- 上部导航 -->
    <v-app-bar color="white accent-4" height=50 >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"  height=40 width =40></v-app-bar-nav-icon>
      <v-toolbar-title >Test List</v-toolbar-title>
    </v-app-bar>

    <!-- 左侧抽屉导航 -->
    <v-navigation-drawer v-model="drawer" absolute bottom temporary>
      <!-- dense减小高度。 shaped点击后形状 -->
      <v-list  dense shaped>
        <!-- 标记 -->
        <v-subheader>test list</v-subheader>
        <v-list-item-group
        >
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

        </v-list-item-group>
      </v-list>


      <v-treeview
    v-model="tree"
    :open="initiallyOpen"
    :items="items"
    activatable
    item-key="name"
    open-on-click
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ files[item.file] }}
      </v-icon>
    </template>
  </v-treeview>
    </v-navigation-drawer>

    <!-- app内容 -->
    <v-main>
      <!-- 给应用提供合适的间距 -->
      <v-container fluid>
        <!-- 如果使用 vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- 页脚 -->
    <!-- <v-footer app></v-footer> -->
  </v-app>
</template>

<script>
// export default {
//   components: {
//     //TemplateComponents,
//   },
//   // 定义属性
//   data() {
//     return {
//       drawer: false,
//     group: null,
//     }
//   },
//   // 计算属性，会监听依赖属性值随之变化
//   computed: {
//     //...mapGetters(['userPermissions','buttonType'])
//   },
//   // 监控data中的数据变化
//   watch: {
//      group () {
//       this.drawer = false
//     },
//   },
// }

import { ref, watch } from 'vue'
import { Info } from "./Info.js";
export default {
  name: '',
  setup() {
    const drawer =  ref (false)
    console.log(Info)



    
     const initiallyOpen = ['public']
     const files = {
        html: 'mdi-language-html5',
        js: 'mdi-nodejs',
        json: 'mdi-code-json',
        md: 'mdi-language-markdown',
        pdf: 'mdi-file-pdf',
        png: 'mdi-file-image',
        txt: 'mdi-file-document-outline',
        xls: 'mdi-file-excel',
      }
    const  tree= []
    const  items= [
        {
          name: '.git',
        },
        {
          name: 'node_modules',
        },
        {
          name: 'public',
          children: [
            {
              name: 'static',
              children: [{
                name: 'logo.png',
                file: 'png',
              }],
            },
            {
              name: 'favicon.ico',
              file: 'png',
            },
            {
              name: 'index.html',
              file: 'html',
            },
          ],
        },
        {
          name: '.gitignore',
          file: 'txt',
        },
        {
          name: 'babel.config.js',
          file: 'js',
        },
        {
          name: 'package.json',
          file: 'json',
        },
        {
          name: 'README.md',
          file: 'md',
        },
        {
          name: 'vue.config.js',
          file: 'js',
        },
        {
          name: 'yarn.lock',
          file: 'txt',
        },
      ]
    

    return {drawer,initiallyOpen,files,tree,items}
  }
}
</script>

<style>
</style>

