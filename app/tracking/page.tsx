"use client"

import MainLayout from "@/components/MainLayout";
import { PageHeader, PageHeaderTitle } from "@/components/PageHeader";
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { formatIdr } from "@/lib/formatter";
import { useEffect, useState } from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { getStartOfWeekMonday } from "@/lib/utils";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ['latin'] })

export function TrackingCard({ dayIndex }: { dayIndex: number }) {
  const { data: session } = useSession();

  const day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [addTrackingValue, setAddTrackingValue] = useState(0);
  const [addTrackingName, setAddTrackingName] = useState("");
  const [addTrackingReceipentEmail, setAddTrackingReceipentEmail] = useState("");
  const [trackings, setTrackings] = useState([]);
  const [thisDayTotal, setThisDayTotal] = useState(0);

  const updateData = () => {
    const date = new Date();
    const dayRange = -(date.getDay() - dayIndex - 1);
    date.setDate(date.getDate() + dayRange);

    fetch(`/api/v1/trackings/get?date=${date.toLocaleString().split(",")[0]}&user_id=${(session?.user as any)?._id || ""}`)
      .then(response => response.json())
      .then(data => {
        setTrackings(data);
        let totalNominal = 0;
        data.forEach((_d: any) => totalNominal += _d.nominal)
        setThisDayTotal(totalNominal);
      })
  }

  useEffect(() => { updateData(); return () => { } }, [session]);

  const insertTracking = (e: any) => {
    const date = new Date();
    const dayRange = -(date.getDay() - dayIndex - 1);
    date.setDate(date.getDate() + dayRange);

    fetch(`/api/v1/trackings/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: (session?.user as any)?._id || "",
        date: date.toLocaleString().split(",")[0],
        name: addTrackingName,
        nominal: addTrackingValue,
        receipent_email: addTrackingReceipentEmail,
      })
    })
      .then(response => {
        if (response.ok) updateData();
      })
  }

  const handleDragDrop = (results: any) => {
    const { source, destination, type } = results;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    if (type === "group") {
      const reorderedTrackings = [...trackings];

      const sourceIndex = source.index;
      const destinationIndex = destination.index;

      const [removedTrack] = reorderedTrackings.splice(sourceIndex, 1);
      reorderedTrackings.splice(destinationIndex, 0, removedTrack);

      return setTrackings(reorderedTrackings);
    }
  }

  const handleMove = (e: any, track: any, direction: "left" | "right") => {
    let currentDate = new Date(track.date);
    const indexedDay = direction === "right" ? 1 : direction === "left" ? -1 : 0;
    if (getStartOfWeekMonday(new Date()).toLocaleDateString().split(",")[0] == track.date && indexedDay == -1) {
      toast({
        title: "Unable to move left!",
        description: "Left side is not current week, so..",
        variant: "destructive"
      })

      return;
    }
    currentDate.setDate(currentDate.getDate() + indexedDay);

    fetch("/api/v1/trackings/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: track._id,
        date: currentDate.toLocaleString().split(",")[0]
      })
    }).then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        toast({
          title: "Unable to move this."
        })
      }
    });
  }

  const handleDelete = (e: any, track: any) => {
    fetch("/api/v1/trackings/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id: track._id,
      })
    }).then(response => {
      if (response.ok) {
        window.location.reload();
      } else {
        toast({
          title: "Unable to move this."
        })
      }
    });
  }

  return <DragDropContext onDragEnd={handleDragDrop}>
    <div className="bg-black p-4 pb-1 flex-1 min-w-[300px] rounded-xl border border-neutral-800">
      <div className="border-b border-b-neutral-800 items-center pb-3 flex w-full justify-between">
        <h1 className="font-semibold">{day[dayIndex]} - {formatIdr(thisDayTotal)}</h1>
        <AlertDialog>
          <AlertDialogTrigger><FontAwesomeIcon icon={faPlus} className="cursor-pointer" /></AlertDialogTrigger>
          <AlertDialogContent className="bg-black">
            <AlertDialogHeader>
              <AlertDialogTitle>Add Tracking</AlertDialogTitle>
              <AlertDialogDescription className="gap-3 grid">
                <Input onChange={e => setAddTrackingName(e.target.value)} className="focus:border focus:border-white placeholder:text-white/30 font-semibold" placeholder="Tracking Name"></Input>
                <Input onChange={e => setAddTrackingReceipentEmail(e.target.value)} className="focus:border focus:border-white placeholder:text-white/30 font-semibold" placeholder="Receipent Email"></Input>
                <Input onChange={e => setAddTrackingValue(parseInt(e.target.value.replace(/[^\d]/g, ''), 10))} value={formatIdr(addTrackingValue)} className="focus:border focus:border-white placeholder:text-white/30 font-semibold" placeholder="Value"></Input>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={insertTracking}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Droppable droppableId="ROOT" type="group">
        {(provided: any) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="pt-3 grid">
            {trackings.map((track: any, index: number) => {
              return <ContextMenu>
                <ContextMenuTrigger>
                  <Draggable draggableId={track._id as string} key={track._id as string} index={index}>
                    {(provided) => {
                      return <div className="border border-neutral-800 p-3 bg-neutral-950 rounded-md mb-3" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                        <p className="text-sm">{track.name} <span className="text-neutral-600">to</span> <span className="text-neutral-400">{track.receipent_email}</span></p>
                        <p className="text-sm font-semibold rounded">{formatIdr(track.nominal)}</p>
                      </div>
                    }}
                  </Draggable>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={e => window.location.href = `/payment/gate?next=${track._id}&source=tracking`}>Pay Now</ContextMenuItem>
                  <ContextMenuItem onClick={e => handleMove(e, track, "left")}>Move Left</ContextMenuItem>
                  <ContextMenuItem onClick={e => handleMove(e, track, "right")}>Move Right</ContextMenuItem>
                  <ContextMenuItem onClick={e => handleDelete(e, track)}>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  </DragDropContext>
}

export default function Home() {
  return (
    <MainLayout loggedIn={true} active="/tracking">
      <PageHeader>
        <PageHeaderTitle>Tracking</PageHeaderTitle>
      </PageHeader>

      <div className={"flex flex-wrap gap-6 p-6 " + inter.className}>
        <TrackingCard dayIndex={0} />
        <TrackingCard dayIndex={1} />
        <TrackingCard dayIndex={2} />
        <TrackingCard dayIndex={3} />
        <TrackingCard dayIndex={4} />
        <TrackingCard dayIndex={5} />
        <TrackingCard dayIndex={6} />
      </div>
    </MainLayout>
  )
}
