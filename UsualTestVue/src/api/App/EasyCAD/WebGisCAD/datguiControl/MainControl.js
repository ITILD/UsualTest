import dat from 'dat.gui'
function MainControl(params) {
  console.log('主控')
  const box = document.querySelector('#datGui')
  const gui_0_root = new dat.GUI({ autoPlace: false })
  box.appendChild(gui_0_root.domElement)
  let options_0 = {
    CONTROL: 'MainControl',
  }
  gui_0_root.domElement.style = 'position: absolute; top: 2px; left: 2px;'
  gui_0_root.add(options_0, 'CONTROL')
}
export{MainControl}