'use client'
import { Environment, MeshTransmissionMaterial} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import NavBar from "./NavBar";
import useGlitch from "./UseGlitch";


const RotatingCube = () => {
    const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const meshRef = useRef()
    useFrame(()=>{
        if(meshRef.current){
            meshRef.current.rotation.x += 0.005 
            meshRef.current.rotation.y += 0.01 
        }
    })
    return (
        <mesh ref={meshRef}>
            <torusKnotGeometry args={[isMobile ? 0.8 : isTablet ? 1.2 : 1.5, isMobile ? 0.3 : isTablet ? 0.5 : 0.5, 150,20]}/>
            <MeshTransmissionMaterial
            thickness={0.8}          // spessore del "vetro"
            roughness={0.05}         // 0 = vetro perfettamente liscio
            transmission={1}         // 1 = completamente trasparente
            ior={1.5}                // indice di rifrazione (vetro reale ~1.5)
            chromaticAberration={0.03}
            backside={true}
            />
        </mesh>
    )
}

function AsciiTakeover(){
    const { gl, scene, camera, size } = useThree();
    const effectRef = useRef(null);

    useEffect(() => {
        const effect = new AsciiEffect(gl, " .:-+*=%@#", { resolution: 0.18 });
        effect.setSize(size.width, size.height);
        Object.assign(effect.domElement.style, {
            position: "absolute",
            top: "0",
            left: "0",
            pointerEvents: "none",
            color: "white",
            mixBlendMode: "difference",
            backgroundColor: "transparent",
            fontFamily: "'VT323', monospace",
        });
        const style = document.createElement("style");
        style.dataset.asciiFix = "true";
        style.textContent = `
            .ascii-takeover table, .ascii-takeover td {
                background: transparent !important;
            }
        `;
        effect.domElement.classList.add("ascii-takeover");
        document.head.appendChild(style);

        const parent = gl.domElement.parentNode;
        parent.appendChild(effect.domElement);
        gl.domElement.style.visibility = "hidden";
        effectRef.current = effect;

        return () => {
            gl.domElement.style.visibility = "visible";
            effect.domElement.remove();
            style.remove();
            effectRef.current = null;
        };
    }, [gl, size]);
    useFrame(({ scene, camera }) => {
        effectRef.current?.render(scene, camera);
    }, 1);

    return null;
}

export default function Hero(){
    const glitch = useGlitch();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setReady(true), 600);
        return () => clearTimeout(t);
    }, []);

    return(
        <div className="h-dvh w-screen relative">
        <NavBar/>
        <div style={{ position: "relative", height: "80%", width: "100vw" }}>
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    opacity: ready ? 0 : 1,
                    transition: "opacity 500ms",
                    pointerEvents: "none",
                }}
            >
                <div className="aspect-square w-48 sm:w-64 md:w-80 bg-black/10 rounded-md animate-pulse" />
            </div>
            <Canvas
                style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <directionalLight position={[1,1,1]} intensity={10} color={0x9CDBA6}/>
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <RotatingCube/>
                </Suspense>
                {glitch && <AsciiTakeover/>}
            </Canvas>
        </div>
        </div>  
    )
}