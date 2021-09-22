import {
  createRouter,
  createWebHistory
} from 'vue-router'

// import HelloWorld from '../components/HelloWorld.vue'
import Index from '../views/Index.vue'
const routerHistory = createWebHistory()

// createWebHashHistory hash 路由
// createWebHistory history 路由
// createMemoryHistory 带缓存 history 路由

const router = createRouter({
  history: routerHistory,
  routes: [{
      path: '',
      component: Index,      
      children: [{
        path: '',
        name: 'FullList',
        component: () =>
          import(
            '../views/App/Index/FullProject.vue'
          ),
      }
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