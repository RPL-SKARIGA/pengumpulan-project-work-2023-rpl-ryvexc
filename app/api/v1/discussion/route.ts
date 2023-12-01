import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();
		const action = body.action;

		if (action == "getDiscussions") {
			const result = await db.collection("discussion").find({}).toArray();
			return NextResponse.json(result);
		}

		if (action == "getDiscussionsByOwner") {
			const result = await db
				.collection("discussion")
				.find({ owner: body.owner_id })
				.toArray();
			return NextResponse.json(result);
		}

		if (action == "getAnswers") {
			const result = await db
				.collection("answers")
				.find({
					question_id: new ObjectId(body.question_id),
				})
				.toArray();
			return NextResponse.json(result);
		}

		if (action == "sendAnswer") {
			const result = await db.collection("answers").insertOne({
				owner: body.owner,
				dateAnswered: body.dateAnswered,
				content: body.content,
				question_id: new ObjectId(body.question_id),
				user_id: body.user_id,
			});

			await db.collection("activities").insertOne({
				user_id: new ObjectId(body.user_id),
				activity: `Answering a question for discussion with ID: ${body.question_id}`,
				date: new Date(),
			});

			return NextResponse.json(result);
		}

		if (action == "deleteDiscussion") {
			const result = await db.collection("discussion").deleteOne({
				_id: new ObjectId(body.discussion_id),
			});

			const resultActivity = await db.collection("activities").insertOne({
				user_id: new ObjectId(body.user_id),
				activity: `You've been deleting a discussion with ID: ${body.discussion_id}, now you will not able to open that again.`,
				date: new Date(),
			});

			return NextResponse.json({
				deleted: result.deletedCount > 0 && resultActivity.insertedId,
			});
		}

		if (action == "submitDiscussion") {
			const result = await db.collection("discussion").insertOne({
				topic: body.topic,
				content: body.content,
				owner: body.owner_id,
				asked: body.asked,
			});

			await db.collection("activities").insertOne({
				user_id: new ObjectId(body.owner_id),
				activity: `You've created a discussion, ID: ${result.insertedId}`,
				date: new Date(),
			});

			return NextResponse.json({ _id: result.insertedId });
		}
	} catch (e) {
		return new NextResponse("", { status: 400 });
	}
}
