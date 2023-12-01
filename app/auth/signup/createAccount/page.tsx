"use client";

import MainLayout from "@/components/MainLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Footer from "@/components/Footer";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previousData, setPreviousData] = useState({});
  const [loading, setLoading] = useState<boolean>(false);
  const [componentRendered, setComponentRendered] = useState(false);
  const [usernameAlreadyUsed, setUsernameAlreadyUsed] = useState<boolean>(false);

  const [field, setField] = useState({});

  useEffect(() => {
    fetch(`/api/v1/verify?token=${searchParams.get("token")}`)
      .then(response => {
        if (response.status == 200) {
          return response.json();
        } else[
          toast({
            title: "Something went wrong!",
            description: "We will fix this soon as possible."
          })
        ]
      })
      .then(data => {
        setPreviousData({ ...data });

        setComponentRendered(true);
      })
  }, [])

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const res = await fetch("/api/v1/createAccount", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...field, ...previousData }),
    });

    if (res.status != 200) {
      toast({
        title: "Somthing went wrong!",
        description: "We will fix this later."
      })
      return;
    }

    const data = await res.json();
    if (data.msg) {
      setUsernameAlreadyUsed(true);
      setLoading(false);
    }
    else
      router.push("/auth/signup/createAccount/success");
  }

  return <div>
    <MainLayout active="/auth/signup/createAccount" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      {componentRendered && <>
        <div className="flex flex-col items-center p-6 gap-10">
          <h1 className="font-bold text-4xl text-center text-white">Move On<br />To The Last Steps</h1>
          <div className="flex flex-col gap-[2px] w-[428px]">
            <form className="grid gap-3" onSubmit={handleSubmit}>
              <div>
                <p className="text-neutral-500 mb-1 text-sm">Your username</p>
                <Input name="username" onChange={setValue} className="bg-neutral-950 py-3 rounded-md font-medium" />
                {usernameAlreadyUsed && <p className="text-xs mt-2 text-red-600">Username already used.</p>}
              </div>
              <Button disabled={loading} type="submit" className="text-black mt-3 w-full px-[60px] bg-white hover:bg-white/70 duration-150 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm py-5 text-center inline-flex justify-center items-center mb-2">Continue</Button>
              <p className="text-sm text-neutral-400 text-center">By joining, you agree to our Terms of Service and Privacy Policy</p>
            </form>
          </div>

        </div>

        <div className="p-[37px] border-y border-y-neutral-800 w-full grid place-items-center">
          <Link href="/auth/signup" className="text-blue-500 hover:underline underline-offset-[3px]">Don&apos;t have an account? Sign Up</Link>
        </div>
      </>}
    </MainLayout>
    <Footer />
  </div>
}