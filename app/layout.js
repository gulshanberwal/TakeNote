import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Poppins } from 'next/font/google';
import SessionWraper from "@/components/SessionWraper";


const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // optional
  variable: '--font-roboto', // optional for CSS variable
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ChiNote",
  description: "ChiNote - Save Your important Info",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="en" className={poppins.className}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWraper>
        <Navbar className={poppins.className}/>
        {children}
        </SessionWraper>
      </body>
    </html>
  );
}
