"use client"

import { useEffect, useState } from "react"

import vercelIcon from "@/public/vercel.svg";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

function NavbarMenuItem({ children, href, active }: { children: any, href: string, active: boolean }): JSX.Element {
  return <div className={"pb-[6px] flex items-center" + (active ? " border-b-2 border-b-white" : "")}>
    <Link href={href} className={"text-sm text-white hover:bg-neutral-800 hover:text-white duration-150 ease-in px-3 rounded py-[6px]" + (active ? "" : " unactive-navbar")}>{children}</Link>
  </div >
}

export default function Navbar({ active }: { active: string }): JSX.Element {
  const [isHeaderOnScreen, setIsHeaderOnScreen] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsHeaderOnScreen(entry.isIntersecting);
      });
    }, {
      rootMargin: "-2px 0px",
    });

    observer.observe(document.getElementById("header")!);
  }, []);

  return <div className={"w-full flex sticky items-center pt-2 px-4 left-0 right-0 top-0 bg-black border-b border-b-neutral-800 " + (isHeaderOnScreen ? "z-auto" : "z-50")}>
    <div onClick={e => window.scrollTo({ behavior: "smooth", top: 0 })} className={"duration-200 ease-out pb-[26px] relative ml-1 " + (isHeaderOnScreen ? "w-0 opacity-0 -top-3 -right-2" : "w-7 opacity-100 top-0 right-0")}>
      <Image
        priority
        width={20}
        src={vercelIcon}
        alt="Follow us on Twitter"
        className={"absolute"}
      />
    </div>
    <NavbarMenuItem href="/" active={active == "/"}>Overview</NavbarMenuItem>
    <NavbarMenuItem href="/tracking" active={active == "/tracking"}>Tracking</NavbarMenuItem>
    <NavbarMenuItem href="/activity" active={active == "/activity"}>Activity</NavbarMenuItem>
    <NavbarMenuItem href="/transfer" active={active == "/transfer"}>Transfer</NavbarMenuItem>
    <NavbarMenuItem href="/discussions" active={active == "/discussions"}>Discussions</NavbarMenuItem>
    <NavbarMenuItem href="/messages" active={active == "/messages"}>Messages</NavbarMenuItem>
    <NavbarMenuItem href="/settings" active={active == "/settings"}>Settings</NavbarMenuItem>
  </div >
}