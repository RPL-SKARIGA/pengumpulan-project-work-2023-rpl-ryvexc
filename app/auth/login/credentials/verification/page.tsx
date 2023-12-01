"use client";

import MainLayout from "@/components/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { data: session } = useSession();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [field, setField] = useState({});

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/v1/login/tokenVerify?token=" + (field as any).token);

    if (res.status == 200) {
      const result = await res.json();
      await signIn("credentials", { email: result.email, token: result.token, redirect: false })
      router.push("/");
    } else {
      toast({
        title: "Internal server error",
        description: "We will fix this soon."
      })
    }

    setLoading(false);
  }

  return <div>
    <MainLayout active="/auth/signup/emailsent" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <form className="flex flex-col items-center justify-center h-full gap-5" onSubmit={handleSubmit}>
        <h1 className="font-bold text-4xl text-center text-white">We already send email to you.</h1>
        <Textarea name="token" onChange={setValue} className="font-medium" placeholder="Enter your token here." />
        <Button type="submit" disabled={loading} className='w-full'>Continue</Button>
      </form>
    </MainLayout>
    <Footer />
  </div>
}