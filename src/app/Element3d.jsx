
'use client'
import { Environment, MeshTransmissionMaterial} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import NavBar from "./NavBar";


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
            //color="#43fd00"
            />
            {/* <Sparkles count={100} scale={1} size={5} speed={0.002} noise={0.2} color="orange"/> */}
        </mesh>
    )
}

export default function Hero(){

    return(
        <div className="h-dvh w-screen">
        <NavBar/>
        <Canvas style={{height:'80%', width: ' 100vw', display:'flex', justifyContent: 'center', alignItems: 'center'}}>
            <directionalLight position={[1,1,1]} intensity={10} color={0x9CDBA6}/>
            <Environment preset="studio" />
            {/* <color attach="background" args={['#F0F0F0']}/> */}
            <RotatingCube/>
        </Canvas>
        </div>  
    )
}
