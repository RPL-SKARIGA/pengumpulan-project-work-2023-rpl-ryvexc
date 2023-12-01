import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
	try {
		const client = await clientPromise;
		const db = client.db(process.env.MONGODB_DATABASE);

		const { searchParams } = new URL(req.url);

		let [dataExpense, dataIncome] = [0, 0];

		const receipent_data = await db
			.collection("transactions")
			.find({ receipent_id: new ObjectId(searchParams.get("id")!) })
			.toArray();

		if (receipent_data.length > 0) {
			receipent_data.forEach((data) => {
				dataIncome += data.subtotal - data.fee;
			});
		}

		const receipent_data_expense = await db
			.collection("transactions")
			.find({ user_id: new ObjectId(searchParams.get("id")!) })
			.toArray();

		if (receipent_data_expense.length > 0) {
			receipent_data_expense.forEach((data) => {
				dataExpense += data.subtotal;
			});
		}

		return new NextResponse(
			JSON.stringify({ expense: dataExpense, income: dataIncome }),
			{
				status: 200,
			},
		);
	} catch (e) {
		return new NextResponse(e as any, { status: 500 });
	}
}
