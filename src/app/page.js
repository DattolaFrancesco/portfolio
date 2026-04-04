import Image from "next/image";
import Ascii from "./components/Ascii"

export default function Home() {
  return (
    <div className="flex items-center justify-center w-full h-[100svh]">
      <Ascii 
  text="francesco"
  cols={18}        // risoluzione orizzontale
  rows={15}        // risoluzione verticale
  speed={100}      // ms per frame
  thresh={1}     // soglia pixel
  gap={2}
  />
  <p>ciao</p>
    </div>
  )
}
