import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "updateImage") {
			const result = await db.collection("users").updateOne(
				{ _id: new ObjectId(body._id) },
				{
					$set: {
						image: body.image,
					},
				},
			);

			await db.collection("activities").insertOne({
				user_id: new ObjectId(body._id),
				activity: "Updated your profile picture",
				date: new Date(),
			});

			return NextResponse.json(result);
		} else if (action == "updateAll") {
			const result = await db.collection("users").updateOne(
				{ _id: new ObjectId(body._id) },
				{
					$set: {
						name: body.name,
					},
				},
			);

			await db.collection("activities").insertOne({
				user_id: new ObjectId(body._id),
				activity: "Changed your name",
				date: new Date(),
			});

			return NextResponse.json(result);
		} else if (action == "delete") {
			const result = await db.collection("users").updateOne(
				{ _id: new ObjectId(body._id) },
				{
					$set: {
						name: body.name,
					},
				},
			);
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
