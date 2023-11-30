import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();

		await db
			.collection("tracking")
			.updateOne(
				{ _id: new ObjectId(body._id) },
				{ $set: { date: body.date } },
			);

		return new NextResponse(JSON.stringify({ msg: "" }), { status: 200 });
	} catch (e) {
		return new NextResponse(e as any, { status: 500 });
	}
}
