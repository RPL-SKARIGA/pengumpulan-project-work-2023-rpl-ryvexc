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

export default function Home() {
  const { data: session } = useSession();

  const [field, setField] = useState({});

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(field),
    });

    if (res.status == 200) {
      redirect('/auth/signup/emailsent')
    }
  }

  return <div>
    <MainLayout active="/auth/signup/emailsent" loggedIn={false} className="bg-black h-screen flex items-center justify-between flex-col">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="font-bold text-4xl text-center text-white">Email Sent!</h1>
        <p className="text-sm text-neutral-500">Check your email to continue registration.</p>
      </div>
    </MainLayout>
    <Footer />
  </div>
}