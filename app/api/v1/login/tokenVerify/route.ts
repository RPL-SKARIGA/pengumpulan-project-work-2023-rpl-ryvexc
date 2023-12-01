import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const { email } = jwt.verify(
			searchParams.get("token")!,
			process.env.JWT_SECRET!,
		) as any;

		const result = await db
			.collection("users")
			.find({ email: email })
			.toArray();

		if (result.length > 0) {
			await db.collection("activities").insertOne({
				user_id: result[0]._id,
				activity: "logged in via Credentials",
				date: new Date(),
			});

			return new NextResponse(
				JSON.stringify({
					email,
					token: searchParams.get("token"),
				}),
				{ status: 200 },
			);
		} else
			return new NextResponse(JSON.stringify({ msg: "No Account." }), {
				status: 400,
			});
	} catch (e) {
		return new NextResponse(e as any, { status: 500 });
	}
}
