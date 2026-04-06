"use client";

import Image from "next/image";
import Ascii from "./components/Ascii";
import Cube from "./components/Cube";
import gsap from "gsap";
import { useRef, useEffect, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { velocity } from "three/tsl";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const wrapperRef = useRef(null);
  const asciiRef = useRef(null);
  const secondRef = useRef(null);
  const selectedVelocityRef = useRef(1)

  const [asciiText, setAsciiText] = useState("FRANCESCO");
  const [asciiSecondText, setAsciiSecondText] = useState("DATTOLA");

  const isWorkRef = useRef(false);
  const dxRef = useRef(0);
  const dyRef = useRef(0);
  const alredayLoaded = useRef(false);
  const percentRef = useRef(null);
  const hoveredProject = useRef(null);
  const velocity = useRef(null);
  const selectedVelocity = ()=>{
    console.log(selectedVelocityRef.current)
    if(selectedVelocityRef.current === 1){
        document.querySelector(".uno").classList.add("bg-white")
        document.querySelector(".uno").classList.add("text-black")
        document.querySelector(".due").classList.remove("bg-white")
        document.querySelector(".due").classList.remove("text-black")
        document.querySelector(".tre").classList.remove("bg-white")
        document.querySelector(".tre").classList.remove("text-black")
    }
    else if(selectedVelocityRef.current === 2){
        document.querySelector(".uno").classList.remove("bg-white")
        document.querySelector(".uno").classList.remove("text-black")
        document.querySelector(".due").classList.add("bg-white")
        document.querySelector(".due").classList.add("text-black")
        document.querySelector(".tre").classList.remove("bg-white")
        document.querySelector(".tre").classList.remove("text-black")
    }
    else if(selectedVelocityRef.current === 5){
        document.querySelector(".uno").classList.remove("bg-white")
        document.querySelector(".uno").classList.remove("text-black")
        document.querySelector(".due").classList.remove("bg-white")
        document.querySelector(".due").classList.remove("text-black")
        document.querySelector(".tre").classList.add("bg-white")
        document.querySelector(".tre").classList.add("text-black")
    }
  }
  useGSAP(
    () => {
      const wrap = wrapperRef.current;
      const ascii = asciiRef.current;
      const surname = document.querySelector(".surname");
      const name = document.querySelector(".name");

      if (!wrap) return;
      if (!ascii) return;

      function onMove(e) {
        if (isWorkRef.current) return;

        const rect = wrap.getBoundingClientRect();

        const nx =
          (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const ny =
          (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        gsap.to(ascii, {
          rotateY: nx * 15,
          rotateX: -ny * 15,
          duration: 0.4,
          ease: "power2.out",
          transformPerspective: 900,
          transformOrigin: "center center",
        });
      }

      function onLeave() {
        gsap.to(ascii, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.8,
          ease: "power1.inOut",
        });
      }

      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          if (percentRef.current) {
            percentRef.current.textContent =
              Math.round(self.progress * 132) + "%";
          }

          if (self.progress <= 0.25) {
            gsap.to(secondRef.current, { yPercent: 100, opacity: 0 });
            setAsciiText("FRANCESCO");
            setAsciiSecondText("DATTOLA");
          } else if (self.progress > 0.25 && self.progress < 0.5) {
            setAsciiText("A FULL STACK");
            setAsciiSecondText("WEB DEVELOPER");
            secondRef.current.classList.remove("hidden");
          } else if (self.progress > 0.5 && self.progress < 0.75) {
            onLeave();
            isWorkRef.current = false;

            percentRef.current.classList.remove("opacity-0");
            name.classList.remove("text-start");

            gsap.to(ascii, {
              x: 0,
              y: 0,
            });

            setAsciiText("BASED");
            setAsciiSecondText("IN BRESCIA");

            surname.classList.remove("opacity-[0]");

            if (!alredayLoaded.current) {
              const asciiRect = ascii.getBoundingClientRect();
              dyRef.current = asciiRect.top;
              dxRef.current = asciiRect.left - 5;
            }

            gsap.to(secondRef.current, { yPercent: 100, opacity: 0 });
          } else if (self.progress > 0.75) {
            isWorkRef.current = true;

            gsap.to(secondRef.current, { yPercent: 0, opacity: 1 });

            setAsciiText("WORKS");
            surname.classList.add("opacity-[0]");
            percentRef.current.classList.add("opacity-0");

            alredayLoaded.current = true;

            name.classList.add("text-start");

            isWorkRef.current = true;

            gsap.to(ascii, {
              x: -dxRef.current,
              y: -dyRef.current,
            });
          }
        },
      });

      wrap.addEventListener("mousemove", onMove);
      wrap.addEventListener("mouseleave", onLeave);

      return () => {
        wrap.removeEventListener("mousemove", onMove);
        wrap.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: wrapperRef, dependencies: [secondRef] }
  );

  return (
    <div>
      <div
        ref={wrapperRef}
        className="bg-black flex flex-col items-center justify-center w-full h-[100svh] relative"
      >
        <p
          ref={percentRef}
          className="text-gray-400 absolute bottom-0 right-[50%] translate-x-1/2"
        >
          0%
        </p>

        <div
          ref={asciiRef}
          style={{ perspective: "900px" }}
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

        <div
          ref={secondRef}
          className="w-full h-[100svh] flex flex-col justify-center items-center absolute hidden"
        >
          <div className="text-white absolute top-0 right-0 p-2 flex justify-center gap-2 text-xs">
            <button onClick={()=>{
              velocity.current = 1
              selectedVelocityRef.current = 1
              selectedVelocity()
              }} 
              className="hover:bg-white bg-white hover:text-black text-black py-0 px-3 uno">1x</button>
            <button onClick={()=>{
              velocity.current = 2
              selectedVelocityRef.current = 2
              selectedVelocity()
              }} 
              className="hover:bg-white hover:text-black py-0 px-3 due">2x</button>
            <button onClick={()=>{
              velocity.current = 5
              selectedVelocityRef.current = 5
              selectedVelocity()
              }} 
              className="hover:bg-white hover:text-black py-0 px-3 tre">5x</button>
          </div>
          <Cube
            hoveredProject={hoveredProject}
            velocity={velocity}
            className="absolute top-1/2"
          />
          <div className="text-white w-full text-sm grid grid-cols-[1fr_2fr_2fr_2fr_0.5fr]
           px-3 uppercase mix-blend-difference">
            <p className="text-gray-400">Title</p>
            <p className="text-gray-400">Concept</p>
            <p className="text-gray-400">Stack</p>
            <p className="text-gray-400">Visit</p>
            <p className="text-gray-400">Year</p>
          </div>

          <div
            className="text-white border-t w-full text-sm grid grid-cols-[1fr_2fr_2fr_2fr_0.5fr]
             px-3 uppercase mix-blend-difference hover:bg-white cursor-pointer first"
            onClick={() => {
              hoveredProject.current = "memoryForm";
            }}
          >
            <p>Memory Form</p>
            <p>
              Archive full of draggable photos
            </p>
            <p>NextJs•Tailwind</p>
            <a target="_blank" href="google.com">
              <p className="hover:text-pink-400">
                memoryForm.it
              </p>
            </a>
            <p>2026</p>
          </div>

          <div
            className="text-white border-t border-b w-full text-sm grid grid-cols-[1fr_2fr_2fr_2fr_0.5fr]
             px-3 uppercase mix-blend-difference hover:bg-white cursor-pointer second"
            onClick={() => {
              hoveredProject.current = "elsolito";
            }}
          >
            <p>
              Elsolito/Portfolio
            </p>
            <p>
              Navigation through Tv or GameBoy
            </p>
            <p>
              React•Vite•Bootstrap
            </p>
            <a target="_blank" href="https://www.elsolito.it/">
              <p className="hover:text-pink-400">
                elsolito.it
              </p>
            </a>
            <p>2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}