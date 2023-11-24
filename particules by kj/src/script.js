import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { CubeCamera } from 'three'
//creation des particules
//-----------------------
//mis en place du canvas
//----------------------
const canvas = document.querySelector('.webgl')
const sizes={
    width:window.innerWidth,
    height:window.innerHeight
}
//debug
//-----
const gui = new dat.GUI()
//creation de la scene
//--------------------
const scene = new THREE.Scene()
//espace de creation d'objet
//--------------------------
//textures
//--------
const textureLoader = new THREE.TextureLoader()
const particulesTexture = textureLoader.load('/textures/particles/2.png')

// const axesHelper = new THREE.AxesHelper(4)
// scene.add(axesHelper)

const particulesGeometry = new THREE.BufferGeometry()
const count = 10000

const positions = new Float32Array(count*3)
const colors = new Float32Array(count*3) 
const waves={
    intensity:15
}

gui.add(waves,'intensity').min(1).max(100).step(1)
for (let i=0; i<count*3;i++)
{
   positions[i]=(Math.random()-0.5)*waves.intensity
   colors[i]=Math.random()
}
particulesGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
particulesGeometry.setAttribute('color', new THREE.BufferAttribute(colors,3))

const particulesMaterial = new THREE.PointsMaterial({
    size:0.5,
    sizeAttenuation:true,
    map: particulesTexture,
    transparent:true,
    alphaMap:particulesTexture,
    depthWrite:false,
    blending:THREE.AdditiveBlending,
    vertexColors:true
})
const particules = new THREE.Points(particulesGeometry, particulesMaterial)
scene.add(particules)

// const moonGeometry = new THREE.SphereBufferGeometry(2,64,64)
// const moonMaterial = new THREE.MeshStandardMaterial()
// const moon = new THREE.Mesh(moonGeometry, moonMaterial)
// scene.add(moon)
 
//lumiere
//-------
const ambientLight = new THREE.AmbientLight('white',1)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0).max(1).step(0.001)
//creation de la camera
//---------------------
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height,0.1,2000)
camera.position.z=3
scene.add(camera)

//creation du controle
//--------------------
const controle = new OrbitControls(camera, canvas)
controle.enableDamping=true
//creation de rendu
//-----------------
const renderer = new THREE.WebGLRenderer({canvas:canvas})
renderer.render(scene, camera)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(devicePixelRatio,2))
//adaptation de la taille au redimensionnement
//--------------------------------------------
window.addEventListener('resize',()=>{
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    camera.aspect=sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.render(scene, camera)
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio,2))
})
const clock = new THREE.Clock()
const animation = ()=>{

    const elapsedTime = clock.getElapsedTime()
    for (let i=0; i<count; i++)
    {
        const x = i*3
        const y = i*3+1
        const z = i*3+2
        particulesGeometry.attributes.position.array[y]=-(Math.sin(elapsedTime+particulesGeometry.attributes.position.array[x])*0.5)
        // particulesGeometry.attributes.position.array[x]=Math.cos(elapsedTime)*Math.random()*5
        // particulesGeometry.attributes.position.array[z]=
    }
    particulesGeometry.attributes.position.needsUpdate=true
    particules.rotation.y=elapsedTime*0.01
    controle.update()
    window.requestAnimationFrame(animation)
    renderer.render(scene, camera)
}
animation()