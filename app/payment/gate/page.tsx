"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const searchParams = useSearchParams();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      if (searchParams.get("source") == "tracking")
        fetch(`/api/v1/trackings/getById?_id=${searchParams.get("next")}`)
          .then(response => response.json())
          .then(data => {
            const payment_data = data[0];

            console.log({ data });

            fetch("/api/v1/paymentgate", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                user_id: (session?.user as any)?._id || "",
                tracking_id: searchParams.get("next"),
                receipent_email: payment_data.receipent_email,
                name: "Utang",
                total: payment_data.nominal,
                fee: payment_data.nominal * 1 / 100,
                subtotal: payment_data.nominal + payment_data.nominal * 1 / 100,
                payment_type: "Transfer"
              })
            }).then(response => {
              response.json().then(data => {
                if (response.ok) window.location.href = `/payment/receipt/${data.redirect_id}`
                else window.location.href = "/tracking"
              })
            })
          })
      else if (searchParams.get("source") == "transfer") {
        fetch("/api/v1/paymentgate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: (session?.user as any)?._id || "",
            receipent_email: searchParams.get("email"),
            name: "Transfer",
            total: searchParams.get("nominal"),
            fee: parseInt(searchParams.get("nominal")!) * 1 / 100,
            subtotal: parseInt(searchParams.get("nominal")!) + (parseInt(searchParams.get("nominal")!) * 1 / 100),
            payment_type: "Transfer"
          })
        }).then(response => {
          response.json().then(data => {
            if (response.ok) window.location.href = `/payment/receipt/${data.redirect_id}`
            else window.location.href = "/tracking"
          })
        })
      }
    }

    return () => { }
  }, [session]);

  return <div className="flex flex-col gap-4 items-center justify-center bg-black h-screen">
    <h1 className="text-3xl font-bold text-white">Processing Your Transaction</h1>
    <p>It's normal you see this page, we will direct you...</p>
  </div>
}