import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const _id = searchParams.get("id")!;
		const email = searchParams.get("email")!;

		const result = await db
			.collection("users")
			.findOne({ $or: [{ _id: new ObjectId(_id) }, { email: email }] });

		return new NextResponse(JSON.stringify(result), { status: 200 });
	} catch (e) {
		return new NextResponse(e as any, { status: 400 });
	}
}
