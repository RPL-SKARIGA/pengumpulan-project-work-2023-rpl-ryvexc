"use client"

import Image from "next/image";

import vercelIcon from "@/public/vercel.svg";
import profilePicture from "@/public/pfp.svg";
import Link from "next/link";

import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@radix-ui/react-alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { signOut, useSession } from "next-auth/react";

export default function Header({ loggedIn, userdata, loginMode }: { loggedIn: boolean, userdata: any, loginMode: boolean }): JSX.Element {
  const router = useRouter();

  if (loggedIn) return <div id="header" className="w-full relative top-0 bg-black pt-[18px] pb-[7px] px-4 flex flex-col">
    <div className="w-full flex items-center justify-between px-2">
      <div className="flex gap-[14px] items-center">
        <Link href="/">
          <Image
            priority
            width={26}
            src={vercelIcon}
            alt="Follow us on Twitter"
          />
        </Link>
        <p className="text-neutral-800 rotate-12">/</p>
        <Link href="/" className="flex gap-[10px] items-center">
          <Image
            width={20}
            height={20}
            src={userdata?.image}
            alt={profilePicture}
            className="rounded-full"
          />
          <p className="font-semibold text-sm">{userdata?.name}</p>
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="#" className="text-sm unactive">Changelog</Link>
        <Link href="#" className="text-sm unactive">Help</Link>
        <Link href="#" className="text-sm unactive">Docs</Link>
        <div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Image
                width={28}
                height={28}
                src={userdata?.image}
                alt={profilePicture}
                className="rounded-full cursor-pointer"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-10 z-40">
              <DropdownMenuLabel>{userdata?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={e => router.replace("/settings")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => router.replace("/activity")}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  <span>Activity</span>
                  <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={e => router.replace("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>New Team</span>
                  <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={e => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>

  else return <div id="header" className="w-full relative top-0 bg-black py-[15px] border-b border-b-neutral-800 px-4 flex flex-col">
    <div className="w-full flex items-center justify-between px-2">
      <div className="flex gap-[14px] items-center">
        <Link href="/">
          <Image
            priority
            width={26}
            src={vercelIcon}
            alt="Follow us on Twitter"
          />
        </Link>
        <Link href="#" className="flex gap-[10px] items-center">
          <p className="font-semibold text-lg">MyWallet</p>
        </Link>
      </div>
      <div className="flex gap-4 items-center">
        {
          loginMode ?
            <Button onClick={e => router.push("/auth/signup")} variant={"outline"} className="font-bold">Sign Up</Button>
            :
            <Button onClick={e => router.push("/auth/login")} variant={"outline"} className="font-bold">Sign In</Button>
        }

      </div>
    </div>
  </div>
}