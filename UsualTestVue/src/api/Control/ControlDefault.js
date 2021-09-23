class ControlDefault {
  constructor() {

  }

  // 初始化默认
  static default () {
    // 重新设置
    document.onkeydown = null
    // 全部键盘事件 鼠标
    document.onkeydown = event => {
      // 清除本次默认动作
      let key = event.key
      console.log(key)
      switch (key) {
      case "F12":
        return
      case "c":
        return
      case "a":
        break;
      case "b":
        break;
      default:
        break;
      }
      console.log('default')
      event.preventDefault();
      console.log(event)
    }

    document.oncontextmenu = event => {
      var clintX = event.clientX; //ev获取的只是屏幕可视范围的x,y值
      var clintY = event.clientY;
      console.log(clintX, clintY)
      return false; //阻止鼠标右键菜单出现
    }
  }

  // 首页
  static index(visibleDraw) {
    document.onkeydown = null
    // 全部键盘事件 鼠标
    document.onkeydown = event => {
      // 清除本次默认动作
      let key = event.key
      console.log(key)
      switch (key) {
        // 调试
      case "F12":
        return
      case "Escape":
        break;
      case "Tab":
        visibleDraw.value = !visibleDraw.value
        break;
      default:
        break;
      }
      console.log('default')
      event.preventDefault();
      console.log(event)
    }
    // 右键
    document.oncontextmenu = event => {
      var clintX = event.clientX; //ev获取的只是屏幕可视范围的x,y值
      var clintY = event.clientY;
      console.log(clintX, clintY)
      // return false; //阻止鼠标右键菜单出现
    }
  }
}



export { ControlDefault }