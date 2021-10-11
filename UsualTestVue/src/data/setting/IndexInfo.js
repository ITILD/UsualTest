// todo mock axios 中断
let IndexInfo = {}

IndexInfo.workList = [
  {
    
    title: 'App',
    key: '0',
    completeness:0.01,//百分比完成度 >0开始包含路由可以跳转   否则灰色
    abstract:'测试App',
    children: [
      {
        title: 'Template',
        key: '0-0',
        completeness:0.01,
        children: [
          {
            abstract:'bbb',
            title: '0-0-0-0test',
            key: '0-0-0-0',
            children: [
              {
                abstract:'bbb',
                title: '0-0-0-0test',
                key: '0-0-0-0'
              }]
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
        title: 'GL',
        completeness:0.01,
        abstract:'图形相关',
        key: '0-1',
        children: [
          {
            abstract:'Cesium',
            title: 'Cesium',
            key: 'App/GL/Cesium/Index',
            children: [
              {
                abstract:'ccc',
                title: 'CesiumStart',
                key: 'App/GL/Cesium/CesiumStart',
              },
              {
                abstract:'ccc',
                title: 'CesiumTest',
                key: 'App/GL/Cesium/CesiumTest',
                
              }]
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
      },

      {
        title: '0-22',
        key: '0-22'
      },
      {
        title: '0-23',
        key: '0-23'
      },
      {
        title: '0-24',
        key: '0-24'
      },
      {
        title: '0-25',
        key: '0-25'
      },
      {
        title: '0-26',
        key: '0-26'
      },
      {
        title: '0-27',
        key: '0-27'
      } 
    ]
  },

]

export {IndexInfo}