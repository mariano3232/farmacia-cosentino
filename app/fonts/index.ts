import localFont from "next/font/local";

export const nexaText = localFont({
  src: "./NexaText-Trial-Regular.otf",
  variable: "--font-nexa-text",
});

export const nexaTextExtraBold = localFont({
  src: "./NexaText-Trial-ExtraBold.otf",
  variable: "--font-nexa-text-extrabold",
});

export const ppEditorial = localFont({
  src: "./PPEditorialNew-Ultrabold.otf",
  variable: "--font-pp-editorial",
});

export const fontVariables = [
  nexaText.variable,
  nexaTextExtraBold.variable,
  ppEditorial.variable,
].join(" ");
