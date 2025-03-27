import * as THREE from 'three'
import { Mesh, SphereGeometry, TextureLoader } from 'three'
// 导入轨道控制器 (类)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入动画库
import gsap from 'gsap'
// 导入cannon3D引擎
import * as CANNON from "cannon-es"
console.log(CANNON);
 
// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300)
// 设置相机位置 x, y, z
camera.position.set(0, 0, 18)
scene.add(camera)
 
 
 
 
let manyCube = []
const cubeMaterial = new THREE.MeshStandardMaterial()
const createCube = () => { // 每次点击重新生成一个立方体，包含three和物理世界的，
    // three几何体
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.castShadow = true
    scene.add(cube)
 
    // 物理几何体
    const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) // 宽高为1的正方体, 参数要写为宽高的一半
    // 设置物体材质
    const cubeWorldMaterial = new CANNON.Material('cube')
    // 创建物理世界的物体，类似于假世界的 Mesh步骤
    const cubeBody = new CANNON.Body({
        shape: cubeShape,
        position: new CANNON.Vec3(0, 0, 0),
        mass: 1, // （相互碰撞会有什么效果）
        material: cubeWorldMaterial, // 材质
 
    })
    cubeBody.applyLocalForce(
        new CANNON.Vec3(300, 0, 0), // 添加的力的大小和方向
        new CANNON.Vec3(0, 0, 0) // 添加的力的所在的位置
    )
    // 将物体添加到物理世界
    world.addBody(cubeBody)
 
    // 创建碰撞声音
    const hitSound = new Audio(require('../assets/audio/hai.mp3'))
    // 监听物理小球碰撞事件        
    function HitEvent(e) {
        console.log(e);
        const impactStrength = e.contact.getImpactVelocityAlongNormal() // 获取碰撞的强度
        console.log(impactStrength); // 两次碰撞，第一次8.1, 第二次1.1
 
        if (impactStrength > 2) {
            hitSound.currentTime = 0 // 重新从0开始播放
            hitSound.volume = impactStrength / 15 // 设置音量 0~1
            hitSound.play() // 碰撞时播放声音 
        }
    }
    cubeBody.addEventListener('collide', HitEvent) // 碰撞反弹了几下，就会执行几下
 
    manyCube.push({
        three: cube,
        body: cubeBody
    })
}
 
// 创建物理世界
const world = new CANNON.World()
world.gravity.set(0, -9.8, 0) // 设置世界重力，y向下为负，真实世界重力加速度为9.8NM
 
createCube()
 
window.addEventListener('click', createCube)
 
 
 
// three平面
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial()
)
floor.position.set(0, -5, 0)
floor.rotation.x = -Math.PI / 2
floor.receiveShadow = true
scene.add(floor)
 
// 开启灯光, 添加环境光和平行光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
dirLight.castShadow = true
scene.add(dirLight)
 
 
 
 
// 物理世界地面
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
const floorMaterial = new CANNON.Material('floor') // 构建地面材质
floorBody.material = floorMaterial
floorBody.mass = 0 // 质量为0时，可以让物体保持不动，不管怎么碰撞都是不动的  
floorBody.addShape(floorShape) // 添加平面模型
floorBody.position.set(0, -5, 0)
// 旋转地面的位置 （以三维向量的x轴旋转 -90度）类似于threejs中的ratation.x = ...旋转
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(floorBody)
 
// 设置两种材质碰撞的参数
const defaultContactMaterial = new CANNON.ContactMaterial(
    cubeMaterial, // three中的要碰撞的物体材质
    floorMaterial, // 物理世界的平面材质
    {
        friction: 0.4, // 摩擦力
        restitution: 0.6, // 弹性
    }
)
 
// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial)
 
// 设置事件碰撞默认材料，如果材料没有设置都用这个
world.defaultContactMaterial = defaultContactMaterial
 
 
 
 
 
 
 
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.shadowMap.enabled = true
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将webgl渲染的canvas内容添加到body上
document.body.appendChild(renderer.domElement)
 
// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 开启控制器阻尼，更有真实效果，有惯性（设置的同时还需要在render请求动画函数中设置update更新方法才会生效）
controls.enableDamping = true
 
// 设置坐标轴辅助器 AxesHelper( size : Number ) 代表轴的线段长度，默认为1
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
 
// 设置时钟
const clock = new THREE.Clock()
const render = () => {
    let time = clock.getElapsedTime()
    let deltaTime = clock.getDelta()
    // 更新物理引擎世界的物体
    world.step(1 / 120, 0.02) // 每帧渲染120次 
 
    // 将物理世界小球位置坐标赋值给普通小球
    // cube.position.copy(cubeBody.position)
    manyCube.forEach(item => {
        item.three.position.copy(item.body.position)
        // 设置渲染的物体跟随物理的物体旋转
        item.three.quaternion.copy(item.body.quaternion)
    })
 
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render) // 请求动画会给render传递一个时间，为当前请求动画帧执行的毫秒数
}
render()
 
// 监听页面尺寸变化，更新渲染页面
window.addEventListener('resize', () => {
    // 更新摄像头的位置
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})
 