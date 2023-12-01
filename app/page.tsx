"use client";

import MainLayout from "@/components/MainLayout";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { formatIdr } from "@/lib/formatter";
import { toast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, registerables } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(...registerables);

export default function Home() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState({ wallet: 0 });
  const [totalTransaction, setTotalTransaction] = useState(0);
  const [dataIncomeExpense, setDataIncomeExpense] = useState({ income: 0, expense: 0 });

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
        setLoading(false);
      })

    fetch(`/api/v1/transaction/get?id=${(session?.user as any)?._id || ""}`)
      .then(response => response.json())
      .then(data => {
        setTotalTransaction(data[0].result.length)
      });

    fetch(`/api/v1/trackings/get?date=${new Date().toLocaleString().split(",")[0]}`)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          toast({
            title: `You have ${data.length} ${data.length == 0 ? "no task." : data.length < 1 ? "task " : "tasks "} today.`,
            description: "Want to see all your tasks?",
            action: (
              <ToastAction altText="Go to your tasks." onClick={e => window.location.href = "/tracking"}>Go</ToastAction>
            ),
          })
        }
      })

    fetch(`/api/v1/transaction/getStatus?id=${(session?.user as any)?._id || ""}`)
      .then(response => response.json())
      .then(data => setDataIncomeExpense(data))
  }, [session]);

  return (
    <MainLayout loggedIn={true} active="/">
      <div className="flex-col flex bg-black screen-full">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:bg-neutral-950 duration-150 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Your Wallet
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl bg-white duration-150 font-bold text-transparent bg-clip-text bg-gradient-to-r group-hover:from-blue-600 group-hover:to-teal-600">{formatIdr(wallet.wallet)}</div>
                    <p className="text-xs text-muted-foreground">
                      Your Money
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-neutral-950 duration-150 group cursor-pointer" onClick={e => window.location.href = "/activity"}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Transaction
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl bg-white duration-150 font-bold text-transparent bg-clip-text bg-gradient-to-r group-hover:from-orange-600 group-hover:to-yellow-600">{totalTransaction} Times</div>
                    <p className="text-xs text-muted-foreground">
                      Today Transactions
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-neutral-950 duration-150 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Income</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl bg-white duration-150 font-bold text-transparent bg-clip-text bg-gradient-to-r group-hover:from-green-600 group-hover:to-sky-600">{formatIdr(dataIncomeExpense.income)}</div>
                    <p className="text-xs text-muted-foreground">
                      Today Income
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover:bg-neutral-950 duration-150 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Expenses
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl bg-white duration-150 font-bold text-transparent bg-clip-text bg-gradient-to-r group-hover:from-red-600 group-hover:to-purple-600">{formatIdr(dataIncomeExpense.expense)}</div>
                    <p className="text-xs text-muted-foreground">
                      Today Expenses
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                <Card className="hover:bg-neutral-950 duration-150 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Income Graph
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <Bar data={{
                      labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July"],
                      datasets: [{
                        label: 'Income Graph',
                        data: [65, 59, 80, 81, 56, 55, 40],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 205, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                          'rgb(255, 99, 132)',
                          'rgb(255, 159, 64)',
                          'rgb(255, 205, 86)',
                          'rgb(75, 192, 192)',
                          'rgb(54, 162, 235)',
                          'rgb(153, 102, 255)',
                          'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                      }]
                    }} />
                  </CardContent>
                </Card>
                <Card className="hover:bg-neutral-950 duration-150 group">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Expense Graph
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <Bar data={{
                      labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "July"],
                      datasets: [{
                        label: 'My First Dataset',
                        data: [59, 59, 175, 28, 58, 55, 40],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(255, 159, 64, 0.2)',
                          'rgba(255, 205, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                          'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                          'rgb(255, 99, 132)',
                          'rgb(255, 159, 64)',
                          'rgb(255, 205, 86)',
                          'rgb(75, 192, 192)',
                          'rgb(54, 162, 235)',
                          'rgb(153, 102, 255)',
                          'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1
                      }]
                    }} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </MainLayout>
  )
}
