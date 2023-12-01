import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "getActivity") {
			let result = await db
				.collection("activities")
				.find({
					user_id: new ObjectId(body.user_id),
				})
				.toArray();

			result = result.reverse();

			return NextResponse.json(result);
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
