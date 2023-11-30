"use client";

import { formatIdr } from "@/lib/formatter";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: any }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`/api/v1/transaction?id=${params.id}`).then(response => response.json()).then(data => {
      setData(data);
    })
  }, []);

  return <div className="flex flex-col gap-4 items-center justify-center bg-black h-screen">
    {data.map((receipt: any) => {
      return <div className="flex flex-col w-4/5 max-w-md gap-3 border border-neutral-800 rounded-md justify-center p-5">
        <div className="flex gap-3 mb-4 items-center justify-center">
          <h1 className="text-2xl font-bold text-center">Payment Success</h1>
        </div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400">Invoice</h2>
          <p className="text-neutral-200">INV-{params.id}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400">Receipent Email</h2>
          <p className="text-neutral-200">{receipt.userdata[0].email}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400">Total Transaction</h2>
          <p className="text-neutral-200">{formatIdr(receipt.result[0].total_transaction)}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400">Fee</h2>
          <p className="text-neutral-200">{formatIdr(receipt.result[0].fee)}</p>
        </div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400"></h2>
          <p className="text-neutral-200">Transfer</p>
        </div>
        <div className="bg-neutral-800 h-px"></div>
        <div className="flex justify-between">
          <h2 className="text-neutral-400">Subtotal</h2>
          <p className="font-semibold">{formatIdr(receipt.result[0].subtotal)}</p>
        </div>
      </div>
    })}
  </div>
}