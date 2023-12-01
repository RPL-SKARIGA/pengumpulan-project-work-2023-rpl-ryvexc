import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const { searchParams } = new URL(req.url);

		const result = await db
			.collection("transactions")
			.find({
				$or: [
					{ receipent_id: new ObjectId(searchParams.get("id")!) },
					{ user_id: new ObjectId(searchParams.get("id")!) },
				],
			})
			.toArray();

		return new NextResponse(JSON.stringify([{ result }]), {
			status: 200,
		});
	} catch (e) {
		return new NextResponse(e as any, { status: 400 });
	}
}
