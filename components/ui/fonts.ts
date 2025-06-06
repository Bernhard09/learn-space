import { Montserrat, Montserrat_Alternates } from "next/font/google";

export const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const montserratAlternates = Montserrat_Alternates({ 
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});