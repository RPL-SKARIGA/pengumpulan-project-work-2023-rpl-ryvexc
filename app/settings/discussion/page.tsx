"use client"

import MainLayout from "@/components/MainLayout";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Footer from "@/components/Footer";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBurger, faCalendar, faCalendarAlt, faMagnifyingGlass, faMarsAndVenus } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { SeparatorHorizontal } from "lucide-react";
import { Separator } from "@radix-ui/react-context-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

export function OptionCard({ title, children, footer, danger }: { title: string, footer: JSX.Element, children: any, danger?: boolean }) {
  if (!danger) return <div className="bg-neutral-950 border border-neutral-800 rounded-md w-full">
    <div className="p-7">
      <h4 className="text-xl font-semibold text-white">{title}</h4>
      {children}
    </div>
    <div className="border-t border-t-neutral-800 p-7 py-4">
      <div className="flex justify-between items-center">
        {footer}
      </div>
    </div>
  </div>

  else return <div className="bg-neutral-950 border border-red-800 rounded-md w-full">
    <div className="p-7">
      <h4 className="text-xl font-semibold text-white">{title}</h4>
      {children}
    </div>
    <div className="bg-red-900 bg-opacity-30 border-t border-t-red-800 p-7 py-4">
      <div className="flex justify-between items-center">
        {footer}
      </div>
    </div>
  </div>
}

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [prompt, setPrompt] = useState(false);
  const [field, setField] = useState({});
  const [loading, setLoading] = useState(false);
  const [urlData, setUrlData] = useState("");
  const [discussions, setDiscussions] = useState([]);

  useEffect(() => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "getDiscussionsByOwner",
        owner_id: (session?.user as any)?._id
      })
    }).then(response => response.json())
      .then(data => {
        setDiscussions(data)
      });
  }, [session]);

  const deleteDiscussion = (e: any, _id: string) => {
    fetch("/api/v1/discussion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "deleteDiscussion",
        discussion_id: _id,
        user_id: (session?.user as any)?._id
      })
    }).then(response => response.json())
      .then(async data => {
        if (data.deleted > 0) {
          window.location.reload();
        }
      });
  }

  return (
    <MainLayout loggedIn={true} active="/settings" className={prompt ? "overflow-hidden" : ""}>
      <PageHeader>
        <PageHeaderTitle>
          <p className="px-10">
            Personal Account Settings
          </p>
        </PageHeaderTitle>
      </PageHeader>

      <div className="flex p-12 px-[68px] bg-black h-screen">
        <div className="w-96 pr-12">
          <div className="grid">
            <Link href="/settings" className="text-sm text-neutral-400 font-medium hover:bg-neutral-900 duration-200 p-3 py-2 rounded">General</Link>
            <Link href="/settings/discussion" className="text-sm font-semibold hover:bg-neutral-900 duration-200 p-3 py-2 rounded">Discussion</Link>
          </div>
        </div>
        <div className="w-full flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-white">Discussion</h2>
          <div className="relative font-medium bg-neutral-950 w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-neutral-600 w-4 h-4" />
            </span>
            <Input type="search" className="focus:border focus:border-neutral-300 py-2 text-sm placeholder:text-neutral-500 placeholder:font-medium rounded-md pl-10" placeholder="Search..." autoComplete="off" />
          </div>
          <div className="bg-neutral-950 border border-neutral-800 p-3 rounded-md flex flex-col gap-3">
            {discussions.length == 0 && <p className="text-center text-sm font-medium">You have no discussion.</p>}
            {discussions.map((discussion: any) => {
              return <div className="flex justify-between items-center border border-neutral-800 rounded px-3 py-2">
                <div className="flex items-center gap-4">
                  <Image src="/pfp.svg" alt="" width={32} height={32} className="rounded-full" />
                  <Link href={"/discussions/" + discussion._id} className="font-bold text-sm hover:underline">{discussion.topic}</Link>
                </div>
                <div className="text-sm flex gap-2 items-center text-neutral-400">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <p>{discussion.asked}</p>
                  <Sheet>
                    <SheetTrigger className="flex items-center">
                      <FontAwesomeIcon icon={faBars} className="ml-2 text-base hover:bg-neutral-900 rounded-md p-3" />
                    </SheetTrigger>
                    <SheetContent className="bg-black/50 backdrop-blur-md">
                      <SheetHeader>
                        <SheetTitle className="border-b border-b-neutral-800 pb-4">Description Information</SheetTitle>
                        <SheetDescription className="flex flex-col h-full justify-between">
                          <div>
                            <h1 className="text-xl font-semibold text-white mb-2 mt-3">{discussion.topic}</h1>
                            <ReactMarkdown className="text-neutral-400 text-sm" rehypePlugins={[rehypeRaw as any]} remarkPlugins={[remarkGfm]}>
                              {discussion.content}
                            </ReactMarkdown >
                          </div>
                          <div className="absolute bottom-5 right-5 left-5 flex gap-5">
                            <Button className="w-full" onClick={e => window.location.href = "/discussions/" + discussion._id}>Visit</Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button className="w-full" variant={"destructive"}>Delete</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-black/90">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Discussion?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    discussion and remove your data from our servers.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={e => deleteDiscussion(e, discussion._id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            })}
          </div>
        </div>
      </div>

      <Footer />
    </MainLayout >
  )
}
