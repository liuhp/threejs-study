/*
 * @Author: liuhp 2190098961@qq.com
 * @Date: 2025-02-12 10:58:47
 * @LastEditors: liuhp 2190098961@qq.com
 * @LastEditTime: 2025-02-27 10:39:27
 * @FilePath: \3d-study\01-startapp\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// 导入hdr加载器
import { RGBLoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'


// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, //视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近平面
  1000 // 远平面
)

// 创建渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 设置相机位置
camera.position.z = 5
camera.position.y = 2
camera.position.x = 2
camera.lookAt(0, 0, 0)

// 添加世界坐标辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
// 添加轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置带阻尼的惯性
controls.enableDamping = true
// 设置阻尼系数
controls.dampingFactor = 0.05
// 设置旋转速度
// controls.autoRotate = true



// 渲染函数
function animate() {
  controls.update()
  requestAnimationFrame(animate)
  // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}

animate()

// 监听窗口变化
window.addEventListener('resize', () => {
  // 重置渲染器宽高比
  renderer.setSize(window.innerWidth, window.innerHeight)
  // 重置相机宽高比
  camera.aspect = window.innerWidth / window.innerHeight
  // 更新相机投影矩阵
  camera.updateProjectionMatrix()
})

// 创建GUI
const gui = new GUI()
// 创建场景fog
scene.fog = new THREE.Fog(0x999999, 0.1, 50)
// 创建场景fog指数
// scene.fog = new THREE.FogExp2(0x999999, 0.1)
scene.background = new THREE.Color(0x999999)

// 实例化加载器gltf
const gltfLoader = new GLTFLoader()
// 加载模型
gltfLoader.load(
  // 模型路径
  './models/duck.gltf',
  // 加载完成回调
  (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
  }
)
// 加载模型
gltfLoader.load(
  // 模型路径
  './models/city.gltf',
  // 加载完成回调
  (gltf) => {
    console.log(gltf)
    scene.add(gltf.scene)
  }
)
// 实例化加载器draco
const dracoLoader = new DRACOLoader()
// 设置draco路径
dracoLoader.setDecoderPath('./draco')
// 设置gltf加载器draco解码器
gltfLoader.setDRACOLoader(dracoLoader)

// 加载环境贴图(小鸭子上色)
let rgbeLoader = new RGBELoader()
rgbeLoader.load('./texture/XXX.hdr', (envMap) => {
  envMap.mapping = THREE.EquirectangularReflectionMapping
  // 设置环境贴图
  scene.environment = envMap
})

