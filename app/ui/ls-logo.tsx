import { montserratAlternates } from "@/app/ui/fonts";

export default function LearnSpaceLogo() {
    return (
        <div className={`${montserratAlternates.className} flex flex-col items-center justify-center gap-4 text-center`}>
            <h1 className={`text-8xl font-bold`}>Learn Space</h1>
            <p className={``}>Empower Your Minds with <i>Learn Space</i></p>
        </div>
    );
}