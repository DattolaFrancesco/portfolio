'use client'
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/all";
import Link from "next/link";
import useGlitch from "./UseGlitch";
gsap.registerPlugin(ScrambleTextPlugin);

export default function ButtonScramble({text,hrefLink,blank,style,onClick}){
    const pRef = useRef(null);
    const glitchTweenRef = useRef(null);
    const glitch = useGlitch();

    function textScramble(e){
        
        const p = e.querySelector("p");
        if (!p.dataset.original) {
            p.dataset.original = p.textContent;
        }
        const originalText = p.dataset.original;
        gsap.to(p, {duration: 0.5, scrambleText: {text: `${originalText}`,chars: "@#$%^&*_+-;:,.<>?"}});
    }

    useEffect(() => {
        const p = pRef.current;
        if (!p) return;
        if (glitchTweenRef.current) glitchTweenRef.current.kill();

        if (glitch) {
            glitchTweenRef.current = gsap.to(p, {
                duration: 1.1,
                repeat: -1,
                scrambleText: { text, chars: "@#$%^&*_+-;:,.<>?", revealDelay: 0.25, speed: 0.4 },
            });
        } else {
            glitchTweenRef.current = gsap.to(p, {
                duration: 0.4,
                scrambleText: { text, chars: "@#$%^&*_+-;:,.<>?" },
            });
        }

        return () => {
            if (glitchTweenRef.current) glitchTweenRef.current.kill();
        };
    }, [glitch, text]);

    return(
        <Link className={`button-hero`} target={blank  ? "_blank": ""}  href={hrefLink ?? ""} onMouseEnter={(e)=>textScramble(e.currentTarget)} onClick={onClick}><p ref={pRef} className={`mix-blend-difference text-white ${style}`}>{text}</p></Link>
    )
}