import { createRouter, createWebHistory } from 'vue-router'
import { IndexInfo } from '../data/setting/IndexInfo.js'

import Index from '../views/Index.vue'
// import Index1 from '../views/App/GL/Cesium/CesiumStart.vue'
// import Index1 from '../views/App/GL/Cesium/CesiumTest.vue'
// import Index1 from '../views/App/GL/Babylon/BabylonTest.vue'
import Index1 from '../views/App/GL/Babylon/BabylonBatch.vue'
import { filterAsyncRoutes } from './filterAsyncRoutes.js'
const routerHistory = createWebHistory()

// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const children = []


// const router = createRouter({
//   history: routerHistory,
//   routes: [
//   {
//     path: '',
//     component: Index,
//     children:children
//     // children:
//     //  [
//     //   // -----------------------------------------------当前测试
//     //   {
//     //     path: '',
//     //     name: 'FullProject',
//     //     component: Index1,
//     //     // component: () =>
//     //     //   import(
//     //     //     '../views/App/Index/FullProject.vue'
//     //     //   ),
//     //   },
//     //   // -----------------------------------------------Cesium
//     //   {
//     //     path: '/App/GL/Cesium/CesiumStart',
//     //     // path: '/App/GL/Cesium/CesiumStart',
//     //     name: 'CesiumStart',
//     //     component: () => import('../views/App/GL/Cesium/CesiumStart.vue'),
//     //   },
//     //   {
//     //     path: '/App/GL/Cesium/CesiumTest',
//     //     name: 'CesiumTest',
//     //     component: () => import('../views/App/GL/Cesium/CesiumTest.vue'),
//     //   },
//     //   // -----------------------------------------------Babylon
//     //   {
//     //     path: '/App/GL/Babylon/BabylonStart',
//     //     // path: '/App/GL/Babylon/BabylonStart',
//     //     name: 'BabylonStart',
//     //     component: () => import('../views/App/GL/Babylon/BabylonStart.vue'),
//     //   },
//     //   {
//     //     path: '/App/GL/Babylon/BabylonTest',
//     //     name: 'BabylonTest',
//     //     component: () => import('../views/App/GL/Babylon/BabylonTest.vue'),
//     //   },
//     //   {
//     //     path: '/App/GL/Babylon/BabylonBatch',
//     //     name: 'BabylonBatch',
//     //     component: () => import('../views/App/GL/Babylon/BabylonBatch.vue'),
//     //   },
//     //   {
//     //     path: '/App/GL/Babylon/BabylonBatch_WithTrangle',
//     //     name: 'BabylonBatch_WithTrangle',
//     //     component: () => import('../views/App/GL/Babylon/BabylonBatch_WithTrangle.vue'),
//     //   },
//     // ],
//   },
//   {
//     path: '/EasyCAD',
//     name: 'EasyCAD',
//     component: () => import('../views/App/EasyCAD/Index.vue'),
//   },
//   {
//     path: '/Library',
//     name: 'Library',
//     component: () => import('../views/App/Library/Index.vue'),
//     children: [
//     {
//       path: '',
//       name: 'Library',
//       component: () => import('../views/App/Library/Library.vue'),
//     },
//     {
//       path: 'novel',
//       name: 'App_EasyCAD_Index',
//       component: () => import('../views/App/Library/novel.vue'),
//     }, ],
//   }, ],
// })

filterAsyncRoutes(IndexInfo.workList, children)
console.log('filterAsyncRoutes', children)
children.push(
{
  path: '',
  name: 'FullProject',
  component: Index1,
  // component: () =>
  //   import(
  //     '../views/App/Index/FullProject.vue'
  //   ),
}, )
const router = createRouter({
  history: routerHistory,
  routes: [
  {
    path: '',
    component: Index,
    children: children

  }]

})

export default router