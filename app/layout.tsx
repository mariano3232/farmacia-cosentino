import type { Metadata } from "next";
import { fontVariables, interTight } from "./fonts";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast"
import "./globals.css";

export const metadata: Metadata = {
  title: "Farmacia Cosentino",
  description: "Farmacia Cosentino",
  icons: "/logo.png",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(fontVariables, "h-full font-sans antialiased")}
    >
      <body className={`${interTight.className} flex min-h-full flex-col`}>
        <div className="h-[39px] bg-light-green" />
        <Toaster/>
        <Header />
        <CategoryNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
