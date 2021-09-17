function appconfig(params) {

  console.log('*********appconfig配置***************')
  console.log('port',
    import.meta.env.VITE_PORT)
  console.log('test',
    import.meta.env.VITE_TEST)
  console.log('************************************')


  // window['CESIUM_BASE_URL'] = 'http://localhost:' +
  //   import.meta.env.VITE_TEST + '/node_modules/cesium/Source/'
}
export { appconfig }