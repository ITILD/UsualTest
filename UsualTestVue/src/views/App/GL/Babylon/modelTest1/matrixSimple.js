class matrixSimple {
  constructor() {}

  static multiplyMatrixAndPoint(matrix, point) {
    // 给矩阵的每一部分一个简单的变量名, 列数（c）与行数（r）
    var c0r0 = matrix[0],
      c1r0 = matrix[1],
      c2r0 = matrix[2],
      c3r0 = matrix[3]
    var c0r1 = matrix[4],
      c1r1 = matrix[5],
      c2r1 = matrix[6],
      c3r1 = matrix[7]
    var c0r2 = matrix[8],
      c1r2 = matrix[9],
      c2r2 = matrix[10],
      c3r2 = matrix[11]
    var c0r3 = matrix[12],
      c1r3 = matrix[13],
      c2r3 = matrix[14],
      c3r3 = matrix[15]

    // 定义点坐标
    var x = point[0]
    var y = point[1]
    var z = point[2]
    var w = point[3]

    // 点坐标和第一列对应相乘, 再求和
    var resultX = x * c0r0 + y * c0r1 + z * c0r2 + w * c0r3

    // 点坐标和第二列对应相乘, 再求和
    var resultY = x * c1r0 + y * c1r1 + z * c1r2 + w * c1r3

    // 点坐标和第三列对应相乘, 再求和
    var resultZ = x * c2r0 + y * c2r1 + z * c2r2 + w * c2r3

    // 点坐标和第四列对应相乘, 再求和
    var resultW = x * c3r0 + y * c3r1 + z * c3r2 + w * c3r3

    return [resultX, resultY, resultZ, resultW]
  }


  static rotateAroundXAxis(a) {

    return [
         1,       0,        0,     0,
         0,  Math.cos(a),  -Math.sin(a),     0,
         0,  Math.sin(a),   Math.cos(a),     0,
         0,       0,        0,     1
    ];
  }
  
  static rotateAroundYAxis(a) {
  
    return [
       Math.cos(a),   0, Math.sin(a),   0,
            0,   1,      0,   0,
      -Math.sin(a),   0, Math.cos(a),   0,
            0,   0,      0,   1
    ];
  }
  
  static rotateAroundZAxis(a) {
  
    return [
      Math.cos(a), -Math.sin(a),    0,    0,
      Math.sin(a),  Math.cos(a),    0,    0,
           0,       0,    1,    0,
           0,       0,    0,    1
    ];
  }
}

export { matrixSimple }
