// todo mock axios 中断
let IndexInfo = {}

IndexInfo.workList = [
  {
    
    title: 'Root',
    key: '0',
    completeness:0.01,//百分比完成度 >0开始包含路由可以跳转   否则灰色
    abstract:'根节点-总述',
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
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            abstract:'ccc',
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
        title: '0-21-1',
        key: '0-21'
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