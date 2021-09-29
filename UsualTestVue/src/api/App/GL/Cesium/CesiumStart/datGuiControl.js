function datGuiControl(guiRoot) {
  const gui_0_root = guiRoot 
  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'
    
      let options_0 = {
        CONTROL: 'CesiumTest'
      }
      gui_0_root.add(options_0, 'CONTROL')
      let options_1 = {
        noiseStrength: 10,
        growthSpeed: 0.2,
        maxSize: 6,
        message: 'pizza',
        speed: 0.1,
        speedChange: 0.8,
        displayOutline: false,
        button_function: () => {
          console.log('test---------------gui_0_root')
        }
      }
      var gui_0_f0 = gui_0_root.addFolder('场景参数')
      gui_0_f0.add(options_1, 'noiseStrength').step(5) // 增长的步长
      gui_0_f0.add(options_1, 'growthSpeed', -5, 5) // 最大、最小值
      gui_0_f0.add(options_1, 'maxSize').min(0).step(0.25) // 最大值和步长
      // 文本输入项
      gui_0_f0.add(options_1, 'message', ['pizza', 'chrome', 'hooray'])

      // 下拉框形式选择文案
      gui_0_f0.add(options_1, 'speed', { Stopped: 0, Slow: 0.1, Fast: 5 })
      let controller_speed = gui_0_f0.add(options_1, 'speedChange', -5, 5)
      controller_speed.onChange(function (value) {
        console.log('onChange:' + value)
      })

      controller_speed.onFinishChange(function (value) {
        console.log('onFinishChange' + value)
      })
      gui_0_f0.add(options_1, 'displayOutline')
      gui_0_f0.add(options_1, 'button_function')
}

export {datGuiControl}