// function TetrahedronGeometry{
//   constructor(){
    
//   }


//   add(){
//     let negativeRootTwoOverThree = -Math.sqrt(2.0) / 3.0;
//     let negativeOneThird = -1.0 / 3.0;
//     let rootSixOverThree = Math.sqrt(6.0) / 3.0;
    
//     //四面体的四个顶点
//     let positions = new Float64Array(4 * 3);
  
//     // position 0
//     positions[0] = 0.0;
//     positions[1] = 0.0;
//     positions[2] = 1.0;
  
//     // position 1
//     positions[3] = 0.0;
//     positions[4] = (2.0 * Math.sqrt(2.0)) / 3.0;
//     positions[5] = negativeOneThird;
  
//     // position 2
//     positions[6] = -rootSixOverThree;
//     positions[7] = negativeRootTwoOverThree;
//     positions[8] = negativeOneThird;
  
//     // position 3
//     positions[9] = rootSixOverThree;
//     positions[10] = negativeRootTwoOverThree;
//     positions[11] = negativeOneThird;
  
//     let attributes = new Cesium.GeometryAttributes({
//         position : new Cesium.GeometryAttribute({
//             componentDatatype : Cesium.ComponentDatatype.DOUBLE,
//             componentsPerAttribute : 3,
//             values : positions
//         })
//     });
  
//     //顶点索引
//     let indices = new Uint16Array(4 * 3);
  
//     // back triangle
//     indices[0] = 0;
//     indices[1] = 1;
//     indices[2] = 2;
  
//     // left triangle
//     indices[3] = 0;
//     indices[4] = 2;
//     indices[5] = 3;
  
//     // right triangle
//     indices[6] = 0;
//     indices[7] = 3;
//     indices[8] = 1;
  
//     // bottom triangle
//     indices[9] = 2;
//     indices[10] = 1;
//     indices[11] = 3;
    
//     //包围球
//     let boundingSphere = new Cesium.BoundingSphere(new Cesium.Cartesian3(0.0,0.0,0.0),1.0);
  
//     let geometry = Cesium.GeometryPipeline.computeNormal(new Cesium.Geometry({
//         attributes: attributes,
//         indices: indices,
//         primitiveType: Cesium.PrimitiveType.TRIANGLES,
//         boundingSphere: boundingSphere
//     }));
  
  
//     this.indices = geometry.indices;
//     this.attributes = geometry.attributes;
//     this.primitiveType = geometry.primitiveType;
//     this.boundingSphere = geometry.boundingSphere;

//     return geometry
//   }
// }


function TetrahedronGeometry() {
  const negativeRootTwoOverThree = -Math.sqrt(2.0) / 3.0;
  const negativeOneThird = -1.0 / 3.0;
  const rootSixOverThree = Math.sqrt(6.0) / 3.0;
  const positions = new Float64Array(4 * 3);

  // 四面体有4个三角形，共计12个点，但是由于重合的关系，可以只记录4个点
  // 点0 坐标
  positions[0] = 0.0;
  positions[1] = 0.0;
  positions[2] = 1.0;

  // 点1 坐标
  positions[3] = 0.0;
  positions[4] = (2.0 * Math.sqrt(2.0)) / 3.0;
  positions[5] = negativeOneThird;

  // 点2 坐标
  positions[6] = -rootSixOverThree;
  positions[7] = negativeRootTwoOverThree;
  positions[8] = negativeOneThird;

  // 点3 坐标
  positions[9] = rootSixOverThree;
  positions[10] = negativeRootTwoOverThree;
  positions[11] = negativeOneThird;

  // 创建顶点属性中的坐标
  const attributes = new Cesium.GeometryAttributes({
    position : new Cesium.GeometryAttribute({
      componentDatatype : Cesium.ComponentDatatype.DOUBLE,
      componentsPerAttribute : 3,
      values : positions
    })
  });

  const indices = new Uint16Array(4 * 3);

  // 后面的三角形用到 0、1、2 号点坐标
  indices[0] = 0;
  indices[1] = 1;
  indices[2] = 2;

  // 左边的三角形用到 0、2、3 号点坐标
  indices[3] = 0;
  indices[4] = 2;
  indices[5] = 3;

  // 右边的三角形用到 0、3、1 号点坐标
  indices[6] = 0;
  indices[7] = 3;
  indices[8] = 1;

  // 下面的三角形用到 2、1、3 号点坐标
  indices[9] = 2;
  indices[10] = 1;
  indices[11] = 3;
    let geometry = Cesium.GeometryPipeline.computeNormal(new Cesium.Geometry({
        attributes: attributes,
        indices: indices,
        primitiveType: Cesium.PrimitiveType.TRIANGLES,
        boundingSphere: boundingSphere
    }));
  // 指定此四面体的各种属性
  // TetrahedronGeometry.attributes = attributes;
  // TetrahedronGeometry.indices = indices;
  // TetrahedronGeometry.primitiveType = Cesium.PrimitiveType.TRIANGLES;
  // TetrahedronGeometry.boundingSphere = undefined;


}
export {TetrahedronGeometry}