import ButtonScramble from "../ButtonScramble";
import ScrambleText from "../ScrambleText";

export default function About(){
    return(
        <div className="w-full flex flex-col justify-center items-center gap-3 py-3">
            <div className="flex justify-center w-[90%] sm:w-3/4 md:w-2/3">
                <ButtonScramble text={"Back"} hrefLink="/" />
            </div>

            <div className="w-[90%] sm:w-3/4 md:w-2/3 flex flex-col gap-3">
                <ScrambleText
                    as="h1"
                    className="mix-blend-difference text-white text-base sm:text-lg md:text-2xl"
                    text="Based in Brescia, Italy"
                />

                <ScrambleText
                    as="p"
                    className="mix-blend-difference text-white text-xs sm:text-base md:text-lg"
                    text="I've always thrown myself into things without fear of testing myself in different fields, including working abroad. That experience taught me something important: I wanted to build something more stable and concrete. So I started studying web development on my own, later consolidating everything with an intensive online master's program. Today I have solid foundations to take on this new path, along with the drive and eagerness to learn that have always set me apart. I'm ready to put myself out there in this field too, with the same hands-on approach that has guided me so far."
                />
                <ScrambleText
                    as="p"
                    className="mix-blend-difference text-white text-xs sm:text-base md:text-lg"
                    text="email: dattolafrancescoo@gmail.com"
                />
            </div>
        </div>
    )
}