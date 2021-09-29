  // 实时
  function handleSql(val) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000);
    })
  }
  async function forFn() {
    for(var index = 1;index<999;index++) {
       await handleSql(index);
       options_1.noiseStrength++
       console.log( options_1.noiseStrength)
    }
  }
  forFn()