import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();

		const isAnyUsername = await db
			.collection("users")
			.find({ username: body.username })
			.toArray();

		if (isAnyUsername.length > 0)
			return new NextResponse(
				JSON.stringify({ msg: "Username already used." }),
				{ status: 200 },
			);

		const result = await db.collection("users").insertOne({
			image:
				"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNDRweCIgaGVpZ2h0PSI0NHB4IiB2aWV3Qm94PSIwIDAgODAgODAiIHZlcnNpb249IjEuMSI+DQo8ZGVmcz4NCiAgPGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJnIj4NCiAgPHN0b3Agc3RvcC1jb2xvcj0iI2Y5MDY2ZiIgb2Zmc2V0PSIwJSIvPg0KICA8c3RvcCBzdG9wLWNvbG9yPSIjNmZmOTA2IiBvZmZzZXQ9IjEwMCUiLz4NCiAgPC9saW5lYXJHcmFkaWVudD4NCjwvZGVmcz4NCjxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPg0KICA8cmVjdCBpZD0iUmVjdGFuZ2xlIiBmaWxsPSJ1cmwoI2cpIiB4PSIwIiB5PSIwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiLz4NCjwvZz4NCjwvc3ZnPg==",
			name: body.name,
			email: body.email,
			username: body.username,
		});

		await db.collection("wallets").insertOne({
			user_id: result.insertedId,
			wallet: 0,
		});

		return NextResponse.json(result);
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
