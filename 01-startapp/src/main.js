/*
 * @Author: liuhp 2190098961@qq.com
 * @Date: 2025-02-12 10:58:47
 * @LastEditors: liuhp 2190098961@qq.com
 * @LastEditTime: 2025-02-27 16:44:32
 * @FilePath: \3d-study\01-startapp\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
// // 导入hdr加载器
// import { RGBLoader } from 'three/examples/jsm/loaders/RGBELoader.js'
// 导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// 导入draco解码器
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { smootherstep } from 'three/src/math/MathUtils'
// 导入tween补间动画
import * as TWEEN from 'three/examples/jsm/libs/tween.module.js'


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
camera.position.z = 15
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
  TWEEN.update()
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
// 创建1个球
const sphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xff00ff,
  })
)
sphere1.position.x = -4
scene.add(sphere1)

const tween = new TWEEN.Tween(sphere1.position)
tween.to({ x: 4 }, 1000)
tween.onUpdate(() => {
  console.log(sphere1.position.x)
})
// 设置循环次数
// tween.repeat(Infinity)
tween.repeat(2)
// 循环往复
tween.yoyo(true)
// tween.delay(3000)
// 设置动画函数
tween.easing(TWEEN.Easing.Quadratic.InOut)

let tween2 = new TWEEN.Tween(sphere1.position)
tween2.to({ x: -4 }, 1000)

tween.chain(tween2)
tween2.chain(tween)

// 启动补间动画
tween.start()
tween.onStart(() => {
  console.log('开始')
})
tween.onComplete(() => {
  console.log('结束')
})
tween.onStop(() => {
  console.log('停止')
})

ween.onUpdate(() => {
  console.log('更新')
})

let params = {
  stop: function () {
    tween.stop()
  }
}
gui.add(params, "stop")

