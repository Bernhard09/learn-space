import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";


export default function LoginForm() {
    return (
        <div className={` rounded-4xl shadow-lg shadow-white/50 flex flex-col items-center justify-center h-150 gap-8 w-md bg-gray-100 text-black`}>
            <h1 className={`text-4xl font-bold `}>Login</h1>
            <p className={`text-lg`}>Please enter your credentials to login.</p>
            <form className={`flex flex-col gap-4`}>
                <input type="email" placeholder="Email" className={`border border-gray-300 rounded p-2`} required />
                <input type="password" placeholder="Password" className={`border border-gray-300 rounded p-2`} required />
                <button type="submit" className={`bg-blue-800 text-white rounded p-2 hover:bg-blue-600 transition duration-200 cursor-pointer`}>Login</button>
            </form>
            <Link 
                href={"/"}
                className="flex flex-row gap-2 " 
            > 
                <ArrowLeftIcon className="w-4"/>  
                Back to Home 
            </Link>
        </div>
    );
}