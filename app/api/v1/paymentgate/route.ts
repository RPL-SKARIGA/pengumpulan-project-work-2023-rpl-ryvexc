import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const body = await req.json();

		const receipent_data = await db
			.collection("users")
			.find({ email: body.receipent_email })
			.toArray();

		if (body.tracking_id)
			await db.collection("tracking").deleteOne({
				_id: new ObjectId(body.tracking_id),
			});

		const transactionResult = await db.collection("transactions").insertOne({
			user_id: new ObjectId(body.user_id),
			receipent_id: receipent_data[0]._id,
			total_transaction: body.total,
			fee: body.fee,
			subtotal: body.subtotal,
			payment_type: body.payment_type,
			date: new Date(),
		});

		// update sender and receiver
		await db.collection("wallets").updateOne(
			{ user_id: new ObjectId(body.user_id) },
			{
				$inc: {
					wallet: -parseInt(body.subtotal),
				},
			},
		);

		await db.collection("wallets").updateOne(
			{ user_id: receipent_data[0]._id },
			{
				$inc: {
					wallet: parseInt(body.total),
				},
			},
		);

		if (transactionResult.insertedId) {
			await db.collection("activities").insertOne({
				user_id: new ObjectId(body.user_id),
				activity: `pay for ${receipent_data[0].email} with nominal: ${body.subtotal}.`,
				date: new Date(),
			});

			await db.collection("activities").insertOne({
				user_id: new ObjectId(receipent_data[0]._id),
				activity: `receive a money from ${body.user_id}, nominal: ${body.subtotal}`,
				date: new Date(),
			});
		}

		return new NextResponse(
			JSON.stringify({ redirect_id: transactionResult.insertedId }),
			{
				status: 200,
			},
		);
	} catch (e) {
		console.log(e);
		return new NextResponse(e as any, { status: 500 });
	}
}
