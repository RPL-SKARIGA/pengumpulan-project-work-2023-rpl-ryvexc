import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);

		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const { email, name } = jwt.verify(
			searchParams.get("token")!,
			process.env.JWT_SECRET!,
		) as any;

		return new NextResponse(
			JSON.stringify({
				email,
				name,
			}),
			{ status: 200 },
		);
	} catch (e) {
		return new NextResponse(e as any, { status: 400 });
	}
}
