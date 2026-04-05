import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from "gsap"

export default function Cube({ hoveredProject }) {
  const mountRef = useRef(null)
  const materialsRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene() //contenitore invisibile di tutto, tutto quello che sarà visibile sara qua dentro
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 3      
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    const windowSizeW = Math.max(window.innerHeight/2.5,window.innerWidth/2.5)
    renderer.setSize(windowSizeW, windowSizeW)
    mountRef.current.appendChild(renderer.domElement)  
    const geometry = new THREE.BoxGeometry(2, 2, 2) 
    const loader = new THREE.TextureLoader()
    const material = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // destra - rosso
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // sinistra - verde
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top - blu
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom - giallo
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // fronte - viola
    new THREE.MeshBasicMaterial({ color: 0x00ffff }), // retro - ciano
    ]
     const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
    let animId
const animate = () => {
    if(hoveredProject.current === 'memoryForm') {
    cube.material.forEach(m => m.color.set(0xff0000))
  } else {
    cube.material.forEach(m => m.color.set(0xff00ff))
  }
  animId = requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
  const tl = gsap.to(cube.rotation, {
  y: Math.PI * 2,
  x: Math.PI * 2,
  duration: 15,
  repeat: -1,
  ease: 'none'
    })
return () => {
  cancelAnimationFrame(animId)
  mountRef.current?.removeChild(renderer.domElement)
  renderer.dispose()
}
  }, [])

  return <div ref={mountRef} />
}