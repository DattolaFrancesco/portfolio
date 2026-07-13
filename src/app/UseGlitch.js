"use client";

import { useSyncExternalStore } from "react";
import { getGlitch, subscribeGlitch } from "./GlitchStore";

export default function useGlitch() {
  return useSyncExternalStore(subscribeGlitch, getGlitch, () => false);
}