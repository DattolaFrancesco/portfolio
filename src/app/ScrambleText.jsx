"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/all";
import useGlitch from "./UseGlitch";

gsap.registerPlugin(ScrambleTextPlugin);



export default function ScrambleText({ text, as: Tag = "p", className }) {
  const ref = useRef(null);
  const tweenRef = useRef(null);
  const glitch = useGlitch();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (tweenRef.current) tweenRef.current.kill();

    if (glitch) {
      tweenRef.current = gsap.to(el, {
        duration: 1.1,
        repeat: -1,
        scrambleText: {
          text,
          chars: "@#$%^&*_+-;:,.<>?",
          revealDelay: 0.25,
          speed: 0.4,
        },
      });
    } else {
      tweenRef.current = gsap.to(el, {
        duration: 0.4,
        scrambleText: { text, chars: "@#$%^&*_+-;:,.<>?" },
      });
    }

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [glitch, text]);

  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}