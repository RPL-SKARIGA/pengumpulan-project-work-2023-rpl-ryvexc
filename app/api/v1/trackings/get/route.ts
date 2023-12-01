import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const { searchParams } = new URL(req.url);
		const dayIndex = searchParams.get("date");
		const userId = searchParams.get("user_id");

		const result = await db
			.collection("tracking")
			.find({ $and: [{ date: dayIndex }, { user_id: new ObjectId(userId!) }] })
			.toArray();

		return new NextResponse(JSON.stringify(result), { status: 200 });
	} catch (e) {
		return new NextResponse(e as any, { status: 400 });
	}
}
