"use client";

import MainLayout from "@/components/MainLayout";
import Link from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();

  const [field, setField] = useState({});
  const [loading, setLoading] = useState(false);

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/v1/login/verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(field),
    });

    if (res.status != 200) {
      toast({
        title: "Somthing went wrong!",
        description: "Email couldn't be sent, check your email!"
      })

      setLoading(false);

      return;
    }
    else
      router.push('/auth/login/credentials/verification')
  }

  return <div>
    <MainLayout active="/auth/login" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <div className="flex flex-col justify-center items-center p-6 gap-10 h-full">
        <h1 className="font-bold text-4xl text-center text-white">Log in to MyWallet</h1>
        <div className="flex flex-col gap-[2px] w-[428px]">
          <form className="grid gap-2" onSubmit={handleSubmit}>
            <Input name="email" placeholder="Email Address" onChange={setValue} className="placeholder:text-neutral-500 font-medium bg-neutral-950 py-3 rounded-md" />
            <Button disabled={loading} type="submit" className="text-black mt-3 w-full px-[60px] bg-white hover:bg-white/70 duration-150 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm py-5 text-center inline-flex justify-center items-center mb-2">Continue</Button>
            <Link href="/auth/login" className="text-sm text-blue-500 text-center hover:underline">&larr; Other Login Options</Link>
          </form>
        </div>
      </div>
    </MainLayout>
    <Footer />
  </div>
}