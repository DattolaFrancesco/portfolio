'use client'

import { useEffect, useRef, useState } from "react"
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { useRouter } from "next/navigation"
import About from "../about/About";
import Works from "../works/Works";

export default function HandTracking(){
    const router = useRouter()
    const videoRef = useRef(null)
    const [stream,setStream] = useState(null)
    const gestureRecognizer = useRef(null);
    const [modelReady, setModelReady] = useState(false);
    const refIdAnimationFrame = useRef(null)
    const [gesture,setGesture] = useState("")
    const [gestureScroll,setGestureScroll] = useState(null)

    const loadModel = async()=>{
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
        gestureRecognizer.current = await GestureRecognizer.createFromOptions(vision,{
        baseOptions: {modelAssetPath:"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
        })
        setModelReady(true)
    }
    const startCamera = async()=>{
       try {
        const camera = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(camera)
        if (videoRef.current){ 
            videoRef.current.srcObject = camera
            videoRef.current.addEventListener("loadeddata",detectHands, {once:true})
        }
        } catch (err) {
            console.error("Errore fotocamera:", err.message)
        }
    }
    const stopCamera = ()=>{
        if(stream) stream.getTracks().forEach((track)=>track.stop())
        setStream(null)
        if(refIdAnimationFrame.current) cancelAnimationFrame(refIdAnimationFrame.current)
    }
    const detectHands = ()=>{
        if(!videoRef.current) return
        if(gestureRecognizer.current){
            const video = videoRef.current
            const startMs = performance.now()
            const results = gestureRecognizer.current.recognizeForVideo(video,startMs)
            switch(results.gestures[0]?.[0].categoryName){
                // case "Closed_Fist" : setGesture("✊");
                // break
                case "Open_Palm" : setGesture("🖐️");
                break
                case "Pointing_Up" : setGesture("☝️");
                break
                case "Thumb_Down" : setGestureScroll("👎"); scrollDown();
                break
                case "Thumb_Up" : setGestureScroll("👍"); scrollUp();
                break
                case "ILoveYou" : setGesture("🤟");
                break
                case "null": setGestureScroll("");
                break
            }
        }
        refIdAnimationFrame.current = requestAnimationFrame(detectHands)
    }
    const scrollDown = ()=>{
        window.scrollBy({top:20, behavior:"auto"})
    }
    const scrollUp = ()=>{
        window.scrollBy({top:-20, behavior:"auto"})
    }
    useEffect(()=>{
    startCamera()
    loadModel()
    },[])
    useEffect(()=>{
    if(gesture ===  "🤟") router.push("/")
    },[gesture])
    useEffect(()=>{
     return () => {
        if (stream) stream.getTracks().forEach((track) => track.stop())
    }
    },[stream])
    return (
        <div className="w-screen h-screen">
                <div className="w-full md:w-fit flex p-3 justify-between fixed top-0 z-[999]">
                   <div className="w-full flex p-3 gap-3 bg-black/20 rounded-xl">
                        <video ref={videoRef} autoPlay muted playsInline className="w-full md:w-50 h-35 md:h-full object-cover rounded-xl"/>
                        <div className="flex flex-col gap-3">
                            <p className="mix-blend-difference text-white text-sm md:text-base">Current gesture : {gesture}</p>
                            <p className="mix-blend-difference text-white text-sm md:text-base">Works : ☝️</p>
                            <p className="mix-blend-difference text-white text-sm md:text-base">About : 🖐️</p>
                            <p className="mix-blend-difference text-white text-sm md:text-base">Home : 🤟</p>
                            <p className="mix-blend-difference text-white text-sm md:text-base">Up : 👍</p>
                            <p className="mix-blend-difference text-white text-sm md:text-base">Down : 👎</p>
                        </div>
                   </div>
                </div>
            <div className="mt-50">
                {gesture === "" &&<div className="w-full flex justify-center"> <p className="mix-blend-difference text-white">Use your hand to navigate through the portfolio</p></div>}
                {gesture === "🖐️" && <About/>}
                {gesture === "☝️" && <Works/>}
            </div>
        </div>
    )
}