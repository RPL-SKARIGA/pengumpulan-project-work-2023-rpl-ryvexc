"use client";

import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function Home() {
  return <div>
    <MainLayout active="/auth/signup/success" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="font-bold text-4xl text-center text-white">Your Account Has Been Created Successfully</h1>
        <p className="text-sm text-neutral-500"><Link href="/auth/login" className="text-blue-500 underline">Click here</Link> to login.</p>
      </div>
    </MainLayout>
    <Footer />
  </div>
}