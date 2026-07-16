"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ButtonScramble from "../ButtonScramble";
import ScrambleText from "../ScrambleText";

const workDesktop = ["/image1.JPG", "/image2.JPG", "/image3.JPG"];
const nameWork = ["SkateSpot", "Lollo Gallery", "Elsolito"];
const typeWork = ["Community driven", "Gallery", "Portfolio"];
const yearWork = ["2026", "2026", "2026"];
const linkWork = [
  "https://skatemap-frontend.vercel.app/",
  "https://lollo-gallery.vercel.app/",
  "https://www.elsolito.it/",
];

const infoWork = [
  {
   description:
      "A community-driven platform for skaters to discover and share skate spots on an interactive global map. Photos are resized and compressed client-side before upload to keep things fast, videos are handled through a streaming-based delivery system, and an AI chatbot lets users search spots using natural language.",
   role: "Full-stack development, API design, architecture",
   stack: {
      frontend: ["Next.js", "React", "Tailwind CSS"],
      backend: ["Java", "Spring Boot", "Spring Security (JWT)", "PostgreSQL", "Spring AI / OpenAI"],
   },
   },
   {
   description:
      "A minimal photography gallery site built for visual impact. Images can be freely dragged around the canvas with physics-based inertia, and the site offers multiple viewing modes with separate optimized layouts for desktop and mobile.",
   role: "Frontend development, art direction",
   stack: {
      frontend: ["Next.js", "React", "GSAP", "Tailwind CSS"],
   },
   },
   {
    description:
    "A retro-themed portfolio site with playful TV and GameBoy-style navigation, scroll-driven animations, and a nostalgic visual identity throughout.",
  role: "Frontend development, design",
  stack: {
    frontend: ["React", "Vite", "React Router", "GSAP", "Bootstrap"],
  },
   },
];

function InfoButton({ open, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-expanded={open}
      className="flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 shrink-0 mix-blend-difference text-white cursor-pointer"
    >
      <span className="relative w-2.5 h-2.5 sm:w-3 sm:h-3 inline-block">
        <span className="absolute top-1/2 left-0 w-full h-[1.5px] sm:h-[2px] bg-white -translate-y-1/2" />
        <span
          className="absolute top-0 left-1/2 h-full w-[1.5px] sm:w-[2px] bg-white -translate-x-1/2 transition-transform duration-300"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        />
      </span>
    </button>
  );
}

function WorkItem({ src, name, type, year, info, link, i }) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const panelRef = useRef(null);
  const innerRef = useRef(null);
  const tweenRef = useRef(null);

  useGSAP(() => {
    // kill any in-flight animation before starting a new one, senza scatti
    if (tweenRef.current) {
      tweenRef.current.kill();
    }

    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner) return;

    // Anima grid-template-rows (0fr -> 1fr): il browser interpola il layout
    // in modo nativo, senza dover leggere/scrivere offsetHeight ad ogni frame.
    // Nessun opacity/transform sull'ancestor: eviterebbe di creare uno
    // stacking context che spezza il mix-blend-difference dei figli.
    const tl = gsap.timeline();
    tweenRef.current = tl;

    if (open) {
      tl.to(panel, {
        gridTemplateRows: "1fr",
        duration: 0.55,
        ease: "power3.out",
      });
    } else {
      tl.to(panel, {
        gridTemplateRows: "0fr",
        duration: 0.4,
        ease: "power3.inOut",
      });
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  return (
    <div className="w-[90%] sm:w-3/4 md:w-2/3">
      <div className="flex w-full justify-between items-center gap-2 mix-blend-difference text-white flex-wrap">
        <ScrambleText as="h1" text={type} className="text-sm sm:text-lg md:text-xl" />
        <div className="flex items-center gap-2">
          <ScrambleText as="h1" text={name} className="text-sm sm:text-lg md:text-xl" />
          <InfoButton open={open} onClick={() => setOpen((v) => !v)} />
        </div>
      </div>

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-full h-full aspect-video block cursor-pointer overflow-hidden"
      >
        {!loaded && (
          <div className="absolute inset-0 bg-black/10 animate-pulse" />
        )}
        <Image
          key={`desktop-${i}`}
          src={src}
          alt={name}
          fill
          className={`object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
        />
      </a>

      <ScrambleText
        as="h1"
        text={year}
        className="mix-blend-difference text-white text-sm sm:text-base md:text-lg"
      />

      <div
        ref={panelRef}
        className="grid will-change-[grid-template-rows]"
        style={{ gridTemplateRows: "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            ref={innerRef}
            className="flex flex-col gap-1.5 sm:gap-2 py-2 sm:py-3  border-t border-black/20"
          >
            <ScrambleText
              as="p"
              text={info.description}
              className="mix-blend-difference text-white text-xs sm:text-base md:text-lg"
            />
            <ScrambleText
              as="p"
              text={`Role: ${info.role}`}
              className="mix-blend-difference text-white text-[11px] sm:text-sm md:text-base opacity-70"
            />
            <ScrambleText
              as="p"
              text={`Frontend: ${info.stack.frontend.join(", ")}`}
              className="mix-blend-difference text-white text-[11px] sm:text-sm md:text-base opacity-70"
            />
            {info.stack.backend && (
              <ScrambleText
                as="p"
                text={`Backend: ${info.stack.backend.join(", ")}`}
                className="mix-blend-difference text-white text-[11px] sm:text-sm md:text-base opacity-70"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Works() {
  return (
    <div className="w-full flex flex-col justify-center items-center gap-3 py-3">
      <div className="flex ">
        <ButtonScramble text={"Back"} hrefLink="/" />
      </div>
      {workDesktop.map((src, i) => (
        <WorkItem
          key={i}
          i={i}
          src={src}
          name={nameWork[i]}
          type={typeWork[i]}
          year={yearWork[i]}
          info={infoWork[i]}
          link={linkWork[i]}
        />
      ))}
    </div>
  );
}