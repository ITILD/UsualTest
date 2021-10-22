class BatchModel {
  showAxis = function (size) {
    let makeTextPlane = (text, color, size) => {
      let dynamicTexture = new BABYLON.DynamicTexture(
        'DynamicTexture',
        150,
        scene,
        true
      )
      dynamicTexture.hasAlpha = true
      dynamicTexture.drawText(
        text,
        5,
        40,
        'bold 36px Arial',
        color,
        'transparent',
        true
      )
      let plane = new BABYLON.Mesh.CreatePlane(
        'TextPlane',
        size,
        scene,
        true
      )
      plane.material = new BABYLON.StandardMaterial(
        'TextPlaneMaterial',
        scene
      )
      plane.material.backFaceCulling = false
      plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
      plane.material.diffuseTexture = dynamicTexture
      return plane
    }

    let axisX = BABYLON.Mesh.CreateLines(
      'axisX',
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
        new BABYLON.Vector3(size, 0, 0),
        new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
      ],
      scene
    )
    axisX.color = new BABYLON.Color3(1, 0, 0)
    let xChar = makeTextPlane('xRyGzB', 'red', size / 2)
    xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)
    let axisY = BABYLON.Mesh.CreateLines(
      'axisY',
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
        new BABYLON.Vector3(0, size, 0),
        new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
      ],
      scene
    )
    axisY.color = new BABYLON.Color3(0, 1, 0)
    // let yChar = makeTextPlane("Y", "green", size / 10);
    // yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size);
    let axisZ = BABYLON.Mesh.CreateLines(
      'axisZ',
      [
        new BABYLON.Vector3.Zero(),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
        new BABYLON.Vector3(0, 0, size),
        new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
      ],
      scene
    )
    axisZ.color = new BABYLON.Color3(0, 0, 1)
    // let zChar = makeTextPlane("Z", "blue", size / 10);
    // zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size);
    // return [axisX,axisY,axisZ,xChar,yChar,zChar]
  }
  static makePlogon3DUp(walldownOne) {
    let walldownOneIndex = earcut(walldownOne, null, 3) //walldownOne索引
    console.log(walldownOneIndex, walldownOne)
    for (let index = 0; index < walldownOneIndex.length; index += 3) {
      let index0 = walldownOneIndex[index] * 3
      let index1 = walldownOneIndex[index + 1] * 3
      let index2 = walldownOneIndex[index + 2] * 3
      let myPaths = [
        [new BABYLON.Vector3(
            walldownOne[index2],
            walldownOne[index2 + 2],
            walldownOne[index2 + 1]
          ), new BABYLON.Vector3(
            walldownOne[index1],

            walldownOne[index1 + 2],
            walldownOne[index1 + 1]
          ),
          new BABYLON.Vector3(
            walldownOne[index0],
            walldownOne[index0 + 2],
            walldownOne[index0 + 1]
          ),


          new BABYLON.Vector3(
            walldownOne[index0],
            walldownOne[index0 + 2],
            walldownOne[index0 + 1]
          ),

        ],
      ]

      //Create ribbon with updatable parameter set to true for later changes
      BABYLON.MeshBuilder.CreateRibbon(
        'ribbon',
        {
          pathArray: myPaths,
          // sideOrientation: BABYLON.Mesh.DOUBLESIDE,
          // updatable: true,
        },
        scene
      )
    }
  }
  static makePlogon3DDown(walldownOne) {
    let walldownOneIndex = earcut(walldownOne, null, 3) //walldownOne索引
    console.log(walldownOneIndex, walldownOne)
    for (let index = 0; index < walldownOneIndex.length; index += 3) {
      let index0 = walldownOneIndex[index] * 3
      let index1 = walldownOneIndex[index + 1] * 3
      let index2 = walldownOneIndex[index + 2] * 3
      let myPaths = [
        [
          new BABYLON.Vector3(
            walldownOne[index0],
            walldownOne[index0 + 2],
            walldownOne[index0 + 1]
          ), new BABYLON.Vector3(
            walldownOne[index1],

            walldownOne[index1 + 2],
            walldownOne[index1 + 1]
          ),

          new BABYLON.Vector3(
            walldownOne[index2],
            walldownOne[index2 + 2],
            walldownOne[index2 + 1]
          ),
          new BABYLON.Vector3(
            walldownOne[index2],
            walldownOne[index2 + 2],
            walldownOne[index2 + 1]
          ),

        ],
      ]

      //Create ribbon with updatable parameter set to true for later changes
      BABYLON.MeshBuilder.CreateRibbon(
        'ribbon',
        {
          pathArray: myPaths,
          // sideOrientation: BABYLON.Mesh.DOUBLESIDE,
          // updatable: true,
        },
        scene
      )
    }
  }
  // 获取底面
  static creatWallArrays(pathUp, low) {
    let pathDown = JSON.parse(JSON.stringify(pathUp));
    pathDown.forEach(path => {
      path[2] = low
    })
    return pathDown
  }

  // 创建墙面
  static createWall(pathUp, pathDown) {
    // ribbon
    let endVector3Up = ArrayHelp.arrayToVector3(pathUp)
    let endVector3Down = ArrayHelp.arrayToVector3(pathDown)
    // let ribbon = BABYLON.MeshBuilder.CreateRibbon('ribbon', { pathArray: [endVector3Down, endVector3Up], sideOrientation: BABYLON.Mesh.DOUBLESIDE, }, scene)
    let ribbon = BABYLON.MeshBuilder.CreateRibbon('ribbon', { pathArray: [endVector3Down, endVector3Up], }, scene)
    // ribbon.material = mat;
  }

  // 创建  直接拉面
  static createWallExtrudePolygon(pathUp, depth) {
    // ribbon
    // let endVector3Up = ArrayHelp.arrayToVector3(pathUp)
    let endVector3Up = ArrayHelp.arrayToVector3Back(pathUp)
    let depthUp = ArrayHelp.heightFull(pathUp)
    // console.log(depthUp)


    // let ribbon = BABYLON.MeshBuilder.CreateRibbon('ribbon', { pathArray: [endVector3Down, endVector3Up], sideOrientation: BABYLON.Mesh.DOUBLESIDE, }, scene)
    // let ribbon =  BABYLON.MeshBuilder.ExtrudePolygon("polygon", {shape:endVector3Up,  depth: depth, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene);
    let polygon = BABYLON.MeshBuilder.ExtrudePolygon("polygon", { shape: endVector3Up, depth: depthUp }, scene);
    polygon.position.y = depthUp
    return polygon
    // ribbon.material = mat;
  }



  // 减去大数   位移
  static moveXY(array, arryDXY) {
    let x = arryDXY[0]
    let y = arryDXY[1]
    for (let index = 0; index < array.length; index++) {
      const element = array[index];
      element[0] -= x
      element[1] -= y

    }
  }

  // 二维数组转一维度
  static flatten(arr) {
    return [].concat(...arr.map((x) => (Array.isArray(x) ? flatten(x) : x)))
  }

}

class ArrayHelp {
  static arrayToVector3(arrays) {
    let arraysResult = [];
    for (let index = 0; index < arrays.length; index++) {
      const array = arrays[index];
      arraysResult.push(new BABYLON.Vector3(array[0], array[2], array[1]));
    }

    return arraysResult
  }
  static arrayToVector3Back(arrays) {
    let arraysResult = [];
    for (let index = arrays.length - 1; index >= 0; index--) {
      const array = arrays[index];
      arraysResult.push(new BABYLON.Vector3(array[0], array[2], array[1]));
    }

    return arraysResult
  }
  // 平均高程
  static heightFull(arrays) {
    let arraysResult = 0;
    for (let index = 0; index < arrays.length; index++) {

      arraysResult += arrays[index][2]

    }
    arraysResult /= arrays.length
    return arraysResult
  }

}

export { BatchModel }