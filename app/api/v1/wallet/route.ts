import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "getWallet") {
			const result = await db
				.collection("wallets")
				.find({
					user_id: new ObjectId(body.user_id),
				})
				.toArray();
			return NextResponse.json(result);
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
