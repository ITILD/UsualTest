/**
 * 中文符号拦截无效？？？
 */
class ControlDefault {
  constructor() {}

  static allStart(){
    document.onkeydown = null
    document.oncontextmenu = null
  }
  static allClose(){
    document.onkeydown =()=> false // document.onkeydown = event => {event.preventDefault()}//等价
    document.oncontextmenu = ()=>  false
  }

  // 初始化默认 ctrlKey shiftKey altKey
  /**
   * 
   */
  static defaultKeyboardEvent() {
    // 重新设置
    document.onkeydown = null
    // 全部键盘事件 鼠标
    document.onkeydown = (event) => {
      // 清除本次默认动作
      let key = event.key
      console.log(key)
      switch (key) {
        case 'F12':
          if (ControlDefault.debuggerStart) return //生效
          break //禁用
        case 'c':
          return
        case 'a':
          break
        case 'b':
          break
        default:
          break
      }
      console.log('default')
      event.preventDefault()
      console.log(event)
    }
    ControlDefault.debuggerStart||ControlDefault.defaultMouseEvent()
  }

  /**
   * 首页事务管理
   * @param {*} visibleDraw 开关
   */
  static index(visibleDraw) {
    document.onkeydown = null
    // 全部键盘事件 鼠标

    let onkeydownFunc = (event) => {
      // 清除本次默认动作
      let key = event.key
      console.log(event)
      switch (key) {
        case 'p':
          console.log('testtttttttt-------')
          break
        // 调试
        case 'F12':
          if (ControlDefault.debuggerStart) return //生效
          break //禁用
        case 'F11'://全屏
          return
          break
        case 'Tab':
          visibleDraw.value = !visibleDraw.value
          if (visibleDraw.value) {
            ControlDefault.keyboardInputOnly(key, onkeydownFunc)
          }
          break
        default:
          break //其余全禁用
        // return; //其余全放通
      }
      console.log('default')
      event.preventDefault()
    }
    document.onkeydown = onkeydownFunc

    // 右键
    ControlDefault.debuggerStart||ControlDefault.defaultMouseEvent()
  }
  /**
   * 除tab的基础输入
   * @param {*} startKeyboardInput
   * @param {*} startOnkeydownFunc  // 再次startKeyboardInput恢复原绑定事件
   *
   */
  static keyboardInputOnly(startKeyboardInput, startOnkeydownFunc) {
    document.onkeydown = null
    document.onkeydown = (event) => {
      // 清除本次默认动作
      let key = event.key
      let keyCode = event.keyCode
      console.log('keyboardInputOnly', event)
      // 再次startKeyboardInput恢复原绑定事件
      if (key == startKeyboardInput) {
        if (startOnkeydownFunc) {
          document.onkeydown = startOnkeydownFunc
          startOnkeydownFunc(event) //穿透执行  本次按键有效
        }
        return
      }
      /**
       * 非startKeyboardInput全部键盘事件 鼠标
       * keyCode  48-57 0-9
       * keyCode  65-90 a-z
       * let allowKeyCodeArray = ['a','b','c','d','e','f','g',]
       */

      if (
        (48 <= keyCode && keyCode <= 57) ||
        (65 <= keyCode && keyCode <= 90) ||
        key == 'Backspace' ||
        key == 'Enter'
      )
        return
      switch (key) {
        case 'F12': // 调试
          if (ControlDefault.debuggerStart) return //生效
          break //禁用
        default:
          break //其余全禁用
      }
      event.preventDefault()
    }
  }

  static defaultMouseEvent() {
    document.oncontextmenu = (event) => {
      var clintX = event.clientX //ev获取的只是屏幕可视范围的x,y值
      var clintY = event.clientY
      console.log(clintX, clintY)
      return false //阻止鼠标右键菜单出现
    }
  }
}

// 开启调试
ControlDefault.debuggerStart = false //||true

export { ControlDefault }
