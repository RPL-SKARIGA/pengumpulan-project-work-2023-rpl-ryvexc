"use client";

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
import Footer from "@/components/Footer";
import { formatIdr } from "@/lib/formatter";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill, faWallet } from "@fortawesome/free-solid-svg-icons";
import { Inter } from "next/font/google";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session } = useSession();

  const [transferValue, setTransferValue] = useState(0);
  const [emailInput, setEmailInput] = useState("");
  const [userdata, setUserdata] = useState<any>([]);
  const [wallet, setWallet] = useState({ wallet: 0 });

  useEffect(() => {
    if ((session?.user! as any)?.email == emailInput) toast({ title: "Don't use your own email.", variant: "destructive" });
    else if ((session?.user! as any)?._id != undefined)
      fetch(`api/v1/users?email=${emailInput}`)
        .then(response => response.json())
        .then(data => {
          setUserdata(data == null ? [] : [data]);
        })
  }, [emailInput]);

  useEffect(() => {
    if (session) fetch("/api/v1/wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "getWallet",
        user_id: (session?.user as any)?._id || "",
      })
    }).then(res => res.json())
      .then(data => {
        setWallet(data[0]);
      })
  }, [session]);

  return (
    <MainLayout loggedIn={true} active="/transfer" className={inter.className}>
      <div className="bg-black w-full flex flex-row-reverse relative">
        <div className="w-[356px] min-w-[356px] border-l border-l-neutral-800 py-4 px-3 self-start screen-full sticky top-[49px]">
          <div className="flex w-full h-full flex-col">
            <div className="w-full flex flex-col gap-3 max-w-md p-5">
              <div className="flex gap-3 mb-4 items-center">
                <FontAwesomeIcon icon={faWallet} className="w-6 h-6" />
                <h1 className="text-lg font-medium">Your Wallet</h1>
              </div>
              <div className="flex justify-between">
                <h2 className="text-neutral-400">Your Wallet</h2>
                <p className="text-neutral-200">{formatIdr(wallet.wallet)}</p>
              </div>
            </div>
            <div className="w-full flex flex-col gap-3 max-w-md p-5">
              <div className="flex gap-3 mb-4 items-center">
                <FontAwesomeIcon icon={faMoneyBill} className="w-6 h-6" />
                <h1 className="text-lg font-medium">Payment Detail</h1>
              </div>
              <div className="flex justify-between">
                <h2 className="text-neutral-400">Total Transaction</h2>
                <p className="text-neutral-200">{formatIdr(transferValue)}</p>
              </div>
              <div className="flex justify-between">
                <h2 className="text-neutral-400">Fee</h2>
                <p className="text-neutral-200">{formatIdr(transferValue * (1 / 100))}</p>
              </div>
              <div className="bg-neutral-800 h-px"></div>
              <div className="flex justify-between">
                <h2 className="text-neutral-400">Subtotal</h2>
                <p className="font-semibold">{formatIdr(transferValue + (transferValue * (1 / 100)))}</p>
              </div>
              <div className="bg-neutral-800 h-px"></div>
              <Button onClick={e => window.location.href = `/payment/gate?source=transfer&nominal=${transferValue}&email=${emailInput}`} className="w-full" disabled={transferValue == 0}>Pay Now</Button>
            </div>
          </div>
        </div>

        <div className="p-8 w-full flex flex-col gap-8">
          <div className="">
            <h1 className="font-bold mb-4 text-2xl">Gathering Information</h1>
            <div className='w-full grid gap-6'>
              <p className="">Put User ID Below and we'll collect some information of it.</p>
              <Input onChange={e => setEmailInput(e.target.value)} className="focus:border-white/30" placeholder="Receipent Email"></Input>
            </div>
          </div>

          {
            userdata.length > 0 ?
              <div className="flex">
                <div className="p-5 grid gap-3 place-items-center border border-neutral-800 rounded-md">
                  <Image className="rounded-full" src={userdata[0]?.image || ""} alt="" width={150} height={150} />
                  <h1 className="font-bold text-2xl text-center">{userdata[0]?.name || ""}</h1>
                  <p className="">{userdata[0]?.email || ""}</p>
                </div>
                <div className="pl-8 w-full">
                  <h1 className="font-bold text-2xl">Payment Information</h1>
                  <p className="my-4">How much do you want to send?.</p>
                  <Input onChange={e => setTransferValue(parseInt(e.target.value.replace(/[^\d]/g, ''), 10))} value={formatIdr(transferValue)} className="focus:border-white/30 w-full" placeholder="Enter Nominal"></Input>
                </div>
              </div>
              : <></>
          }
        </div>
      </div>
    </MainLayout>
  )
}
