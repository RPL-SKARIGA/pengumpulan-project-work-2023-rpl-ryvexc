"use client";

import MainLayout from "@/components/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();

  const [field, setField] = useState({});
  const [loading, setLoading] = useState(false);
  const [emailAlreadyUsed, setEmailAlreadyUsed] = useState(false);

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/v1/register", {
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

    const data = await res.json();
    if (data.msg) {
      setEmailAlreadyUsed(true);
      setLoading(false);

      toast({
        title: "Email used.",
        description: "try using different email."
      })
    }
    else
      router.push('/auth/signup/emailsent')
  }

  return <div>
    <MainLayout active="/auth/signup" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <div className="flex flex-col justify-center h-full items-center p-6 gap-10">
        <h1 className="font-bold text-4xl text-center text-white">Create Your<br />MyWallet Account</h1>
        <div className="flex flex-col gap-[2px] w-[428px]">
          <form className="grid gap-3" onSubmit={handleSubmit}>
            <div>
              <p className="text-neutral-500 mb-1 text-sm">Your name</p>
              <Input name="name" onChange={setValue} className="bg-neutral-950 py-3 rounded-md font-medium" />
            </div>
            <div>
              <p className="text-neutral-500 mb-1 text-sm">Your Email</p>
              <Input name="email" type="email" onChange={setValue} className="bg-neutral-950 py-3 rounded-md font-medium" />
              {emailAlreadyUsed && <p className="text-xs mt-2 text-red-600">Email already used.</p>}
            </div>
            <Button disabled={loading} type="submit" className="text-black mt-3 w-full px-[60px] bg-white hover:bg-white/70 duration-150 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm py-5 text-center inline-flex justify-center items-center mb-2">Continue</Button>
            <p className="text-sm text-neutral-400 text-center">By joining, you agree to our Terms of Service and Privacy Policy</p>
          </form>
        </div>
      </div>
    </MainLayout>
    <Footer />
  </div>
}