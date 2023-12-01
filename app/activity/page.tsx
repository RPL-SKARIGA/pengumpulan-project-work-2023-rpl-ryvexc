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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import profilePicture from "@/public/pfp.svg"
import Image from "next/image";
import { useSession } from "next-auth/react";

export function DateSelectionMenu({ children, href }: { children: any, href: string }) {
  return <a href={"/activity?range=" + href} className="hover:bg-neutral-800 p-2 py-2 text-sm rounded-sm font-medium">{children}</a>
}

export function ClientActivity({ name, activity, rangeFromNow, session }: { name: string, activity: string, rangeFromNow: string, session: any }) {
  return <div className="flex justify-between w-full items-center p-1">
    <div className="flex items-center">
      <Image
        width={30}
        height={30}
        src={(session?.user as any)?.image}
        alt="Profile Picture"
        className="rounded-full mr-3"
      />
      <p className="text-sm text-neutral-400"><span className="text-white">{name}</span> {activity}</p>
    </div>
    <p className="text-sm text-neutral-400">{rangeFromNow}</p>
  </div>
}

export default function Home() {
  const { data: session } = useSession();
  const currentDate = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = months[currentDate.getMonth()];

  const params = useSearchParams();
  const range = params.get("range") || "last3day";

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("/api/v1/activities", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        user_id: (session?.user as any)?._id,
        action: "getActivity"
      })
    }).then(res => res.json())
      .then((data: any) => {
        setActivities(data);
      })
  }, [session]);

  const useClientAble = () => {
    if (range == "lastday") return "Last Day";
    else if (range == "last3day") return "Last 3 Day";
    else if (range == "last7day") return "Last 7 Day";
    else if (range == "last14day") return "Last 14 Day";
    else if (range == "last30day") return "Last 30 Day";
    else if (range == "last3months") return "Last 3 Months";
    else if (range == "last12months") return "Last 12 Month";
    else "?";
  }

  return (
    <MainLayout loggedIn={true} active="/activity" className={"relative"}>
      <PageHeader>
        <PageHeaderTitle>Activity</PageHeaderTitle>
      </PageHeader>
      <div className="bg-black w-full flex relative">
        <div className="w-[304px] min-w-[304px] border-r border-r-neutral-800 py-4 px-3 self-start screen-full sticky top-[49px]">
          <p className="font-bold text-sm mb-4">Filters</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={"w-full hover:border-neutral-600 bg-neutral-950 justify-start text-left font-normal py-5 rounded-none rounded-tr-md rounded-tl-md"}
              >
                <ClockIcon className="mr-2 h-4 w-4" />
                <p>{useClientAble()}</p>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[278px] relative top-1 p-0">
              <div className="flex flex-col p-2 border-r border-r-neutral-800 bg-neutral-950">
                <DateSelectionMenu href="lastday">Last Day</DateSelectionMenu>
                <DateSelectionMenu href="last3day">Last 3 Day</DateSelectionMenu>
                <DateSelectionMenu href="last7day">Last 7 Day</DateSelectionMenu>
                <DateSelectionMenu href="last14day">Last 14 Day</DateSelectionMenu>
                <DateSelectionMenu href="last30day">Last 30 Day</DateSelectionMenu>
                <DateSelectionMenu href="last3months">Last 3 Months</DateSelectionMenu>
                <DateSelectionMenu href="last12months">Last 12 Months</DateSelectionMenu>
              </div>
            </PopoverContent>
          </Popover>
          <DatePickerWithRange className="[&>button]:w-full" />
        </div>

        <div className="p-3 w-full grid gap-8">
          <div>
            <h2 className="font-bold mb-6">{monthName} {currentDate.getFullYear()}</h2>
            <div className='w-full grid gap-6 pl-2'>
              {activities.map((activity: any) => <ClientActivity session={session} name="You" activity={activity.activity} rangeFromNow={(activity.date as string).split("T")[0]} />)}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
