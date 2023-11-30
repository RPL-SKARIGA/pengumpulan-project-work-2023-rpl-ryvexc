"use client";

import MainLayout from "@/components/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) router.push("/");
  else router.push("/auth/login");

  return <div>
    <MainLayout active="/auth/login" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <div className="flex flex-col items-center p-6 gap-10">
        <h1 className="font-bold text-3xl">Log in to MyWallet</h1>
        <div className="flex flex-col gap-[2px]">
          <button onClick={e => signIn("github")} type="button" className="text-white px-[60px] bg-[#24292F] hover:bg-[#30323a] duration-150 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-base py-3 text-center inline-flex justify-center items-center mb-2">
            <svg className="w-5 h-5 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
            </svg>
            Continue with Github
          </button>
          <button onClick={e => signIn("google")} type="button" className="text-black px-[60px] bg-white hover:bg-white/70 duration-150 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-base py-3 text-center inline-flex justify-center items-center mb-2">
            <svg className="w-5 h-5 mr-2.5" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
            </svg>
            Continue with Google
          </button>
          <div className="h-[1px] bg-neutral-800 w-full my-3"></div>
          <button onClick={e => router.push("/auth/login/credentials")} type="button" className="text-white px-[60px] mt-2 bg-neutral-950 border border-neutral-800 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-base py-3 text-center inline-flex justify-center items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mb-2">
            <FontAwesomeIcon icon={faLock} className="w-5 h-5 mr-2.5" />
            Continue with Credentials
          </button>
        </div>
      </div>

      <div className="p-[37px] border-y border-y-neutral-800 w-full grid place-items-center">
        <Link href="/auth/signup" className="text-blue-500 hover:underline underline-offset-[3px]">Don&apos;t have an account? Sign Up</Link>
      </div>
    </MainLayout>
    <Footer />
  </div>
}