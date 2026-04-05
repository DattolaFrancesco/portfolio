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
    useGSAP(() => {
    const wrap = wrapperRef.current
    const ascii = asciiRef.current
    const surname = document.querySelector(".surname");
    const name = document.querySelector(".name");
    const dot= document.querySelectorAll(".dot");
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
        if(self.progress<=0.3){
          setAsciiText("FRANCESCO");
              setAsciiSecondText("DATTOLA")
              dot[0].classList.add("text-white")
              dot[0].classList.add("scale-[1.5]")
              dot[1].classList.remove("text-white")
              dot[1].classList.remove("scale-[1.5]")
              dot[2].classList.remove("text-white")
              dot[2].classList.remove("scale-[1.5]")
        }
        else if(self.progress>0.35 && self.progress<0.6 )
            { 
              dot[0].classList.remove("text-white")
              dot[0].classList.remove("scale-[1.5]")
              dot[2].classList.remove("text-white")
              dot[2].classList.remove("scale-[1.5]")
              dot[1].classList.add("text-white")
              dot[1].classList.add("scale-[1.5]")
              setAsciiText("A FULL STACK");
              setAsciiSecondText("WEB DEVELOPER")
            }
          else if(self.progress>0.6 && self.progress<0.9)
        { 
              dot.forEach((d)=>{
              d.classList.remove("hidden")
              })
              dot[0].classList.remove("text-white")
              dot[0].classList.remove("scale-[1.5]")
              dot[1].classList.remove("text-white")
              dot[1].classList.remove("scale-[1.5]")
              dot[2].classList.add("text-white")
              dot[2].classList.add("scale-[1.5]")
              setAsciiText("BASED");
              setAsciiSecondText("IN BRESCIA")
               surname.classList.remove("opacity-[0]")
            const asciiRect  = ascii.getBoundingClientRect()
            dyRef.current = asciiRect.bottom
            dxRef.current = asciiRect.left
            }
            else if (self.progress>0.9){
            setAsciiText("WORKS");
            surname.classList.add("opacity-[0]")
             dot.forEach((d)=>{
            d.classList.add("hidden")
            })

            }
      },
      onEnterBack:()=>{
        name.classList.remove("text-start")
        isWorkRef.current = false
          gsap.to(ascii,{
          x:0,
          y:0
        })
      },
      onLeave:()=>{
        name.classList.add("text-start")
        isWorkRef.current = true
        gsap.to(ascii,{
          x:-dxRef.current,
          y:dyRef.current
        })
      }
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
        <div className="absolute text-gray-400 right-[5%]">
          <p className="dot">•</p>
          <p className="dot">•</p>
          <p className="dot">•</p>
        </div>
      <div ref={asciiRef} 
    style={{ perspective: '900px' }} 
   className=""
   >
          <Ascii 
      text={asciiText}
      cols={Math.max(12, asciiText.length * 3)}        // risoluzione orizzontale
      rows={15}        // risoluzione verticale
      speed={100}      // ms per frame
      thresh={1}     // soglia pixel
      gap={2}
      className="text-white text-center name"
      />
          <Ascii 
      text={asciiSecondText}
      cols={Math.max(12, asciiText.length * 3)}        // risoluzione orizzontale
      rows={15}        // risoluzione verticale
      speed={100}      // ms per frame
      thresh={1}     // soglia pixel
      gap={2}
      className="text-white text-center surname"
      />
      </div>
      </div>
      <div ref={secondRef} className=" w-full h-[100svh] flex justify-between items-center">
        <div className={`text-white w-full flex text-xs justify-between ms-[3] border-t border-b border-white py-3`}> 
          <p>Memory Form</p>
          <p>Archive of photo fully draggable</p>
          <p>developed in nextJs and tailwind</p>
        </div>
        <Cube/>
      </div>
      
   </div>
   
  )
}
