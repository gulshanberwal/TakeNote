"use client";
import React from "react";
import { Poppins } from "next/font/google";
import { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"], // optional
  variable: "--font-roboto", // optional for CSS variable
});

const Navbar = () => {
  const { data: session } = useSession();
  const [profileinfo, setProfileinfo] = useState(false);



  return (
    <>
      <div className={poppins.className}>
        <ul className="flex sm:gap-12 sm:p-1 p-3 px-4 text-l items-center justify-between">
          <li className="flex sm:gap-14 gap-4">
            <div className="font-bold ">ChiNote</div>
            <input className="outline-0 w-48" type="text" placeholder="Search" />
          </li>
          <li className="flex gap-4 items-center">
            {session ? (
              <>
                {" "}
                <img
                  onClick={(e) => { setProfileinfo(!profileinfo); e.stopPropagation() }}
                  className="rounded-full"
                  src={session.user.image}
                  height={40}
                  width={40}
                  alt="image"
                />
                <div
                  className={`${profileinfo == false ? "hidden" : ""
                    } bg-blue-50 text-sm p-2 rounded-xl absolute md:px-6 top-16 right-12 flex flex-col items-center border border-gray-200 shadow-2xl md:w-96 w-80`}
                >
                  <span className="my-2">{session.user.email}</span>
                  <span>
                    <img
                      onClick={() => setProfileinfo(!profileinfo)}
                      className="rounded-full my-2"
                      src={session.user.image}
                      height={80}
                      width={80}
                      alt="image"
                    />
                  </span>
                  <span className="text-2xl ">Hi, {session.user.name}</span>
                  <button
                    onClick={() => signOut()}
                    className=" transition-all duration-300 ease-in-out p-4 bg-white bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-yellow-300 dark:focus:ring-lime-800 font-medium w-full rounded-full shadow-sm hover:shadow-lg my-3"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                type="button"
                className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white hover:bg-gradient-to-br focus:ring-1 focus:outline-none focus:ring-yellow-300 dark:focus:ring-lime-800 font-medium rounded-lg text-sm sm:px-5 px-2 sm:py-2.5 py-1.5 text-center"
              >
                Sign In
              </button>
            )}
          </li>
        </ul>
        <div className="border border-white border-b-gray-300 w-screen"></div>
      </div>
    </>
  );
};

export default Navbar;
