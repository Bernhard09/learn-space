import LoginForm from "@/components/login-form";
import style from "../home.module.css";
import Image from "next/image";

export default function Login() {
    return(
        <div className={`${style.container} min-h-screen`}>
            <Image 
                src={"/background.jpeg"}
                alt="background"
                layout="fill"
                objectFit="cover"
                priority />
            <div className={`${style.overlay}`}></div>
            <div className={`${style.content} flex flex-col col-end-2 items-center justify-center h-1/4 `}>
                <LoginForm/>
            </div>
        </div>
    );
}