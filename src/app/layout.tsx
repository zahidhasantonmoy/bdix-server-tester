import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BDIX Server Test - BDIX.Link",
  description: "We have designed this tool to find all open BDIX servers from our list. It will help you find a working BDIX server and save you time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased text-gray-700`}>
        <nav className="bg-white shadow-md py-4">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link className="text-2xl font-bold text-blue-600" href="/">
              <strong><span>BD</span>IX.link</strong>
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link className="text-gray-700 hover:text-blue-600" href="/site">Sites</Link>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 focus:outline-none">More</button>
                <div className="absolute hidden group-hover:block bg-white shadow-lg rounded-md py-2 mt-2 w-40">
                  <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="/about">About us</Link>
                  <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="/bdix">What is BDIX</Link>
                  <hr className="border-gray-200 my-1" />
                  <Link className="block px-4 py-2 text-gray-700 hover:bg-gray-100" href="/contact">Contact</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex space-x-4">
              <Link className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700" href="/test/speed">Speed test</Link>
              <Link className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600" href="/test/server">Server test</Link>
            </div>
            <button className="md:hidden text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
          </div>
        </nav>
        {children}
        <footer className="bg-gray-100 py-8 mt-8">
          <div className="container mx-auto text-center text-gray-600">
            <p>© 2025, <strong>BDIX</strong>.link · Made with ❤️ for a better web.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}