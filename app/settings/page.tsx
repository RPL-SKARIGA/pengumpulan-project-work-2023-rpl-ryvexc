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
  const [prompt, setPrompt] = useState(false);
  const [field, setField] = useState({});
  const [loading, setLoading] = useState(false);
  const [urlData, setUrlData] = useState("");

  const showBinary = (e: any) => {
    const reader = new FileReader();

    reader.onload = e => {
      var binaryString = e.target?.result;
      setPrompt(true)
      setUrlData(binaryString?.toString()!);
    }

    reader.readAsDataURL(e.target.files[0]);
  }

  const setValue = (e: any) => {
    setField({
      ...field,
      [e.target.name]: e.target.value
    })
  }

  const updateUser = async (e: any, change: string) => {
    setLoading(true);

    let request: any;

    if (change == "image") {
      request = await fetch(`/api/v1/userprofile`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: (session?.user as any)?._id || "",
          image: urlData,
          action: "updateImage"
        })
      });
    }

    else if (change == "all") {
      request = await fetch(`/api/v1/userprofile`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id: (session?.user as any)?._id || "",
          ...field,
          action: "updateAll",
        })
      });
    }

    else if (change == "delete") {
      request = await fetch(`/api/v1/userprofile`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: "delete",
        })
      });
    }

    const response = await request.json();

    if (response.modifiedCount > 0) {
      toast({
        title: "Updated!",
        description: "You need to reload if there's no change.",
      });

      setPrompt(false);
    }

    else toast({
      title: "Error!",
      description: "We will fix this soon.",
    });

    setLoading(false);
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

      {
        prompt ?
          <div className="fixed inset-0 z-50 bg-black bg-opacity-70 grid place-items-center">
            <div className="bg-black h-4/5 w-2/5 rounded-2xl overflow-hidden border border-neutral-800">
              <div className="h-5/6 overflow-y-scroll p-6">
                <img src={urlData} alt="" className="object-cover" />
              </div>
              <div className="w-full bg-neutral-950 flex justify-between p-6 border-t border-t-neutral-800">
                <Button variant={"outline"} onClick={e => setPrompt(false)}>Cancel</Button>
                <Button onClick={e => updateUser(e, "image")} disabled={loading}>Set Avatar</Button>
              </div>
            </div>
          </div>
          :
          <></>
      }

      <div className="flex p-12 px-[68px] bg-black">
        <div className="w-96 pr-12">
          <div className="grid">
            <Link href="/settings" className="text-sm font-semibold hover:bg-neutral-900 duration-200 p-3 py-2 rounded">General</Link>
            <Link href="/settings/discussion" className="text-sm text-neutral-400 font-medium hover:bg-neutral-900 duration-200 p-3 py-2 rounded">Discussion</Link>
          </div>
        </div>
        <div className="w-full grid gap-8">
          <OptionCard title="Avatar" footer={<><p className="text-sm text-neutral-400 my-2">An avatar is optional but stongly recomended.</p></>}>
            <div className="relative flex justify-between">
              <p className="text-sm my-3">
                This is your avatar. <br />
                Click on the avatar to upload a custom one from your files.
              </p>
              <div className="absolute -top-7 right-0 rounded-full border border-neutral-600 overflow-hidden max-w-[78px] min-w-[78px] max-h-[78px]">
                <input onChange={showBinary} type="file" className="absolute h-full w-full cursor-pointer opacity-0" />
                <img src={(session?.user as any)?.image || ""} alt="" width={78} height={78} className="" />
              </div>
            </div>
          </OptionCard>

          <OptionCard title="Display Name" footer={
            <>
              <p className="text-sm text-neutral-400">Please use 32 characters at maximum.</p>
              <Button onClick={e => updateUser(e, "all")} disabled={loading}>Save</Button>
            </>
          }>
            <p className="text-sm my-3">
              Please enter your full name, or a display name you are comfortable with.
            </p>
            <Input onChange={setValue} name="name" defaultValue={(session?.user as any)?.name || ""} className="bg-black font-semibold w-80" maxLength={32} />
          </OptionCard>

          <OptionCard title="Email" footer={
            <>
              <p className="text-sm text-neutral-400">We will email you to verify the change.</p>
              <Button disabled>Change</Button>
            </>
          }>
            <p className="text-sm my-3">
              Please enter the email address you want to use to log in with Mywallet.
            </p>
            <Input onChange={setValue} name="email" value={(session?.user as any)?.email || ""} type="email" className="bg-black font-semibold w-80" />
          </OptionCard>

          <OptionCard title="MyWallet ID" footer={<><p className="text-sm text-neutral-400">Used when interacting with the Vercel API.</p></>}>
            <p className="text-sm my-3">
              This is your user ID within Mywallet.
            </p>
            <Input
              onClick={e => {
                (e.target as any).select();
                (e.target as any).setSelectionRange(0, 99999);

                navigator.clipboard.writeText((e.target as any).value)

                toast({
                  title: "Copied!",
                  description: "Your id has been copied"
                })
              }}
              value={(session?.user as any)?._id || ""}
              readOnly={true}
              title="Click to copy"
              className="bg-neutral-950 font-semibold w-80 cursor-pointer"
            />
          </OptionCard>

          <OptionCard danger={true} title="Delete Account" footer={
            <>
              <p className="text-sm text-red-400">We will email you to verify the change.</p>
              <Button className="bg-red-600 text-black" onClick={e => updateUser(e, "delete")} variant={"destructive"}>Delete Personal Account</Button>
            </>
          }>
            <p className="text-sm my-3">
              Permanently remove your Personal Account and all of its contents from the Vercel platform. This action is not reversible, so please continue with caution.
            </p>
          </OptionCard>
        </div>
      </div>

      <Footer />
    </MainLayout>
  )
}
