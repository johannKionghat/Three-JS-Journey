import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import * as dat from 'dat.gui'
import { HemisphereLight } from 'three'
//----------------------------------------
//preparation du canvas de vue et la scene
//---------------------------------------------
const canvas = document.querySelector('.webgl')
const gui = new dat.GUI()
const sizes={
    width:window.innerWidth,
    height:window.innerHeight
}
 const scene = new THREE.Scene()
 //-----------------------------
 //creation du blur effect
 //-----------------------
 const fog = new THREE.Fog('#262837',0.6,20)
 scene.fog = fog
 //Espace de chargement des textures
 //---------------------------------

 const textureLoader = new THREE.TextureLoader()
const porteAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const porteAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const porteColorTexture = textureLoader.load('/textures/door/color.jpg')
const porteHeightTexture = textureLoader.load('/textures/door/height.jpg')
const porteMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const porteNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const porteroughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const murAmbientTextures = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const murColorTextures = textureLoader.load('/textures/bricks/color.jpg')
const murNormalTextures = textureLoader.load('/textures/bricks/normal.jpg')
const murRoughnessTextures = textureLoader.load('/textures/bricks/roughness.jpg')

const planeAmbientTextures = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const planeColorTextures = textureLoader.load('/textures/grass/color.jpg')
const planeNormalTextures = textureLoader.load('/textures/grass/normal.jpg')
const planeRoughnessTextures = textureLoader.load('/textures/grass/roughness.jpg')

planeAmbientTextures.repeat.set(8,8)
planeColorTextures.repeat.set(8,8)
planeNormalTextures.repeat.set(8,8)
planeRoughnessTextures.repeat.set(8,8)

planeAmbientTextures.wrapS=THREE.RepeatWrapping
planeColorTextures.wrapS=THREE.RepeatWrapping
planeNormalTextures.wrapS=THREE.RepeatWrapping
planeRoughnessTextures.wrapS=THREE.RepeatWrapping

planeAmbientTextures.wrapT=THREE.RepeatWrapping
planeColorTextures.wrapT=THREE.RepeatWrapping
planeNormalTextures.wrapT=THREE.RepeatWrapping
planeRoughnessTextures.wrapT=THREE.RepeatWrapping
//Espace de creation des Objects
 //------------------------------
 //-----------Environement-------------
 const maison = new THREE.Group()
 scene.add(maison)

 const mur = new THREE.Mesh (
    new THREE.BoxBufferGeometry(4,3,4),
    new THREE.MeshStandardMaterial({
        map: murColorTextures,
        aoMap: murAmbientTextures,
        normalMap: murNormalTextures,
        roughnessMap: murRoughnessTextures
    })
 )
 mur.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(mur.geometry.attributes.uv.array,2)
 )
 mur.position.y=1

 const toiture = new THREE.Mesh( 
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
 )
 toiture.position.y=3
 toiture.rotation.y=Math.PI*0.25

 const porte = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2,2,100,100),
    new THREE.MeshStandardMaterial({
        map: porteColorTexture,
        transparent: true,
        alphaMap:porteAlphaTexture,
        aoMap: porteAmbientOcclusionTexture,
        displacementMap: porteHeightTexture,
        displacementScale:0.2,
        normalMap: porteNormalTexture,
        metalnessMap: porteMetalnessTexture,
        roughnessMap: porteroughnessTexture

    })
 )
 porte.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(porte.geometry.attributes.uv.array,2)
 )
 porte.position.z=1.98
 porte.position.y=0.5

 const bush1 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.6,16,16),
    new THREE.MeshStandardMaterial({
        map: planeColorTextures,
        aoMap: planeAmbientTextures,
        normalMap: planeNormalTextures,
        roughnessMap: planeRoughnessTextures})
 )
 bush1.position.z=2.3
 bush1.position.x=1.5
 bush1.position.y=-0.25

 const bush2 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.6,16,16),
    new THREE.MeshStandardMaterial({
        map: planeColorTextures,
        aoMap: planeAmbientTextures,
        normalMap: planeNormalTextures,
        roughnessMap: planeRoughnessTextures})
 )
 bush2.position.z=2.2
 bush2.position.x=-1.8
 bush2.position.y=-0.25

 const bush3 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.4,16,16),
    new THREE.MeshStandardMaterial({
        map: planeColorTextures,
        aoMap: planeAmbientTextures,
        normalMap: planeNormalTextures,
        roughnessMap: planeRoughnessTextures})
 )
 bush3.position.z=2.1
 bush3.position.x=-0.9
 bush3.position.y=-0.25
 

 const bush4 = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.4,16,16),
    new THREE.MeshStandardMaterial({
        map: planeColorTextures,
        aoMap: planeAmbientTextures,
        normalMap: planeNormalTextures,
        roughnessMap: planeRoughnessTextures})
 )
 bush4.position.z=2
 bush4.position.x=2
 bush4.position.y=-0.4

 maison.add(mur,toiture,porte,bush1,bush2,bush3,bush4)

 const ghost1 = new THREE.PointLight('white',5,4)
 scene.add(ghost1)

 const ghost2 = new THREE.PointLight('blue', 5,4)
 scene.add(ghost2)

 const ghost3 = new THREE.PointLight('red', 5,4)
 scene.add(ghost3)

 const graves = new THREE.Group()
 scene.add(graves)

 const graveGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
 const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

 for (let i =0; i<30; i++)
 {
    const angle = Math.random()*Math.PI*2
    const radius =3.5 + Math.random() * 6
    const x = Math.sin(angle)*radius
    const z = Math.cos(angle)*radius

    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.z = z
    grave.position.y=-0.1
    grave.rotation.y=(Math.random()-0.5)*0.25
    grave.rotation.z=(Math.random()-0.5)*0.25
    grave.castShadow=true
    graves.add(grave)
 }

 //-------------------------------------------------------
 //-----------plane---------------------------------------
const planeGeometry = new THREE.PlaneBufferGeometry(30,30,100,100)
const planeMaterial = new THREE.MeshStandardMaterial({
    map: planeColorTextures,
    aoMap: planeAmbientTextures,
    normalMap: planeNormalTextures,
    roughnessMap: planeRoughnessTextures
})
const plane = new THREE.Mesh(planeGeometry,planeMaterial)
plane.geometry.setAttribute(
    'uv2',
    new THREE.Float32BufferAttribute(plane.geometry.attributes.uv.array,2)
 )
plane.rotation.x=-Math.PI*0.5
plane.position.y= - 0.5
scene.add(plane)
 //---------------------------------
 //realisation de la lumiere
 //-------------------------
 const ambientLight = new THREE.AmbientLight('#b9d5ff',0.12)
 scene.add(ambientLight)
 gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)

 const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const porteLight = new THREE.PointLight('#ff7d46',2,7)
porteLight.position.set(0,1.8,2.3)
maison.add(porteLight)
 //preparation de la camera visuelle
 //---------------------------------
 const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.001, 2000)
 scene.add(camera)
 camera.position.z=7
 //----------------------------------
 //contoleurs
const controle = new OrbitControls(camera, canvas)
controle.enableDamping=true
//-----------
 // preparation du rendu WEBGL visuel
 //----------------------------------------
 const renderer = new THREE.WebGLRenderer({
    canvas: canvas
 })
 renderer.setSize(sizes.width, sizes.height)
 renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
 renderer.render(scene, camera)
 renderer.setClearColor('#262837')
 renderer.shadowMap.enabled=true
 renderer.shadowMap.type= THREE.PCFSoftShadowMap

 ambientLight.castShadow=true
 moonLight.castShadow=true
 porteLight.castShadow=true
 ghost1.castShadow=true
 ghost2.castShadow=true
 ghost3.castShadow=true

 mur.castShadow=true
 bush1.castShadow=true
 bush2.castShadow=true
 bush3.castShadow=true
 bush4.castShadow=true
 
 plane.receiveShadow=true

 //----------------------------
 //responsivite de canvas 
 //----------------------
 window.addEventListener('resize',()=>{
    console.log('ok')
    sizes.width=window.innerWidth
    sizes.height=window.innerHeight

    camera.aspect= sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
 })
 //------------------------------------------------------
 //animation des elements 
 //------------------------------------------------
 const clock = new THREE.Clock()
 const animation = ()=>{
    const elapsedTime = clock.getElapsedTime()
   
    const ghost1angle = elapsedTime*0.5
    ghost1.position.x = Math.cos(ghost1angle)*5
    ghost1.position.z = Math.sin(ghost1angle)*5
    ghost1.position.y= Math.sin(elapsedTime*2)

    const ghost2angle = -elapsedTime*0.2
    ghost2.position.x = Math.cos(ghost2angle)*7
    ghost2.position.z = Math.sin(ghost2angle)*7
    ghost2.position.y= Math.sin(elapsedTime*1.8)

    const ghost3angle = elapsedTime*0.8
    ghost3.position.x = Math.cos(ghost3angle)*6
    ghost3.position.z = Math.sin(ghost3angle)*6
    ghost3.position.y= Math.sin(elapsedTime*3)
    
   //  camera.position.x=Math.sin(elapsedTime*0.5)*10
   //  camera.position.z=Math.cos(elapsedTime*0.5)*10
   //  camera.position.y=Math.abs(Math.sin(elapsedTime*0.5)*6)
    controle.update()
    window.requestAnimationFrame(animation)
    renderer.render(scene, camera)
 }
 animation()