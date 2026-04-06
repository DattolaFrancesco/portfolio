"use client"
import Image from "next/image";
import Ascii from "./components/Ascii"
import GlitchAscii from "./components/GlitchAscii"
import Cube from "./components/Cube";
import gsap from "gsap"
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const wrapperRef = useRef(null)
  const asciiRef = useRef(null)
  const secondRef = useRef(null)
  const [asciiText,setAsciiText] = useState("FRANCESCO")
  const [asciiSecondText,setAsciiSecondText] = useState("DATTOLA")
  const isWorkRef = useRef(false)
  const dxRef = useRef(0)
  const dyRef = useRef(0)
  const alredayLoaded = useRef(false)
  const percentRef = useRef(null)
  const hoveredProject = useRef(null)
    useGSAP(() => {
    const wrap = wrapperRef.current
    const ascii = asciiRef.current
    const surname = document.querySelector(".surname");
    const name = document.querySelector(".name");
    if (!wrap) return
    if (!ascii) return

    function onMove(e) {
      if(isWorkRef.current) return
      const rect = wrap.getBoundingClientRect()
      const nx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)
      const ny = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)
      gsap.to(ascii, {
        rotateY:  nx * 15,
        rotateX: -ny * 15,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 900,
        transformOrigin: 'center center',
      })
    }

    function onLeave() {
      gsap.to(ascii, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power1.inOut",
      })
    }
    ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: '+=300%',
      pin: true,
      scrub: true,
      onUpdate: (self) =>{
        if( percentRef.current) percentRef.current.textContent = Math.round(self.progress*132)+'%'
        if(self.progress<=0.25){
            gsap.to(secondRef.current,{yPercent:100,opacity:0})
          setAsciiText("FRANCESCO");
              setAsciiSecondText("DATTOLA")
        }
        else if(self.progress>0.25 && self.progress<0.5 )
            { 
              setAsciiText("A FULL STACK");
              setAsciiSecondText("WEB DEVELOPER")
              secondRef.current.classList.remove("hidden")
            }
          else if(self.progress>0.5 && self.progress <0.75)
        {     
              onLeave()
              isWorkRef.current = false
              percentRef.current.classList.remove("opacity-0")
              name.classList.remove("text-start")
              gsap.to(ascii,{
                x:0,
                y:0
                })
              setAsciiText("BASED");
              setAsciiSecondText("IN BRESCIA")
               surname.classList.remove("opacity-[0]")
               if(!alredayLoaded.current){
                 const asciiRect  = ascii.getBoundingClientRect()
                 dyRef.current = asciiRect.top
                 dxRef.current = asciiRect.left-5
               }
               gsap.to(secondRef.current,{yPercent:100,opacity:0})
            }
            else if(self.progress>0.75){
               isWorkRef.current = true
                gsap.to(secondRef.current,{yPercent:0,opacity:1})
              setAsciiText("WORKS");
              surname.classList.add("opacity-[0]")
              percentRef.current.classList.add("opacity-0")
              alredayLoaded.current = true;
              name.classList.add("text-start")
              isWorkRef.current = true
              gsap.to(ascii,{
                x:-dxRef.current,
                y:-dyRef.current
              })
            }
            
      },
    })
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)

    return () => {
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
    }
  }, { scope: wrapperRef, dependencies:[secondRef] })

  return (
    
   <div>
      <div ref={wrapperRef} 
       className="bg-black flex flex-col items-center justify-center w-full h-[100svh] relative">
        <p ref={percentRef} className="text-gray-400 absolute bottom-0 right-[50%] translate-x-1/2">0%</p>
      <div ref={asciiRef} 
    style={{ perspective: '900px' }} 
   className=""
   >
          <Ascii 
      text={asciiText}
      cols={Math.max(12, asciiText.length * 3)}       
      rows={15}        
      speed={100}    
      thresh={1}    
      gap={2}
      className="text-white text-center name"
      />
          <Ascii 
      text={asciiSecondText}
      cols={Math.max(12, asciiText.length * 3)}       
      rows={15}        
      speed={100}    
      thresh={1}    
      gap={2}
      className="text-white text-center surname"
      />
      </div>
       <div ref={secondRef} className=" w-full h-[100svh]  flex flex-col justify-center items-center absolute hidden">
           <Cube hoveredProject={hoveredProject} className="absolute top-1/2"/>
       <div className="text-white w-full text-sm grid grid-cols-[0.2fr_1fr_2fr_2fr_0.2fr] px-3 gap-2 uppercase mix-blend-difference">
  <p className="text-gray-400">Id</p>
  <p className="text-gray-400">Title</p>
  <p className="text-gray-400">Concept</p>
  <p className="text-gray-400">Stack</p>
  <p className="text-gray-400">Year</p>

  <div className=" contents group hover:text-green-400 cursor-pointer" 
  onMouseEnter={()=>{hoveredProject.current = "memoryForm"}}
  onMouseLeave={()=>{hoveredProject.current = null}}
  >
    <p>01</p>
    <p>Memory Form</p>
    <p>Archive full of draggable photos</p>
    <p>NextJs•Tailwind</p>
    <p>2026</p>
  </div>
  <div className="contents group hover:text-green-400 cursor-pointer">
    <p>02</p>
    <p>Elsolito/Portfolio</p>
    <p>Navigation through Tv or GameBoy</p>
    <p>React•Vite•Bootstrap</p>
    <p>2026</p>
  </div>
</div>
      </div>
      </div>
     
   </div>
   
  )
}
