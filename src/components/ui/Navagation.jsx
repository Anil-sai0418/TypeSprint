import { ModeToggle } from "../mode-toggle";

export default function First(){
    return(
        <nav className="flex justify-between items-center bg-gray-500  h-[70px] w-full px-4">
            <div className="h-full flex justify-center items-center">
                <p className="font-bold text-2xl">type</p>
            </div>
            <div>
                <ModeToggle />
            </div>
        </nav>
    )
}