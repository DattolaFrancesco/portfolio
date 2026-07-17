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
    const canvasRef = useRef(null)
    const [gesture,setGesture] = useState("")
    const [gestureScroll,setGestureScroll] = useState(null)
    
    const HAND_CONNECTIONS = [
    // pollice
    [0,1],[1,2],[2,3],[3,4],
    // indice
    [0,5],[5,6],[6,7],[7,8],
    // medio
    [5,9],[9,10],[10,11],[11,12],
    // anulare
    [9,13],[13,14],[14,15],[15,16],
    // mignolo
    [13,17],[17,18],[18,19],[19,20],
    // palmo (base delle dita + polso)
    [0,17]
    ]

    const loadModel = async()=>{
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
        gestureRecognizer.current = await GestureRecognizer.createFromOptions(vision,{
        baseOptions: {modelAssetPath:"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",delegate: "GPU" },
        runningMode: "VIDEO",
        numHands: 1,
        })
        setModelReady(true)
    }
    const syncCanvasSize = () => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
    }
    const startCamera = async()=>{
       try {
        const camera = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(camera)
        if (videoRef.current){ 
            videoRef.current.srcObject = camera
            videoRef.current.addEventListener("loadeddata", () => {
            syncCanvasSize()
            detectHands()
        }, {once:true})
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
    const drawDot = (x,y)=>{
        const canvas = canvasRef.current
        if(!canvas) return
        const ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.arc(x*canvas.width, y*canvas.height, 2, 0, 2 * Math.PI)
        ctx.fillStyle = "lime"
        ctx.fill()
    } 
    const drawLine = (a, b) => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        ctx.beginPath()
        ctx.moveTo(a.x * canvas.width, a.y * canvas.height)
        ctx.lineTo(b.x * canvas.width, b.y * canvas.height)
        ctx.strokeStyle = "black"
        ctx.lineWidth = 1.5
        ctx.stroke()
}
    const detectHands = ()=>{
        if(!videoRef.current) return
        if(gestureRecognizer.current){
            const video = videoRef.current
            const startMs = performance.now()
            const results = gestureRecognizer.current.recognizeForVideo(video,startMs)
             const canvas = canvasRef.current
            if(!canvas) return
            const ctx = canvas.getContext("2d")
            ctx.clearRect(0,0, canvas.width, canvas.height)
            results.landmarks.forEach((hand)=> {
                HAND_CONNECTIONS.forEach(([startIdx, endIdx]) => {
                    drawLine(hand[startIdx], hand[endIdx])
                })
                hand.forEach((d)=>drawDot(d.x,d.y))
            })
            switch(results.gestures[0]?.[0].categoryName){
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
    useEffect(() => {
    window.addEventListener("resize", syncCanvasSize)
    return () => window.removeEventListener("resize", syncCanvasSize)
}, [])
    return (
        <div className="w-screen h-screen">
                <div className="w-full md:w-fit flex p-3 justify-between fixed top-0 z-[999]">
                   <div className="w-full flex p-3 gap-3 bg-black/20 rounded-xl">
                       <div className="relative w-50 md:w-50 h-30 md:h-full">
                            <video 
                                ref={videoRef} 
                                autoPlay muted playsInline 
                                className="w-full h-full object-cover rounded-xl"
                            />
                            <canvas 
                                ref={canvasRef}
                                className="absolute inset-0 w-full h-full rounded-xl pointer-events-none"
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm md:text-base">Current gesture : {gesture}</p>
                            <p className="text-sm md:text-base">Works : ☝️</p>
                            <p className="text-sm md:text-base">About : 🖐️</p>
                            <p className="text-sm md:text-base">Home : 🤟</p>
                            <p className="text-sm md:text-base">Up : 👍</p>
                            <p className="text-sm md:text-base">Down : 👎</p>
                        </div>
                   </div>
                </div>
            {modelReady ? <div className="mt-50">
                {gesture === "" &&<div className="w-full flex justify-center"> <p className="mix-blend-difference text-white">Use your hand to navigate through the portfolio</p></div>}
                {gesture === "🖐️" && <About/>}
                {gesture === "☝️" && <Works/>}
            </div> : <div className="w-screen h-screen flex justify-center items-center"><p>Model is loading</p></div>}
        </div>
    )
}