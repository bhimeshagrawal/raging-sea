import './style/main.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import ragingSeaVertexShaders from './shaders/ragingSea/vertex.glsl'
import ragingSeaFragmentShaders from './shaders/ragingSea/fragment.glsl'


// Sizes
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight
window.addEventListener('resize', () => {
    // Save sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
})
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
})
const mouse = new THREE.Vector2()
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / sizes.width * 2) - 1
    mouse.y = -(event.clientY / sizes.height * 2) + 1
})



// GUI
const gui = new dat.GUI()
const debugObject = {}
debugObject.depthColor = "#186691"
debugObject.surfaceColor = "#9bd8ff"


// Scene
const scene = new THREE.Scene()



// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)



// Test
const geometry = new THREE.PlaneBufferGeometry(2, 2, 128, 128)

const material = new THREE.ShaderMaterial({
    vertexShader: ragingSeaVertexShaders,
    fragmentShader: ragingSeaFragmentShaders,
    wireframe: false,
    side: THREE.DoubleSide,
    uniforms: {
        uTime: { value: 0 },
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },
        uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        uColorOffset: { value: 0.168 },
        uColorMultiplier: { value: 2.8 }
    }
})
gui.add(material, 'wireframe')
gui.add(material.uniforms.uColorMultiplier, 'value').min(0).max(10.0).step(0.1).name('uColorMultiplier')
gui.add(material.uniforms.uColorOffset, 'value').min(0).max(10.0).step(0.1).name('uColorOffset ')
gui.add(material.uniforms.uBigWavesSpeed, 'value').min(0.0).max(1.0).step(0.001).name('uBigWavesSpeed')
gui.add(material.uniforms.uBigWavesElevation, 'value').min(0.0).max(1.0).step(0.001).name('uBigWavesElevation')
gui.addColor(debugObject, 'depthColor').onChange(() => { material.uniforms.uDepthColor.value.set(debugObject.depthColor) })
gui.addColor(debugObject, 'surfaceColor').onChange(() => { material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor) })
const frequencyFolder = gui.addFolder('uBigWavesFrequency')
frequencyFolder.add(material.uniforms.uBigWavesFrequency.value, 'x').min(0.0).max(10.0).step(0.01)
frequencyFolder.add(material.uniforms.uBigWavesFrequency.value, 'y').min(0.0).max(10.0).step(0.01)
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)



// Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(sizes.width, sizes.height)



// Loop
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
const clock = new THREE.Clock()
const loop = () => {
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.uTime.value = elapsedTime
    controls.update();
    renderer.render(scene, camera)
    // keep looping
    window.requestAnimationFrame(loop)
}
loop()