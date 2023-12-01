"use client"

import MainLayout from "@/components/MainLayout";
import { PageHeaderTitle } from "@/components/PageHeader";
import { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import profilePicture from "@/public/pfp.svg";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import Footer from "@/components/Footer";
import rehypeRaw from "rehype-raw";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AnswerCard({ name, answeredAt, answer }: { name: string, answeredAt: string, answer: string }) {
  return <div className="items-center p-1 grid gap-2">
    <div className="flex items-center">
      <Image
        width={30}
        src={profilePicture}
        alt="Profile Picture"
        className="rounded-full mr-3"
      />
      <p className="text-xs text-neutral-400"><span className="text-white text-sm">{name}</span> answered {answeredAt}</p>
    </div>
    <ReactMarkdown className="text-neutral-400 text-sm pl-[42px]" rehypePlugins={[rehypeRaw as any]} remarkPlugins={[remarkGfm]}>
      {answer}
    </ReactMarkdown >
  </div >
}

export function AnswerSkeleton() {
  return <div className="items-center p-1 grid gap-2">
    <div className="flex items-center">
      <Skeleton
        className="rounded-full mr-3 w-[30px] h-[30px]"
      />
      <Skeleton className="text-xs text-neutral-400 h-4 w-48"></Skeleton>
    </div>
    <Skeleton className="text-neutral-400 text-sm ml-[42px] h-4" />
  </div >
}

export function PeopleCard({ name }: { name: string }) {
  return <div className="duration-100 border border-neutral-800 bg-neutral-950 rounded-md p-2 flex cursor-default hover:bg-neutral-900">
    <Image
      width={28}
      src={profilePicture}
      alt="Profile Picture"
      className="rounded-full mr-3"
    />
    <p>{name}</p>
  </div>
}

export function PeopleSkeleton() {
  return <div className="duration-100 border border-neutral-800 bg-neutral-950 rounded-md p-2 flex cursor-default hover:bg-neutral-900">
    <Skeleton
      className="rounded-full mr-3 w-7 h-7"
    />
    <Skeleton className="w-24 h-5" />
  </div>
}

export default function Home({ params }: { params: any }) {
  const { data: session } = useSession();
  const [answerInput, setAnswerInput] = useState<string>("");
  const [topicInput, setTopicInput] = useState<string>("");

  const router = useRouter();

  const submitDiscussion = async (e: any) => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "submitDiscussion",
        owner_id: (session?.user! as any)._id,
        asked: new Date(),
        topic: topicInput,
        content: answerInput,
      })
    }).then(res => res.json())
      .then(data => {
        router.replace(data._id)
      })
  }

  return (
    <MainLayout loggedIn={true} active="/discussions" className={"relative"}>
      <div className="bg-black w-full flex relative">
        <div className="w-[304px] screen-full min-w-[304px] border-r border-r-neutral-800 py-4 px-3 self-start screen-full sticky top-[49px]">
          <div className="grid gap-2">
            <p className="font-bold text-sm">Owner</p>
            <PeopleCard name={(session?.user as any)?.username || ""} />
          </div>
        </div>

        <div className="w-full h-full">
          <div className="p-8 grid gap-8">
            <div className="flex flex-col gap-5">
              <input onChange={e => setTopicInput(e.target.value)} className="text-3xl font-medium text-white bg-transparent outline-none" placeholder="This is the discussion title"></input>
              <ReactMarkdown className="text-neutral-400">{answerInput || "This is preview text"}</ReactMarkdown>
              <p className="text-neutral-500 text-sm">Asked <span className="text-neutral-200">18 September 2023 at 08:00</span></p>
            </div>
          </div>

          <div className="border-t border-t-neutral-800 p-8 pt-6 grid gap-4">
            <h2 className="text-xl font-medium">Write Here</h2>
            <Textarea placeholder="Write your markdown here..." className="placeholder:text-neutral-500" onChange={e => setAnswerInput(e.target.value.replaceAll(/\n/gi, '\n &nbsp;'))} />
            <Button className="w-28" onClick={submitDiscussion}>
              Submit
            </Button>
          </div>
          <Footer />
        </div>
      </div>
    </MainLayout>
  )
}
