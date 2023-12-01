import vercelIcon from "@/public/vercel.svg";
import Image from "next/image";

export default function Footer() {
  return <div className="bg-neutral-950 p-7">
    <Image
      src={vercelIcon}
      alt="App Icon"
      width={24}
    />
  </div>
}