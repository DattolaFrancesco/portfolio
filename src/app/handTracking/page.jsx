'use client'

import { useEffect, useRef, useState } from "react"
import { GestureRecognizer, FilesetResolver } from "@mediapipe/tasks-vision";
import { useRouter } from "next/navigation"
import About from "../about/About";
import Works from "../works/Works";

const WARMUP_FRAMES = 15 

export default function HandTracking(){
    const router = useRouter()
    const videoRef = useRef(null)
    const [stream,setStream] = useState(null)
    const gestureRecognizer = useRef(null);
    const refIdAnimationFrame = useRef(null)
    const canvasRef = useRef(null)
    const [gesture,setGesture] = useState("")
    const [gestureScroll,setGestureScroll] = useState(null)
    const [loadingProgress, setLoadingProgress] = useState(0)
    const [appReady, setAppReady] = useState(false)
    const [cameraError, setCameraError] = useState(null) // null | "denied" | "notfound" | "generic"
    const appReadyRef = useRef(false)
    const warmupCountRef = useRef(0)
    const modelLoadedRef = useRef(false)

    const HAND_CONNECTIONS = [
    // thumb
    [0,1],[1,2],[2,3],[3,4],
    // index
    [0,5],[5,6],[6,7],[7,8],
    // middle
    [5,9],[9,10],[10,11],[11,12],
    // ring
    [9,13],[13,14],[14,15],[15,16],
    // pinky
    [13,17],[17,18],[18,19],[19,20],
    // palm (finger bases + wrist)
    [0,17]
    ]

    const loadModel = async()=>{
        // fake but smooth progress while the model downloads/compiles,
        // so the user always sees progress even if the real load is slow
        let fake = 0
        const interval = setInterval(()=>{
            fake = Math.min(fake + 2, 45)
            setLoadingProgress(prev => Math.max(prev, fake))
        }, 120)

        try{
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm")
            gestureRecognizer.current = await GestureRecognizer.createFromOptions(vision,{
                baseOptions: {modelAssetPath:"https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",delegate: "GPU" },
                runningMode: "VIDEO",
                numHands: 1,
            })
            modelLoadedRef.current = true
            setLoadingProgress(prev => Math.max(prev, 50))
        } finally {
            clearInterval(interval)
        }
    }

    const syncCanvasSize = () => {
        const canvas = canvasRef.current
        const video = videoRef.current
        if (!canvas || !video) return
        canvas.width = video.clientWidth
        canvas.height = video.clientHeight
    }

    const startCamera = async()=>{
        // reset state on every attempt (useful for retry after a denial)
        setCameraError(null)
        appReadyRef.current = false
        warmupCountRef.current = 0
        setAppReady(false)
        if(refIdAnimationFrame.current) cancelAnimationFrame(refIdAnimationFrame.current)

        try {
            const camera = await navigator.mediaDevices.getUserMedia({ video: true })
            setStream(camera)
            if (videoRef.current){
                videoRef.current.srcObject = camera
                videoRef.current.addEventListener("loadeddata", () => {
                    syncCanvasSize()
                    setLoadingProgress(prev => Math.max(prev, 65))
                    detectHands()
                }, {once:true})
            }
        } catch (err) {
            console.error("Camera error:", err.message)
            if(err.name === "NotAllowedError" || err.name === "PermissionDeniedError"){
                setCameraError("denied")
            } else if(err.name === "NotFoundError" || err.name === "DevicesNotFoundError"){
                setCameraError("notfound")
            } else {
                setCameraError("generic")
            }
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
        if(!videoRef.current || !gestureRecognizer.current){
            refIdAnimationFrame.current = requestAnimationFrame(detectHands)
            return
        }

        const video = videoRef.current
        const startMs = performance.now()
        const results = gestureRecognizer.current.recognizeForVideo(video,startMs)

        // --- warm-up phase: run inference but don't show anything yet ---
        if(!appReadyRef.current){
            warmupCountRef.current += 1
            const warmupProgress = 65 + Math.min(35, Math.round((warmupCountRef.current / WARMUP_FRAMES) * 35))
            setLoadingProgress(prev => Math.max(prev, warmupProgress))

            if(warmupCountRef.current >= WARMUP_FRAMES){
                appReadyRef.current = true
                setLoadingProgress(100)
                setAppReady(true)
            }
            refIdAnimationFrame.current = requestAnimationFrame(detectHands)
            return
        }

        // --- normal, steady-state operation ---
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

    // --- camera permission error screen ---
    if(cameraError){
        return (
            <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center text-center p-6">
                <p className="text-lg">
                    {cameraError === "denied" && "You denied camera access. Camera permission is required to use hand tracking."}
                    {cameraError === "notfound" && "No camera was found on this device."}
                    {cameraError === "generic" && "Something went wrong while accessing the camera."}
                </p>
                {cameraError === "denied" && (
                    <p className="text-sm opacity-70 max-w-md">
                        If the button below doesn't reopen the permission prompt, check your browser's site settings
                        (the lock icon next to the URL on desktop, or Site settings on mobile) and re-enable the
                        camera manually.
                    </p>
                )}
                <button
                    onClick={startCamera}
                    className="px-4 py-2 bg-black text-white rounded-xl hover:opacity-80 transition"
                >
                    Request camera access again
                </button>
            </div>
        )
    }

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
            {appReady ? <div className="mt-50">
                {gesture === "" &&<div className="w-full flex justify-center"> <p className="mix-blend-difference text-white">Use your hand to navigate through the portfolio</p></div>}
                {gesture === "🖐️" && <About/>}
                {gesture === "☝️" && <Works/>}
            </div> : (
                <div className="w-screen h-screen flex flex-col gap-3 justify-center items-center">
                    <p className="text-2xl font-semibold">{loadingProgress}%</p>
                    <div className="w-64 h-2 bg-black/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-150 ease-out"
                            style={{ width: `${loadingProgress}%` }}
                        />
                    </div>
                    <p className="text-sm opacity-70">Loading the gesture recognition model...</p>
                </div>
            )}
        </div>
    )
}