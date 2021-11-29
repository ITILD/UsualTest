/* eslint-disable no-debugger */
import { viwerSettingFull } from "./GuiControl_Main_Setting.js";
import { BatchModel } from "./BatchModel.js";

function datGuiControl(guiRoot, controlParams) {
  const gui_0_root = guiRoot;
  gui_0_root.domElement.style = "position: absolute; top: 2px; left: 2px;";

  let options_0 = {
    CONTROL: "ModelExport"
  };
  gui_0_root.add(options_0, "CONTROL");
  // --------------------------------------------模型---------------------------------------------------
  let gui_0_f0 = gui_0_root.addFolder(viwerSettingFull.sceneParam.title);
  // 视角控制
  gui_0_f0.add(
    viwerSettingFull.sceneParam,
    "cameraList",
    viwerSettingFull.sceneParam.cameraListFull
  );
  // file_segmentation

  // 排除几何 目前只能单个大几何？？（天空盒）
  // let options = {
  //   shouldExportNode: function (node) {
  //     return node !== skybox;
  //   },
  // };
  let file_segmentation;
  let file_segmentation_arrays = [];

  let outFileName = "defaultFileName";

  // 展开
  gui_0_f0.closed = false;
  // 设定参数
  let geojsonType = "ArcGIS";
  let geojsonTypeChange = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    "geojsonType",
    ["ArcGIS", "OGC"]
  );
  geojsonTypeChange.onChange(function(value) {
    geojsonType = value;
    console.log("onChange:" + value);
  });
  let realGround;
  let ground_param = gui_0_f0.add(viwerSettingFull.sceneParam, "ground_param");
  ground_param.onChange(function(value) {
    realGround = value;
    console.log("onChange:" + value);
  });
  let realHeight;
  let height_param = gui_0_f0.add(viwerSettingFull.sceneParam, "height_param");
  height_param.onChange(function(value) {
    realHeight = value;
    console.log("onChange:" + value);
  });
  let moveX;
  let move_x = gui_0_f0.add(viwerSettingFull.sceneParam, "move_x");
  move_x.onChange(function(value) {
    moveX = Number(value);
    console.log("onChange:" + value);
  });
  let moveY;
  let move_y = gui_0_f0.add(viwerSettingFull.sceneParam, "move_y");
  move_y.onChange(function(value) {
    moveY = Number(value);
    console.log("onChange:" + value);
  });

  // 文件统计分割
  let file_segmentation_param = gui_0_f0.add(
    viwerSettingFull.sceneParam,
    "file_segmentation"
  );
  file_segmentation_param.onChange(function(value) {
    file_segmentation = value;
    console.log("onChange:" + value);
  });

  // 上传
  viwerSettingFull.sceneParam.UpModelFile = () => {
    // 清空上次场景
    if (polygonToDelete.length > 0) {
      let length = polygonToDelete.length;
      for (let index = 0; index < length; index++) {
        let polygon = polygonToDelete.pop();
        if (polygon != null && polygon != "" && typeof polygon != "undefined") {
          polygon.dispose();
        }
      }
    }
    // 获取文件
    getFile();
  };
  gui_0_f0.add(viwerSettingFull.sceneParam, "UpModelFile");

  // 输出模型
  // gui_0_f0.add(viwerSettingFull.sceneParam, "OutModelFile");

  // store a reference to our file handle
  let fileHandle;
  let polygonToDelete = [];

  async function getFile() {
    // 校验参数
    if (typeof moveX != "number") {
      alert("位移大数X不存在");

      return;
    }
    if (typeof moveY != "number") {
      alert("位移大数Y不存在");

      return;
    }
    // open file picker
    [fileHandle] = await window.showOpenFilePicker();

    if (fileHandle.kind === "file") {
      // run file code
      console.log(fileHandle);
    } else if (fileHandle.kind === "directory") {
      // run directory code
      console.log("directory", fileHandle);
    }

    // 如果没有选择文件，就不需要继续执行了
    if (!fileHandle) {
      return;
    }

    // 这里的 options 用来声明对文件的权限，能否写入
    const options = {
      writable: true,
      mode: "readwrite"
    };
    // 然后向用户要求权限
    if (
      (await fileHandle.queryPermission(options)) !== "granted" &&
      (await fileHandle.requestPermission(options)) !== "granted"
    ) {
      alert("Please grant permissions to read & write this file.");
      return;
    }

    // 前面获取的是 FileHandle，需要转换 File 才能用
    outFileName = fileHandle.name.replace(".json", "");
    const file = await fileHandle.getFile();
    // 接下来，`file` 就是普通 File 实例，你想怎么处理都可以，比如，获取文本内容
    const code = await file.text();

    /**
     * EPSG 右手3D坐标系 4978  wgs84地心空间直角坐标系、右手3D坐标系，由3个正交轴组成，X轴和Y轴在赤道平面上，正Z轴平行于地球平均旋转轴并指向北极。
     * 转babylon引擎左手系  y与z轴互换！！！  视角与坐标
     *
     *  */
    let fullJson = JSON.parse(code);

    // let testPosition = [186000, 2496000];
    // let testPosition = [moveX, moveY];
    let propertiesString = "attributes";

    if (file_segmentation) {
      for (let index = 0; index < fullJson.features.length; index++) {
        const feature = fullJson.features[index];
        // let geometry = feature.geometry;
        // let coordinatesArrayUp;
        if (geojsonType == "ArcGIS") {
          propertiesString = "attributes";
          // coordinatesArrayUp = geometry.rings[0];
        } else if (geojsonType == "OGC") {
          propertiesString = "properties";
          // coordinatesArrayUp = geometry.coordinates[0][0];
        }
        let properties = feature[propertiesString];
        let properties_file_segmentation = properties[file_segmentation];
        if (
          !properties_file_segmentation ||
          typeof file_segmentation == "undefined"
        ) {
          properties_file_segmentation = "_NULL";
        }
        !file_segmentation_arrays.includes(properties_file_segmentation) &&
          file_segmentation_arrays.push(properties_file_segmentation);
      }
    }
    // TODO循环加载多个图层

    let makeModel = name => {
      for (let index = 0; index < fullJson.features.length; index++) {
        const feature = fullJson.features[index];
        let geometry = feature.geometry;

        // attributes
        /**
         * Arcgis和OGC geojson字段不一致
         */
        //  ["ArcGIS", "OGC"]
        // let coordinatesArrayUp = geometry.coordinates[0][0];
        let coordinatesArrayUp;
        if (geojsonType == "ArcGIS") {
          propertiesString = "attributes";
          coordinatesArrayUp = geometry.rings[0];
        } else if (geojsonType == "OGC") {
          propertiesString = "properties";
          coordinatesArrayUp = geometry.coordinates[0][0];
        }
        let properties = feature[propertiesString];
        // 分割字符串
        if (
          (!properties[file_segmentation] &&
            (name == "_NULL" || typeof name == "undefined")) ||
          properties[file_segmentation] == name
        ) {
          let downGround;
          let downHeight;
          if (realGround) {
            downGround = properties[realGround];
          }
          if (realHeight) {
            downHeight = properties[realHeight];
          }
          // console.log("downGround", downGround, "downHeight", downHeight);
          // 参数缺失判断
          if (typeof downGround != "number" && typeof downHeight != "number") {
            alert(
              "数据地面高程字段 " +
                realGround +
                " 和 " +
                downHeight +
                " 均不存在"
            );
            break;
          }

          // 预处理底面
          // BatchModel.moveXY(coordinatesArrayUp, [197322.8269951, 2507964.03]);
          BatchModel.moveXY(coordinatesArrayUp, [moveX, moveY]);
          // let  coordinatesArrayDown =BatchModel.creatWallArrays(coordinatesArrayUp, 0)
          let polygon = BatchModel.createWallExtrudePolygon(
            coordinatesArrayUp.slice(0, coordinatesArrayUp.length - 1),
            downGround,
            downHeight
          );
          polygonToDelete.push(polygon);
        }
      }
    };
    let GLTF2Export = controlParams.GLTF2Export;
    let outFull = array => {
      let name = array.pop();
      makeModel(name);

      GLTF2Export.GLBAsync(controlParams.scene, outFileName + name)
        .then(glb => {
          glb.downloadFiles();
        })
        .then(() => {
          let length = polygonToDelete.length;
          for (let index = 0; index < length; index++) {
            let polygon = polygonToDelete.pop();
            if (
              polygon != null &&
              polygon != "" &&
              typeof polygon != "undefined"
            ) {
              polygon.dispose();
            }
          }

          if (array.length > 0 && polygonToDelete.length == 0) {
            outFull(array);
          }
        });
    };
    outFull(file_segmentation_arrays);
  }
}

export { datGuiControl };
