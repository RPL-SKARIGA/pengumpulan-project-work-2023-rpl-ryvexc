"use client";

import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Footer from "@/components/Footer";
import Image from "next/image";
import profilePicture from "@/public/pfp.svg";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

export function DiscussionCard({ href, question }: { href: string, question: string }) {
  return <Link href={"/discussions/" + href} className="border border-neutral-800 bg-black p-6 rounded-lg cursor-pointer">
    <div className="flex items-center gap-x-3">
      <Image
        width={32}
        src={profilePicture}
        alt="Profile Picture"
        className="rounded-full"
      />
      <div>
        <h1 className="font-bold line-clamp-2">{question}</h1>
        <p className="text-sm text-neutral-400">Asked by <b>ryvexc</b></p>
      </div>
    </div>
    <p className="text-sm text-neutral-400 mt-5 text-right">Posted 3h Ago</p>
  </Link>
}

export default function Home() {
  const [discussionData, setDiscussionData] = useState([]);

  useEffect(() => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "action": "getDiscussions"
      })
    }).then(response => response.json())
      .then(data => setDiscussionData(data));
  }, []);


  return (
    <MainLayout loggedIn={true} active="/discussions">
      <div className="w-full px-[76px] pt-6 screen-full">
        <div className="flex w-full gap-3">
          <div className="relative font-medium bg-neutral-950 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-neutral-600 w-4 h-4" />
            </span>
            <Input type="search" className="focus:border focus:border-neutral-300 py-2 text-sm placeholder:text-neutral-500 placeholder:font-medium rounded-md pl-10" placeholder="Search..." autoComplete="off" />
          </div>
          <Button className="w-44 py-5 font-semibold bg-white" onClick={e => window.location.href = "/discussions/create"}>+ Ask a Question</Button>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {discussionData.map((discussion: any) => {
            return <DiscussionCard href={discussion._id} question={discussion.topic} />
          })}
        </div>
      </div>
      <Footer />
    </MainLayout>
  )
}
