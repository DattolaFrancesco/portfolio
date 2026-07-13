'use client'
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/all";
import Link from "next/link";
gsap.registerPlugin(ScrambleTextPlugin);

export default function ButtonScramble({text,hrefLink,blank,style}){

    function textScramble(e){
        
        const p = e.querySelector("p");
        if (!p.dataset.original) {
            p.dataset.original = p.textContent;
        }
        const originalText = p.dataset.original;
        gsap.to(p, {duration: 0.5, scrambleText: {text: `${originalText}`,chars: "@#$%^&*_+-;:,.<>?"}});
    }
    return(
        <Link className={`button-hero`} target={blank  ? "_blank": ""}  href={hrefLink ?? ""} onMouseEnter={(e)=>textScramble(e.currentTarget)}><p className={`mix-blend-difference text-white ${style}`}>{text}</p></Link>
    )
}