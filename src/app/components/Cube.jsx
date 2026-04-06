import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

export default function Cube({ hoveredProject, velocity }) {
  const mountRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current 

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const size = Math.max(window.innerHeight / 2.5, window.innerWidth / 2.5)
    renderer.setSize(size, size)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

     const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.enablePan = false

    const geometry = new THREE.BoxGeometry(2, 2, 2)
    const loader = new THREE.TextureLoader()
    const video1 = document.createElement('video')
      video1.src = '/elsolito/elsolito.mov'
      video1.loop = true
      video1.muted = true
      video1.playsInline = true
      video1.play()

    const video2 = document.createElement('video')
      video2.src = '/elsolito/gameboyElsolito.mov'
      video2.loop = true
      video2.muted = true
      video2.playsInline = true
      video2.play()       
    const materials1 = [
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/homePageElsolito.webp')}), // destra
      new THREE.MeshBasicMaterial({  map: loader.load('/elsolito/infoElsolito.webp') }), // sinistra
      new THREE.MeshBasicMaterial({map: new THREE.VideoTexture(video2)  }), // top
      new THREE.MeshBasicMaterial({  map: loader.load('/elsolito/worksElsolito.webp') }), // bottom
      new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(video1)}), // fronte
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/tvElsolito.webp')}), // retro
    ]
    const materials2 = [
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/homePageElsolito.webp')}), // destra
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/infoElsolito.webp') }), // sinistra
      new THREE.MeshBasicMaterial({map: loader.load('/elsolito/infoElsolito.webp')  }), // top
      new THREE.MeshBasicMaterial({  map: loader.load('/elsolito/infoElsolito.webp')}), // bottom
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/infoElsolito.webp')}), // fronte
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/infoElsolito.webp')}), // retro
    ]
    const cube = new THREE.Mesh(geometry, materials2)
    scene.add(cube)

    // colore attivo tracciato fuori dal loop per evitare set() inutili
    let lastHovered = null

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      const current = hoveredProject.current
      if(velocity.current === 1) tlRef.current.timeScale(1)
      if(velocity.current === 2) tlRef.current.timeScale(2)
      if(velocity.current === 5) tlRef.current.timeScale(3)
      if (current !== lastHovered) {
        if(current === 'memoryForm'){
            cube.material = materials2
            cube.material.forEach((e)=>{e.needsUpdate= true})
        }
        else if(current === 'elsolito'){
           cube.material = materials1
            cube.material.forEach((e)=>{e.needsUpdate= true})
        }
        lastHovered = current
      }

      renderer.render(scene, camera)
    }
    animate()

    tlRef.current = gsap.to(cube.rotation, {
      y: Math.PI*2 ,
      x: Math.PI*2,
      duration: 15,
      repeat: -1,
      ease: 'none',
    })
    const onStart = () => tlRef.current.pause()
    const onEnd = () => tlRef.current.resume()
    renderer.domElement.addEventListener('mousedown', onStart)
    renderer.domElement.addEventListener('touchstart', onStart)
    window.addEventListener('mouseup', onEnd)
    window.addEventListener('touchend', onEnd)

    return () => {
   cancelAnimationFrame(animId)
      tlRef.current.kill()
      controls.dispose()
      renderer.domElement.removeEventListener('mousedown', onStart)
      renderer.domElement.removeEventListener('touchstart', onStart)
      window.removeEventListener('mouseup', onEnd)
      window.removeEventListener('touchend', onEnd)
      mount?.removeChild(renderer.domElement)
      geometry.dispose()
      materials1.forEach(m => m.dispose())
      materials2.forEach(m => m.dispose())
      renderer.dispose()
    }
  }, [])  

  return <div ref={mountRef} />
}