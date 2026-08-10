import { Inter_Tight } from "next/font/google";
import localFont from "next/font/local";

export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});

export const ppEditorial = localFont({
  src: "./PPEditorialNew-Ultrabold.otf",
  variable: "--font-pp-editorial",
});

export const fontVariables = [interTight.variable, ppEditorial.variable].join(
  " "
);
