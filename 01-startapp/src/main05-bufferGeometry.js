/*
 * @Author: liuhp 2190098961@qq.com
 * @Date: 2025-02-12 10:58:47
 * @LastEditors: liuhp 2190098961@qq.com
 * @LastEditTime: 2025-02-18 15:20:52
 * @FilePath: \3d-study\01-startapp\src\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

import * as THREE from 'three'
// 导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'


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



// // 创建几何体
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// // 创建材质
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// const parentMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// // 设置父元素材质为线框模式
// parentMaterial.wireframe = true
// // 创建网格
// let parentCube = new THREE.Mesh(geometry, parentMaterial)
// const cube = new THREE.Mesh(geometry, material)
// parentCube.add(cube)
// parentCube.position.set(-3, 0, 0)
// parentCube.rotation.x = Math.PI / 4 // 父元素旋转，子元素跟随旋转
// // parentCube.scale.set(2, 2, 2) // 父元素缩放后，子元素会跟随同样缩放
// // cube.position.x = 2
// cube.position.set(3, 0, 0)

// cube.rotation.x = Math.PI / 4 // 跟随父元素旋转完，继续旋转
// // cube.scale.set(2, 2, 2) // 在父元素缩放的基础上，子元素再缩放2倍


// // 将网格添加到场景中
// scene.add(parentCube)  // 父元素为原点，位移和缩放和子元素绑定

// 创建几何体
const geometry = new THREE.BufferGeometry()
// 创建顶点数据,顶点是有序的，每三个为一个顶点，逆时针为正面
// const vertices = new Float32Array([
//   -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,
//   1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, -1.0, 0.0,
// ])
// /使用索引绘制
const vertices = new Float32Array([
  -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0
])
// 创建顶点属性
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
// 创建索引
const indices = new Uint16Array([0, 1, 2, 2, 3, 0])
// 创建索引属性
geometry.setIndex(new THREE.BufferAttribute(indices, 1))
console.log('geometry', geometry)
// 创建才值
const material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  side: THREE.DoubleSide,
  wireframe: true
})
const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

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
controls.autoRotate = true



// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  // 旋转
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}

animate()

let eventObj = {
  Fullscreen: function () {
    // 全屏
    document.body.requestFullscreen()
    console.log('全屏')
  },
  ExitFullscreen: function () {
    // 退出全屏
    document.exitFullscreen()
    console.log('退出全屏')
  }
}
// 创建GUI
const gui = new GUI()
// 添加按钮
gui.add(eventObj, 'Fullscreen').name('全屏')
gui.add(eventObj, 'ExitFullscreen').name('退出全屏')


