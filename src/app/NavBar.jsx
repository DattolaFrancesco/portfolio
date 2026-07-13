"use client";

import { useRef } from "react";
import gsap from "gsap";
import ButtonScramble from "./ButtonScramble";
import { toggleGlitch } from "./GlitchStore";

const themes = [
  { bg: "#ffffff", hoverBg: "#41df07", hoverColor: "#000000" },
  { bg: "#41df07", hoverBg: "#000000", hoverColor: "#41df07" },
  { bg: "#000000", hoverBg: "#ffffff", hoverColor: "#000000" },
  { bg: "#ff5100", hoverBg: "#0057ff", hoverColor: "#ffffff" },
  { bg: "#0057ff", hoverBg: "#ff5100", hoverColor: "#ffffff" },
  { bg: "#ff00c8", hoverBg: "#00fff0", hoverColor: "#000000" },
  { bg: "#fff700", hoverBg: "#8a00ff", hoverColor: "#ffffff" },
  { bg: "#8a00ff", hoverBg: "#fff700", hoverColor: "#000000" },
  { bg: "#ff003c", hoverBg: "#00ff85", hoverColor: "#000000" },
  { bg: "#00ff85", hoverBg: "#ff003c", hoverColor: "#ffffff" },
];

export default function NavBar(){
    const indexRef = useRef(0);
    const tweenRef = useRef(null);

    function cycleTheme(){
        indexRef.current = (indexRef.current + 1) % themes.length;
        const theme = themes[indexRef.current];
        if (tweenRef.current) tweenRef.current.kill();

        tweenRef.current = gsap.to(document.body, {
            backgroundColor: theme.bg,
            duration: 0.6,
            ease: "power2.out",
        });

        gsap.to(document.documentElement, {
            "--hover-bg": theme.hoverBg,
            "--hover-color": theme.hoverColor,
            duration: 0.6,
            ease: "power2.out",
        });
    }

    return(
        <nav className="z-50 top-0 p-3 w-full flex flex-col">
            <ButtonScramble hrefLink={"/"} style={"!text-2xl  mix-blend-difference"} text={"FRANCESCO DATTOLA"} onClick={cycleTheme}/>
            <ButtonScramble text={"works"} hrefLink={"/works"}/>
            <ButtonScramble text={"about"} hrefLink={"/about"}/>
            <ButtonScramble text={"gitHub"} hrefLink={"https://github.com/DattolaFrancesco"} blank={true}/>
            <ButtonScramble text={"email"} hrefLink={"mailto:dattolafrancescoo@gmail.com"}/>
            <ButtonScramble text={"glitch"} onClick={toggleGlitch}/>
        </nav>
    ) 
}