<!--
 * @Author: liuhp 2190098961@qq.com
 * @Date: 2025-02-13 09:52:08
 * @LastEditors: liuhp 2190098961@qq.com
 * @LastEditTime: 2025-02-13 09:58:40
 * @FilePath: \3d-study\03-结合vue进行开发\threejsvue\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
 import * as THREE from 'three'

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

// 创建几何体
const geometry = new THREE.BoxGeometry(1, 1, 1)
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 创建网格
const cube = new THREE.Mesh(geometry, material)

// 将网格添加到场景中
scene.add(cube)

// 设置相机位置
camera.position.z = 5
camera.lookAt(0, 0, 0)

// 渲染函数
function animate() {
  requestAnimationFrame(animate)
  // 旋转
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  // 渲染
  renderer.render(scene, camera)
}

animate()
</script>

<template>
  <div>
  </div>
</template>

<style>

</style>
