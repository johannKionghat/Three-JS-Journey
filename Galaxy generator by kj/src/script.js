import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { AdditiveBlending, AudioAnalyser, BufferAttribute, VertexColors } from 'three'
import { random } from 'gsap'

//debug
//=====
const gui = new dat.GUI()
//textures
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load('/textures/particles/8.png')
//creation de la scene
//========canvas======
const canvas = document.querySelector('.webgl')
const sizes={width:window.innerWidth, height:window.innerHeight}
//====================
 const scene = new THREE.Scene()
 //=============== cube-test =====
 const parameters = {}
 parameters.count = 100000
 parameters.size = 0.01
 parameters.radius = 5
 parameters.branches = 3
 parameters.spin = 1
 parameters.randomness = 0.2
 parameters.randomnessPower = 3
 parameters.insideColor='#ff6030'
 parameters.outsideColor='#1b3982'

 let Geometry = null
 let Material = null
 let particles = null

const generateGalaxy = ()=>{
    if (particles!==null){
        Geometry.dispose()
        Material.dispose()
        scene.remove(particles)
    }
    Geometry = new THREE.BufferGeometry()

    const positions = new Float32Array( parameters.count *3)
    const colors = new Float32Array(parameters.count*3)
    const colorInside = new THREE.Color(parameters.insideColor) 
    const colorOutside = new THREE.Color(parameters.outsideColor) 

    for (let i = 0 ; i< parameters.count; i++)
    {
        //positions
        //====================================================
        const i3 = i*3
        const radius = (Math.random())*parameters.radius

        const branchAngle= (i% parameters.branches)/parameters.branches*Math.PI*2
        const spinAngle = radius*parameters.spin

        const randomX = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(),parameters.randomnessPower) * (Math.random()<0.5 ? 1 : -1)
 
        positions[i3]= (Math.cos(branchAngle+spinAngle)*radius)+randomX
        positions[i3+1]=randomY
        positions[i3+2]=Math.sin(branchAngle+spinAngle)*radius+randomZ
        //clors
        //=========================================================
       const mixedColor = colorInside.clone()
       mixedColor.lerp(colorOutside,radius/parameters.radius)
        colors[i3]=mixedColor.r
        colors[i3+1]=mixedColor.g
        colors[i3+2]=mixedColor.b
    }
    Geometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
    Geometry.setAttribute('color', new THREE.BufferAttribute(colors,3))

    Material = new THREE.PointsMaterial({
        size:parameters.size, 
        sizeAttenuation: true,
        depthWrite:false,
        map:texture,
        blending:THREE.AdditiveBlending,
        vertexColors:true

    })
    particles = new THREE.Points(Geometry, Material)
    scene.add(particles)
}
generateGalaxy()
gui.add(parameters, 'count').min(10).max(50000).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'size').min(0.01).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'radius').min(0.01).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'branches').min(2).max(30).step(1).onFinishChange(generateGalaxy)
gui.add(parameters,'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters,'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters,'outsideColor').onFinishChange(generateGalaxy)

//========= camera ==============
 const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.0001,2000)
 camera.position.z=5
 scene.add(camera)
//=============== controleurs =================
const controls = new OrbitControls(camera, canvas)
controls.enableDamping=true
//================= rendu-WebGL ====================
const renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.render(scene, camera)
renderer.setSize(sizes.width, sizes.height) 
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
//==============resize======================================
window.addEventListener('resize',()=>{
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
//=============== animation ================================
const clock = new THREE.Clock()
const animation = ()=>{
    
    const elapsedTime = clock.getElapsedTime()
    particles.rotation.y=elapsedTime*0.5
    window.requestAnimationFrame(animation)
    renderer.render(scene, camera)
}
animation()