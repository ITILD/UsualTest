import {
  createRouter,
  createWebHistory
} from 'vue-router'
import { IndexInfo } from '../data/setting/IndexInfo.js'

// import HelloWorld from '../components/HelloWorld.vue'
import Index from '../views/Index.vue'
// import Index1 from '../views/App/GL/Cesium/CesiumStart.vue'
import Index1 from '../views/App/GL/Cesium/CesiumTest.vue'
const routerHistory = createWebHistory()

// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由
const routes = []


// let a = [Info.]

const router = createRouter({
  history: routerHistory,
  routes: [{
      path: '',
      component: Index,      
      children: [{
        path: '',
        name: 'FullProject',
        component: Index1,
        // component: () =>
        //   import(
        //     '../views/App/Index/FullProject.vue'
        //   ),
      },
      {
        path: 'App/GL/Cesium/CesiumStart',
        // path: '/App/GL/Cesium/CesiumStart',
        name: 'CesiumStart',
        component: () =>
          import(
            '../views/App/GL/Cesium/CesiumStart.vue'
          ),
      },
      {
        path: 'ChidProject',
        name: 'ChidProject',
        component: () =>
          import(
            '../views/App/Index/ChidProject.vue'
          ),
      },
    ],
    },
    {
      path: '/EasyCAD',
      name: 'EasyCAD',
      component: () => import('../views/App/EasyCAD/Index.vue'),
    },
    {
      path: '/Library',
      name: 'Library',
      component: () =>
        import(
          '../views/App/Library/Index.vue'
        ),
      children: [{
          path: '',
          name: 'Library',
          component: () =>
            import(
              '../views/App/Library/Library.vue'
            ),
        },
        {
          path: 'novel',
          name: 'App_EasyCAD_Index',
          component: () =>
            import(
              '../views/App/Library/novel.vue'
            ),
        },
      ],
    },
  ],
})

export default router