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
import { toast } from "@/components/ui/use-toast";

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
  const [loading, setLoading] = useState<boolean[]>([true, true]);
  const [discussions, setDiscussions] = useState<any>([]);
  const [answers, setAnswers] = useState<any>([]);
  const [sendingAnswer, setSendingAnswer] = useState<boolean>(false);

  const sendAnswer = (e: any) => {
    setSendingAnswer(true);

    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "sendAnswer",
        user_id: (session?.user! as any)._id,
        owner: session?.user?.name,
        content: answerInput,
        dateAnswered: new Date(),
        question_id: params.id
      })
    }).then(res => {
      if (res.ok) res.json()
      else toast({
        title: "Unable to send answer"
      })
    })
      .then(data => {
        fetchAnswers();
      })
  }

  const fetchAnswers = () => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "getAnswers",
        question_id: params.id,
      })
    }).then(res => res.json())
      .then(data => {
        setAnswers(data);
        setLoading([loading[0], false]);
        setSendingAnswer(false);
        setAnswerInput("");
      })
  }

  useEffect(() => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "getDiscussions"
      })
    }).then(res => res.json())
      .then(data => {
        setDiscussions(data.filter((discussion: any) => discussion._id == params.id)[0]);
        setLoading([false, loading[1]]);
      })

    fetchAnswers();
  }, []);

  return (
    <MainLayout loggedIn={true} active="/discussions" className={"relative"}>
      <div className="bg-black w-full flex relative">
        <div className="w-[304px] screen-full min-w-[304px] border-r border-r-neutral-800 py-4 px-3 self-start screen-full sticky top-[49px]">
          <div className="grid gap-2">
            <p className="font-bold text-sm">Owner</p>
            <PeopleCard name={discussions.owner} />
          </div>
          <div className="grid gap-2 mt-4">
            <p className="font-bold text-sm">Answers</p>
            {
              loading[0] && loading[1] ?
                <>
                  <PeopleSkeleton />
                  <PeopleSkeleton />
                  <PeopleSkeleton />
                </>
                :
                // @ts-ignore
                [...new Set(answers)].map((answer: any) => <PeopleCard name={answer.owner} />)
            }
          </div>
        </div>

        <div className="w-full">
          <div className="p-8 grid gap-8">
            <div className="flex flex-col gap-5">
              {
                loading[0] && loading[1] ?
                  <>
                    <Skeleton className="h-8 w-full" />
                    <div className="grid gap-2">
                      <Skeleton className="w-11/12 h-5" />
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-4/5 h-5" />
                    </div>
                    <Skeleton className="w-60 h-5" />
                  </>
                  :
                  <>
                    <PageHeaderTitle>{discussions.topic}</PageHeaderTitle>
                    <ReactMarkdown className="text-neutral-400">{discussions.content}</ReactMarkdown>
                    <p className="text-neutral-500 text-sm">Asked <span className="text-neutral-200">{discussions.asked.toString()}</span></p>
                  </>
              }
            </div>

            <div className="grid gap-4">
              {
                loading[0] && loading[1] ?
                  <AnswerSkeleton />
                  :
                  answers.map((answer: any) => <AnswerCard name={answer.owner} answeredAt={answer.dateAnswered} answer={answer.content} />)
              }
            </div>

            <div className="border-t border-t-neutral-800 pt-4 grid gap-4">
              <h2 className="text-xl font-medium">Your Answer</h2>
              <Textarea disabled={sendingAnswer} placeholder="Write your markdown here..." className="placeholder:text-neutral-500" onChange={e => setAnswerInput(e.target.value.replaceAll("\n", "<br>"))} />
              <p className="text-neutral-400 text-sm">Preview:</p>
              <AnswerCard name={discussions.owner} answeredAt={discussions.asked} answer={answerInput || "Write a text..."} />
              <Button className="w-28" onClick={sendAnswer} disabled={sendingAnswer}>
                Submit
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </MainLayout>
  )
}
