import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

export default function Cube({ hoveredProject }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current  // salva subito per il cleanup

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const size = Math.max(window.innerHeight / 2.5, window.innerWidth / 2.5)
    renderer.setSize(size, size)
    renderer.setPixelRatio(window.devicePixelRatio)
    mount.appendChild(renderer.domElement)

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
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/homePageElsolito.webp')}), // destra
      new THREE.MeshBasicMaterial({  map: loader.load('/elsolito/infoElsolito.webp') }), // sinistra
      new THREE.MeshBasicMaterial({map: new THREE.VideoTexture(video2)  }), // top
      new THREE.MeshBasicMaterial({  map: loader.load('/elsolito/worksElsolito.webp') }), // bottom
      new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture(video1)}), // fronte
      new THREE.MeshBasicMaterial({ map: loader.load('/elsolito/tvElsolito.webp')}), // retro
    ]
    const cube = new THREE.Mesh(geometry, materials)
    scene.add(cube)

    // colore attivo tracciato fuori dal loop per evitare set() inutili
    let lastHovered = null

    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)

      const current = hoveredProject.current
      if (current !== lastHovered) {
        const color = current === 'memoryForm' ? 0xff0000 : 0xff00ff
        cube.material.forEach(m => m.color.set(color))
        lastHovered = current
      }

      renderer.render(scene, camera)
    }
    animate()

    const tl = gsap.to(cube.rotation, {
      y: Math.PI * 2,
      x: Math.PI * 2,
      duration: 15,
      repeat: -1,
      ease: 'none',
    })

    return () => {
      cancelAnimationFrame(animId)
      tl.kill()                              // ferma l'animazione gsap
      mount?.removeChild(renderer.domElement)
      geometry.dispose()
      materials.forEach(m => m.dispose())
      renderer.dispose()
    }
  }, [])  // [] va bene perché hoveredProject è un ref, non cambia mai

  return <div ref={mountRef} />
}