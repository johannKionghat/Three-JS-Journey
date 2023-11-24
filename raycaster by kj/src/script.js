import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { AdditiveBlending, AudioAnalyser, BufferAttribute, Geometry, Vector3, VertexColors } from 'three'
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

 const sphere1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,15,15),
    new THREE.MeshBasicMaterial({color:"red"})
 )
 const sphere2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,15,15),
    new THREE.MeshBasicMaterial({color:"red"})
 )
 const sphere3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.5,15,15),
    new THREE.MeshBasicMaterial({color:"red"})
 )

sphere1.position.x=-2
sphere3.position.x=2
scene.add(sphere1,sphere2,sphere3)

//============== Raycaster ==================================
const raycaster = new THREE.Raycaster()
const mouse= new THREE.Vector2()
let currentIntersect = null
window.addEventListener('mousemove',(e)=>{
    mouse.x= e.clientX / sizes.width*2 - 1
    mouse.y= -(e.clientY / sizes.height*2 -1)
})
window.addEventListener('click',()=>{
   
if (currentIntersect){
    console.log('target destroy')

}
    
})


//===========================================================

//========= camera ==============
 const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.0001,2000)
 camera.position.z=3
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

    sphere1.position.y=Math.sin(elapsedTime*0.5)*2
    sphere2.position.y=Math.sin(elapsedTime*1)*2
    sphere3.position.y=Math.sin(elapsedTime*1.5)*2
    
     raycaster.setFromCamera(mouse, camera)
    
    const objectsToTest = [sphere1, sphere2, sphere3]
    const intersects = raycaster.intersectObjects(objectsToTest)
    
    

    for(const object of objectsToTest)
    {
        if(!intersects.find(intersect => intersect.object === object))
        {
            object.material.color.set('#ff0000')
        }
    }
    for(const intersect of intersects)
    {
        intersect.object.material.color.set('#0000ff')
    }
    if (intersects.length)
    {
        if(currentIntersect===null){
            console.log('mouse enter')
        }
        currentIntersect=intersects[0]
        
    }else{
        if (currentIntersect){
            console.log('mouse leave')
        }
        currentIntersect=null
        
    }
   
 
    window.requestAnimationFrame(animation)
    renderer.render(scene, camera)
}
animation()