// todo mock axios 中断
let IndexInfo = {}

IndexInfo.workList = [
  {
    title: 'App',
    key: '/App/GL/Cesium/CesiumStart',
    realPath:[true,''],
    completeness: 0.01, //百分比完成度 >0开始包含路由可以跳转   否则灰色
    abstract: '测试App',
    children: [
      {
        title: 'Template',
        key: '0-0',
        // completeness: 0.01,
        children: [
          {
            abstract: 'bbb',
            title: '0-0-0-0test',
            key: '0-0-0-0',
            children: [
              {
                abstract: 'bbb',
                title: '0-0-0-0test',
                key: '0-0-0-0',
              },
            ],
          },
          {
            title: '0-0-0-1test',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: 'GL',
        // completeness: 0.01,
        abstract: '图形相关',
        key: '0-1',
        children: [
          {
            abstract: 'Cesium',
            title: 'Cesium',
            completeness: 0.01,
            key: '/App/GL/Cesium/Index',
            children: [
              {
                abstract: 'ccc',
                completeness: 0.01,
                title: 'CesiumStart',
                key: '/App/GL/Cesium/CesiumStart',
              },
              {
                abstract: 'ccc',
                completeness: 0.01,
                title: 'CesiumTest',
                key: '/App/GL/Cesium/CesiumTest',
              },
            ],
          },
          {
            abstract: 'Babylon',
            title: 'Babylon',
            completeness: 0.01,
            key: '/App/GL/Babylon/Index',
            children: [
              {
                abstract: 'ccc',
                title: 'BabylonStart',
                completeness: 0.01,
                key: '/App/GL/Babylon/BabylonStart',
              },
              {
                abstract: 'ccc',
                title: 'BabylonTest',
                key: '/App/GL/Babylon/BabylonTest',
              }, {
                abstract: 'ccc',
                title: 'BabylonBatch',
                completeness: 0.01,
                key: '/App/GL/Babylon/BabylonBatch',
              },
               {
                abstract: 'ccc',
                title: 'BabylonBatch_WithTrangle',
                completeness: 0.01,
                key: '/App/GL/Babylon/BabylonBatch_WithTrangle',
              },
               {
                abstract: 'ccc',
                title: 'BabylonBatch_NoTrangle',
                completeness: 0.01,
                key: '/App/GL/Babylon/BabylonBatch_NoTrangle  ',
              },
               {
                abstract: 'ccc',
                title: 'WebGpuCAD',
                completeness: 0.01,
                key: '/App/GL/Babylon/WebGpuCAD',
              },
              //  {
              //   abstract: 'ccc',
              //   title: 'BabylonTest',
              //   key: '/App/GL/Babylon/BabylonTest',
              // },
            ],
          },
        ],
      }
    ],
  },
]

export { IndexInfo }
