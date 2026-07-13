
import ButtonScramble from "./ButtonScramble";

export default function NavBar(){
    return(
        <nav className="z-50 top-0 p-3 w-full flex flex-col">
            <ButtonScramble hrefLink={"/"} style={"!text-2xl  mix-blend-difference"} text={"FRANCESCO DATTOLA"}/>
            <ButtonScramble text={"works"} hrefLink={"/works"}/>
            <ButtonScramble text={"about"} hrefLink={"/about"}/>
            <ButtonScramble text={"gitHub"} hrefLink={"https://github.com/DattolaFrancesco"} blank={true}/>
            <ButtonScramble text={"email"} hrefLink={"mailto:dattolafrancescoo@gmail.com"}/>
        </nav>
    ) 
}